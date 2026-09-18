import { auth } from './firebaseClient';

const configuredBase = String(import.meta.env.VITE_APP_API_BASE || '').trim();
const API_BASE = (configuredBase || window.location.origin).replace(/\/$/, '');

export async function adminRequest<T = any>(
  action: string,
  options: { method?: 'GET' | 'POST' | 'PUT'; body?: Record<string, unknown>; query?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sessão administrativa expirada. Faça login novamente.');

  const token = await user.getIdToken();
  const url = new URL(`${API_BASE}/api/admin`);
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(options.query || {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }

  const method = options.method || (options.body ? 'POST' : 'GET');
  const response = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error || payload?.message || `Falha administrativa (${response.status}).`);
  }
  return payload as T;
}

export { API_BASE };
