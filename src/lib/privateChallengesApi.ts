import { auth } from './firebaseClient';
import { API_BASE } from './adminApi';

export type PrivateChallenge = Record<string, any> & {
  id?: string;
  title?: string;
  description?: string;
  inviteCode?: string;
  status?: string;
  durationDays?: number;
  participantsCount?: number;
  participantCount?: number;
  createdAt?: unknown;
  endsAt?: unknown;
};

type ChallengeListResponse = {
  challenges?: PrivateChallenge[];
};

async function challengeRequest<T>(action: 'list' | 'create' | 'join', options: { method?: 'GET' | 'POST'; body?: Record<string, unknown> } = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre na sua conta Invictus para continuar.');

  const token = await user.getIdToken();
  const url = new URL(`${API_BASE}/api/private-challenges`);
  url.searchParams.set('action', action);

  const response = await fetch(url.toString(), {
    method: options.method || (options.body ? 'POST' : 'GET'),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error || payload?.message || `Não foi possível concluir a operação (${response.status}).`);
  }
  return payload as T;
}

export async function listPrivateChallenges(): Promise<PrivateChallenge[]> {
  const result = await challengeRequest<ChallengeListResponse>('list');
  return Array.isArray(result?.challenges) ? result.challenges : [];
}

export async function createPrivateChallenge(input: { title: string; description: string; durationDays: 7 | 15 | 30 }): Promise<Record<string, any>> {
  return challengeRequest<Record<string, any>>('create', { method: 'POST', body: input });
}

export async function joinPrivateChallenge(inviteCode: string): Promise<Record<string, any>> {
  return challengeRequest<Record<string, any>>('join', { method: 'POST', body: { inviteCode: inviteCode.trim() } });
}
