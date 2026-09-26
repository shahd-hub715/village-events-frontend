const STORAGE_KEY = "village-admin-basic-auth";

function encode(username: string, password: string): string {
  // btoa() only handles latin1 — encode UTF-8 first so Arabic credentials work too.
  const raw = `${username}:${password}`;
  const bytes = new TextEncoder().encode(raw);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

/** The stored Basic token, or null when nobody is signed in. */
export function loadCredentials(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveCredentials(username: string, password: string): string {
  const token = encode(username, password);
  try {
    sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    // private mode / storage disabled — the token still lives in React state for this session
  }
  return token;
}

export function clearCredentials(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Authorization header for /api/admin/** requests. */
export function adminAuthHeader(token: string | null = loadCredentials()): Record<string, string> {
  return token ? { Authorization: `Basic ${token}` } : {};
}
