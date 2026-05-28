export interface JwtUser {
  sub?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  exp?: number;
}

export function decodeJwt(token: string): JwtUser | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtUser;
  } catch {
    return null;
  }
}

export function readAuthUser(): JwtUser | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  return decodeJwt(token);
}

let cachedToken: string | null | undefined = undefined;
let cachedUser: JwtUser | null = null;

export function getAuthUserSnapshot(): JwtUser | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth_token');
  if (token === cachedToken) return cachedUser;
  cachedToken = token;
  cachedUser = token ? decodeJwt(token) : null;
  return cachedUser;
}

export function getAuthUserServerSnapshot(): JwtUser | null {
  return null;
}

export function subscribeAuthUser(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'auth_token' || e.key === null) callback();
  };
  const onAuthChange = () => callback();
  window.addEventListener('storage', onStorage);
  window.addEventListener('auth-token-changed', onAuthChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('auth-token-changed', onAuthChange);
  };
}

export function notifyAuthChanged(): void {
  if (typeof window === 'undefined') return;
  cachedToken = undefined;
  window.dispatchEvent(new Event('auth-token-changed'));
}
