import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'craftharmony_admin';
const SESSION_SALT = 'craftharmony-admin-session-v1';

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || 'admin';
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'CraftHarmony@2026';
}

export function getAdminSessionValue() {
  return crypto
    .createHash('sha256')
    .update(`${getAdminUsername()}:${getAdminPassword()}:${SESSION_SALT}`)
    .digest('hex');
}

export function isValidAdminCredentials(username, password) {
  return username === getAdminUsername() && password === getAdminPassword();
}

export function isValidAdminCookie(cookieValue) {
  return Boolean(cookieValue) && cookieValue === getAdminSessionValue();
}

export function isAdminRequest(request) {
  return isValidAdminCookie(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}
