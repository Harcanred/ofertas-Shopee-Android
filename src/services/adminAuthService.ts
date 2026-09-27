const ADMIN_PASS_KEY = 'central_ofertas_admin_pass_v1';
const ADMIN_SESSION_KEY = 'central_ofertas_admin_session_v1';
const HIDE_ADMIN_BTN_KEY = 'central_ofertas_hide_admin_btn_v1';

// Default initial password for Ronaldo Costa
const DEFAULT_ADMIN_PASSWORD = 'ronaldo2026';

export function getStoredAdminPassword(): string {
  return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASSWORD;
}

export function verifyAdminPassword(inputPassword: string): boolean {
  const currentPass = getStoredAdminPassword();
  const isValid = inputPassword.trim() === currentPass;
  if (isValid) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated_' + Date.now());
  }
  return isValid;
}

export function isAdminSessionValid(): boolean {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  return Boolean(session && session.startsWith('authenticated_'));
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function changeAdminPassword(currentPass: string, newPass: string): { success: boolean; message: string } {
  if (currentPass.trim() !== getStoredAdminPassword()) {
    return { success: false, message: 'Senha atual incorreta.' };
  }
  if (!newPass.trim() || newPass.trim().length < 4) {
    return { success: false, message: 'A nova senha deve ter no mínimo 4 caracteres.' };
  }
  localStorage.setItem(ADMIN_PASS_KEY, newPass.trim());
  return { success: true, message: 'Senha administrativa atualizada com sucesso!' };
}

export function isHideAdminButtonEnabled(): boolean {
  return localStorage.getItem(HIDE_ADMIN_BTN_KEY) === 'true';
}

export function setHideAdminButtonEnabled(hide: boolean): void {
  localStorage.setItem(HIDE_ADMIN_BTN_KEY, hide ? 'true' : 'false');
}
