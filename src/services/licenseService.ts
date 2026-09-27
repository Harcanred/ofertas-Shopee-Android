import { License } from '../types';
import { INITIAL_LICENSES } from '../data/seedData';

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

// Get all licenses from storage (or seed with initial)
export function getStoredLicenses(): License[] {
  try {
    const data = localStorage.getItem(LICENSES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading licenses', e);
  }
  // Initialize with seed
  localStorage.setItem(LICENSES_STORAGE_KEY, JSON.stringify(INITIAL_LICENSES));
  return INITIAL_LICENSES;
}

export function saveStoredLicenses(licenses: License[]) {
  localStorage.setItem(LICENSES_STORAGE_KEY, JSON.stringify(licenses));
}

// Generate cryptographically secure license key OFERTA-XXXX-XXXX-XXXX
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // excluding ambiguous chars
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

// Validate and activate license for this device
export async function activateLicenseKey(rawKey: string): Promise<ActivationResult> {
  const cleanKey = rawKey.trim().toUpperCase();
  const deviceId = getOrCreateDeviceId();
  
  // Simulate network roundtrip
  await new Promise(r => setTimeout(r, 650));

  const licenses = getStoredLicenses();
  const license = licenses.find(l => l.key.toUpperCase() === cleanKey);

  if (!license) {
    return {
      success: false,
      status: 'inválida',
      message: 'Chave de ativação não encontrada ou inválida.',
    };
  }

  if (license.status === 'blocked') {
    return {
      success: false,
      status: 'bloqueada',
      message: 'Esta licença foi temporariamente bloqueada pelo administrador.',
    };
  }

  const now = new Date();
  const expiry = new Date(license.expiresAt);
  if (now > expiry) {
    return {
      success: false,
      status: 'expirada',
      message: `Esta licença expirou em ${expiry.toLocaleDateString('pt-BR')}.`,
    };
  }

  // Check device limit
  if (license.activeDeviceId && license.activeDeviceId !== deviceId) {
    return {
      success: false,
      status: 'limite atingido',
      message: `Limite de 1 dispositivo atingido. Esta chave já está vinculada a outro celular (${license.activeDeviceModel || 'Dispositivo anterior'}). Solicite a liberação ao administrador Ronaldo Costa.`,
    };
  }

  // Activate license for this device
  license.status = 'active';
  license.activeDeviceId = deviceId;
  license.activeDeviceModel = 'Android (Dispositivo Atual)';
  if (!license.activatedAt) {
    license.activatedAt = new Date().toISOString();
  }

  saveStoredLicenses(licenses);
  localStorage.setItem(ACTIVE_LICENSE_KEY, JSON.stringify(license));

  return {
    success: true,
    status: 'ativada',
    message: `Aplicativo ativado com sucesso para ${license.clientName}!`,
    license,
  };
}

// Get currently active license
export function getActiveLicense(): License | null {
  try {
    const raw = localStorage.getItem(ACTIVE_LICENSE_KEY);
    if (raw) {
      const active: License = JSON.parse(raw);
      // Verify against fresh stored licenses to check if blocked or revoked
      const all = getStoredLicenses();
      const fresh = all.find(l => l.id === active.id);
      if (fresh) {
        if (fresh.status === 'blocked' || fresh.activeDeviceId !== getOrCreateDeviceId()) {
          // Invalidate
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
export function logoutLicense(): void {
  const current = getActiveLicense();
  if (current) {
    const all = getStoredLicenses();
    const target = all.find(l => l.id === current.id);
    if (target && target.activeDeviceId === getOrCreateDeviceId()) {
      target.activeDeviceId = undefined;
      target.activeDeviceModel = undefined;
      target.status = 'available';
      saveStoredLicenses(all);
    }
  }
  localStorage.removeItem(ACTIVE_LICENSE_KEY);
}

// Admin Operations
export function createNewLicense(params: {
  clientName: string;
  notes?: string;
  durationMonths: number;
  deviceLimit?: number;
}): License {
  const all = getStoredLicenses();
  const key = generateLicenseKey();
  const now = new Date();
  const expires = new Date();
  expires.setMonth(now.getMonth() + (params.durationMonths || 12));

  const newLicense: License = {
    id: `lic-${Date.now()}`,
    key,
    clientName: params.clientName.trim(),
    notes: params.notes?.trim() || '',
    status: 'available',
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    deviceLimit: params.deviceLimit || 1,
  };

  all.unshift(newLicense);
  saveStoredLicenses(all);
  return newLicense;
}

export function releaseLicenseDevice(licenseId: string): boolean {
  const all = getStoredLicenses();
  const lic = all.find(l => l.id === licenseId);
  if (!lic) return false;

  lic.activeDeviceId = undefined;
  lic.activeDeviceModel = undefined;
  lic.status = 'available';
  saveStoredLicenses(all);

  // If this device was the active one, clear active license
  const active = getActiveLicense();
  if (active && active.id === licenseId) {
    localStorage.removeItem(ACTIVE_LICENSE_KEY);
  }
  return true;
}

export function toggleBlockLicense(licenseId: string): License | null {
  const all = getStoredLicenses();
  const lic = all.find(l => l.id === licenseId);
  if (!lic) return null;

  lic.status = lic.status === 'blocked' ? (lic.activeDeviceId ? 'active' : 'available') : 'blocked';
  saveStoredLicenses(all);

  if (lic.status === 'blocked') {
    const active = getActiveLicense();
    if (active && active.id === licenseId) {
      localStorage.removeItem(ACTIVE_LICENSE_KEY);
    }
  }
  return lic;
}

export function renewLicense(licenseId: string, additionalMonths = 12): License | null {
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
  saveStoredLicenses(all);
  return lic;
}

export function revokeLicense(licenseId: string): boolean {
  let all = getStoredLicenses();
  const exists = all.some(l => l.id === licenseId);
  if (!exists) return false;

  all = all.filter(l => l.id !== licenseId);
  saveStoredLicenses(all);

  const active = getActiveLicense();
  if (active && active.id === licenseId) {
    localStorage.removeItem(ACTIVE_LICENSE_KEY);
  }
  return true;
}
