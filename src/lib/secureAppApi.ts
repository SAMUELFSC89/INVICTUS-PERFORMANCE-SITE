import { auth } from './firebaseClient';
import { API_BASE } from './adminApi';

type SecureOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  body?: Record<string, unknown>;
  query?: Record<string, string | number | undefined>;
};

export async function secureAppRequest<T = any>(path: string, options: SecureOptions = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sessão administrativa expirada. Faça login novamente.');
  const token = await user.getIdToken();
  const url = new URL(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`);
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
    throw new Error(payload?.error || payload?.message || `Falha na API (${response.status}).`);
  }
  return payload as T;
}

export async function storeAdminRequest<T = any>(action: string, options: Omit<SecureOptions, 'query'> = {}): Promise<T> {
  return secureAppRequest<T>('/api/store', {
    ...options,
    query: { action },
  });
}
