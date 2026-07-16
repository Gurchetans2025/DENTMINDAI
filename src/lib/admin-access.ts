export const DOCTOR_ADMIN_EMAILS = ["healthygrinsbylisha@gmail.com", "admin@ai.com"];
export const CLINIC_ADMIN_EMAIL = DOCTOR_ADMIN_EMAILS[0];
export const TEMP_ADMIN_EMAIL = "admin@ai.com";
export const TEMP_ADMIN_PASSWORD = "Hg!7Qm#29vLx@Dent2026";

const TEMP_ADMIN_SESSION_KEY = "healthygrins-temp-admin";

export function isDoctorAdminEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return !!normalized && DOCTOR_ADMIN_EMAILS.includes(normalized);
}

export function hasAdminRole(rows?: Array<{ role?: string | null }> | null) {
  return !!rows?.some((row) => row.role === "admin");
}

export function canManageClinic(email?: string | null, rows?: Array<{ role?: string | null }> | null) {
  return isDoctorAdminEmail(email) || hasAdminRole(rows);
}

export function isTemporaryAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === TEMP_ADMIN_EMAIL && password === TEMP_ADMIN_PASSWORD;
}

export function setTemporaryAdminSession(email = TEMP_ADMIN_EMAIL) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    TEMP_ADMIN_SESSION_KEY,
    JSON.stringify({ email, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 }),
  );
}

export function hasTemporaryAdminSession() {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(TEMP_ADMIN_SESSION_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { expiresAt?: number };
    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(TEMP_ADMIN_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    window.localStorage.removeItem(TEMP_ADMIN_SESSION_KEY);
    return false;
  }
}
