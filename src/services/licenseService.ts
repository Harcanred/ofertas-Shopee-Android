import { License } from '../types';
import { INITIAL_LICENSES } from '../data/seedData';
import { db, OperationType, handleFirestoreError } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const LICENSES_STORAGE_KEY = 'central_ofertas_licenses_v1';
const CURRENT_DEVICE_KEY = 'central_ofertas_device_id';
const ACTIVE_LICENSE_KEY = 'central_ofertas_active_license';

// Generate or get existing device ID
export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(CURRENT_DEVICE_KEY);
  if (!deviceId) {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(4)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    deviceId = `DEV-ANDR-${randomHex}`;
    localStorage.setItem(CURRENT_DEVICE_KEY, deviceId);
  }
  return deviceId;
}

// Local cache methods
export function getStoredLicenses(): License[] {
  try {
    const data = localStorage.getItem(LICENSES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading licenses from cache', e);
  }
  localStorage.setItem(LICENSES_STORAGE_KEY, JSON.stringify(INITIAL_LICENSES));
  return INITIAL_LICENSES;
}

export function saveStoredLicenses(licenses: License[]) {
  localStorage.setItem(LICENSES_STORAGE_KEY, JSON.stringify(licenses));
}

// Subscribe to real-time licenses updates from Firestore
export function subscribeToLicenses(callback: (licenses: License[]) => void): () => void {
  const licensesCol = collection(db, 'licenses');

  const unsubscribe = onSnapshot(
    licensesCol,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, bootstrap with seed licenses
        bootstrapInitialLicenses();
        callback(getStoredLicenses());
        return;
      }

      const remoteLicenses: License[] = [];
      snapshot.forEach(docSnap => {
        remoteLicenses.push(docSnap.data() as License);
      });

      // Sort by creation date descending
      remoteLicenses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      saveStoredLicenses(remoteLicenses);
      callback(remoteLicenses);
    },
    (error) => {
      console.warn('Firestore subscription fallback to cache:', error);
      // Fallback to cache without throwing fatal unhandled exception
      callback(getStoredLicenses());
    }
  );

  return unsubscribe;
}

// Bootstrap initial licenses to Firestore if empty
async function bootstrapInitialLicenses() {
  try {
    for (const lic of INITIAL_LICENSES) {
      await setDoc(doc(db, 'licenses', lic.id), lic);
    }
  } catch (err) {
    console.warn('Bootstrap to Firestore notice:', err);
  }
}

// Generate cryptographically secure license key OFERTA-XXXX-XXXX-XXXX
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const generateSegment = (length: number) => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(byte => chars[byte % chars.length])
      .join('');
  };
  return `OFERTA-${generateSegment(4)}-${generateSegment(4)}-${generateSegment(4)}`;
}

export interface ActivationResult {
  success: boolean;
  status: 'ativada' | 'inválida' | 'bloqueada' | 'expirada' | 'limite atingido' | 'sem conexão';
  message: string;
  license?: License;
}

// Validate and activate license for this device (Cloud + Cache)
export async function activateLicenseKey(rawKey: string): Promise<ActivationResult> {
  const cleanKey = rawKey.trim().toUpperCase();
  const deviceId = getOrCreateDeviceId();

  let targetLicense: License | null = null;

  // 1. Try fetching directly from Firestore
  try {
    const querySnapshot = await getDocs(collection(db, 'licenses'));
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data() as License;
      if (data.key.toUpperCase() === cleanKey) {
        targetLicense = data;
      }
    });
  } catch (error) {
    console.warn('Firestore fetch failed, checking local cache', error);
  }

  // 2. If not found in Firestore response, check cache
  if (!targetLicense) {
    const cached = getStoredLicenses();
    targetLicense = cached.find(l => l.key.toUpperCase() === cleanKey) || null;
  }

  if (!targetLicense) {
    return {
      success: false,
      status: 'inválida',
      message: 'Chave de ativação não encontrada ou inválida.',
    };
  }

  if (targetLicense.status === 'blocked') {
    return {
      success: false,
      status: 'bloqueada',
      message: 'Esta licença foi temporariamente bloqueada pelo administrador.',
    };
  }

  const now = new Date();
  const expiry = new Date(targetLicense.expiresAt);
  if (now > expiry) {
    return {
      success: false,
      status: 'expirada',
      message: `Esta licença expirou em ${expiry.toLocaleDateString('pt-BR')}.`,
    };
  }

  // Check device limit
  if (targetLicense.activeDeviceId && targetLicense.activeDeviceId !== deviceId) {
    return {
      success: false,
      status: 'limite atingido',
      message: `Limite de 1 dispositivo atingido. Esta chave já está vinculada a outro celular (${targetLicense.activeDeviceModel || 'Dispositivo anterior'}). Solicite a liberação ao administrador Ronaldo Costa.`,
    };
  }

  // Activate license for this device
  const updatedLicense: License = {
    ...targetLicense,
    status: 'active',
    activeDeviceId: deviceId,
    activeDeviceModel: 'Android (Dispositivo Atual)',
    activatedAt: targetLicense.activatedAt || new Date().toISOString(),
  };

  // Sync to Firestore
  try {
    await setDoc(doc(db, 'licenses', updatedLicense.id), updatedLicense, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `licenses/${updatedLicense.id}`);
  }

  // Update local cache
  const cachedAll = getStoredLicenses().map(l => l.id === updatedLicense.id ? updatedLicense : l);
  saveStoredLicenses(cachedAll);
  localStorage.setItem(ACTIVE_LICENSE_KEY, JSON.stringify(updatedLicense));

  return {
    success: true,
    status: 'ativada',
    message: `Aplicativo ativado com sucesso para ${updatedLicense.clientName}!`,
    license: updatedLicense,
  };
}

// Get currently active license
export function getActiveLicense(): License | null {
  try {
    const raw = localStorage.getItem(ACTIVE_LICENSE_KEY);
    if (raw) {
      const active: License = JSON.parse(raw);
      const all = getStoredLicenses();
      const fresh = all.find(l => l.id === active.id);
      if (fresh) {
        if (fresh.status === 'blocked' || (fresh.activeDeviceId && fresh.activeDeviceId !== getOrCreateDeviceId())) {
          localStorage.removeItem(ACTIVE_LICENSE_KEY);
          return null;
        }
        return fresh;
      }
    }
  } catch (e) {
    console.error('Error getting active license', e);
  }
  return null;
}

// Deactivate device
export async function logoutLicense(): Promise<void> {
  const current = getActiveLicense();
  if (current) {
    const updated: License = {
      ...current,
      activeDeviceId: undefined,
      activeDeviceModel: undefined,
      status: 'available',
    };

    try {
      await updateDoc(doc(db, 'licenses', current.id), {
        activeDeviceId: null,
        activeDeviceModel: null,
        status: 'available',
      });
    } catch (e) {
      console.warn('Firestore logout sync', e);
    }

    const all = getStoredLicenses().map(l => l.id === current.id ? updated : l);
    saveStoredLicenses(all);
  }
  localStorage.removeItem(ACTIVE_LICENSE_KEY);
}

// Admin Operations (Cloud Firestore + Local Cache)
export async function createNewLicense(params: {
  clientName: string;
  notes?: string;
  durationMonths: number;
  deviceLimit?: number;
}): Promise<License> {
  const key = generateLicenseKey();
  const now = new Date();
  const expires = new Date();
  expires.setMonth(now.getMonth() + (params.durationMonths || 12));
  const licenseId = `lic-${Date.now()}`;

  const newLicense: License = {
    id: licenseId,
    key,
    clientName: params.clientName.trim(),
    notes: params.notes?.trim() || '',
    status: 'available',
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    deviceLimit: params.deviceLimit || 1,
  };

  // Sync to Firestore
  try {
    await setDoc(doc(db, 'licenses', licenseId), newLicense);
  } catch (err) {
    console.error('Error creating license in Firestore:', err);
  }

  // Update local cache
  const all = getStoredLicenses();
  all.unshift(newLicense);
  saveStoredLicenses(all);

  return newLicense;
}

export async function releaseLicenseDevice(licenseId: string): Promise<boolean> {
  // Update Firestore
  try {
    await updateDoc(doc(db, 'licenses', licenseId), {
      activeDeviceId: null,
      activeDeviceModel: null,
      status: 'available',
    });
  } catch (err) {
    console.error('Error releasing device in Firestore:', err);
  }

  const all = getStoredLicenses();
  const lic = all.find(l => l.id === licenseId);
  if (lic) {
    lic.activeDeviceId = undefined;
    lic.activeDeviceModel = undefined;
    lic.status = 'available';
    saveStoredLicenses(all);
  }

  const active = getActiveLicense();
  if (active && active.id === licenseId) {
    localStorage.removeItem(ACTIVE_LICENSE_KEY);
  }
  return true;
}

export async function toggleBlockLicense(licenseId: string): Promise<License | null> {
  const all = getStoredLicenses();
  const lic = all.find(l => l.id === licenseId);
  if (!lic) return null;

  const nextStatus = lic.status === 'blocked' ? (lic.activeDeviceId ? 'active' : 'available') : 'blocked';
  lic.status = nextStatus;

  // Sync to Firestore
  try {
    await updateDoc(doc(db, 'licenses', licenseId), {
      status: nextStatus,
    });
  } catch (err) {
    console.error('Error toggling block in Firestore:', err);
  }

  saveStoredLicenses(all);

  if (lic.status === 'blocked') {
    const active = getActiveLicense();
    if (active && active.id === licenseId) {
      localStorage.removeItem(ACTIVE_LICENSE_KEY);
    }
  }
  return lic;
}

export async function renewLicense(licenseId: string, additionalMonths = 12): Promise<License | null> {
  const all = getStoredLicenses();
  const lic = all.find(l => l.id === licenseId);
  if (!lic) return null;

  const currentExpiry = new Date(lic.expiresAt);
  const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
  baseDate.setMonth(baseDate.getMonth() + additionalMonths);
  lic.expiresAt = baseDate.toISOString();
  if (lic.status === 'expired') {
    lic.status = lic.activeDeviceId ? 'active' : 'available';
  }

  // Sync to Firestore
  try {
    await updateDoc(doc(db, 'licenses', licenseId), {
      expiresAt: lic.expiresAt,
      status: lic.status,
    });
  } catch (err) {
    console.error('Error renewing license in Firestore:', err);
  }

  saveStoredLicenses(all);
  return lic;
}

export async function revokeLicense(licenseId: string): Promise<boolean> {
  // Delete from Firestore
  try {
    await deleteDoc(doc(db, 'licenses', licenseId));
  } catch (err) {
    console.error('Error deleting license from Firestore:', err);
  }

  let all = getStoredLicenses();
  all = all.filter(l => l.id !== licenseId);
  saveStoredLicenses(all);

  const active = getActiveLicense();
  if (active && active.id === licenseId) {
    localStorage.removeItem(ACTIVE_LICENSE_KEY);
  }
  return true;
}
