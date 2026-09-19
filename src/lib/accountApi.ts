import type { User } from 'firebase/auth';
import { auth } from './firebaseClient';
import { API_BASE } from './adminApi';

export const CURRENT_LEGAL_VERSION = 5;

async function authenticatedJson<T>(path: string, options: { method?: 'GET' | 'POST'; body?: Record<string, unknown> } = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sua sessão expirou. Entre novamente.');
  const token = await user.getIdToken(true);
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || (options.body ? 'POST' : 'GET'),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) throw new Error(payload?.error || payload?.userMessage || `Falha na conta (${response.status}).`);
  return payload as T;
}

export async function checkCpfInUse(user: User, cpf: string): Promise<boolean> {
  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE}/api/profile?action=check-cpf`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpf }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'Não foi possível validar o CPF agora.');
  return Boolean(payload?.exists);
}

export async function onboardAccount(user: User, fields: Record<string, unknown>): Promise<Record<string, any>> {
  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE}/api/profile?action=onboard`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'Não foi possível concluir o cadastro agora.');
  return payload;
}

export type IdentityState = {
  email: { value: string; verified: boolean; verifiedAt?: unknown };
  phone: { value: string; verified: boolean; verifiedAt?: unknown };
  cpf: { value: string; verified: boolean; verifiedAt?: unknown; status?: string; provider?: string | null };
};

export async function getIdentityState(): Promise<{ identity: IdentityState; providers?: Record<string, unknown> }> {
  return authenticatedJson('/api/identity-verification');
}

export async function runIdentityAction(action: 'sync-email' | 'sync-phone' | 'send-verification-email' | 'verify-cpf'): Promise<Record<string, any>> {
  return authenticatedJson('/api/identity-verification', { method: 'POST', body: { action } });
}

export type AccountDeletionStatus = {
  requested: boolean;
  status: string;
  requestedAt?: string | null;
  completedAt?: string | null;
};

export async function getAccountDeletionStatus(): Promise<AccountDeletionStatus> {
  return authenticatedJson<AccountDeletionStatus>('/api/account-deletion');
}

export async function requestAccountDeletion(): Promise<{
  success: boolean;
  status: string;
  message: string;
  subscriptionNotice?: string;
  requestedAt?: string;
}> {
  return authenticatedJson('/api/account-deletion', { method: 'POST', body: { source: 'site_account' } });
}
