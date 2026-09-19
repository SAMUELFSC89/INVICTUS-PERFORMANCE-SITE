import { auth } from './firebaseClient';
import { API_BASE } from './adminApi';

export type PrivateChallengeMember = {
  userId?: string;
  userName?: string;
  userPhoto?: string;
  points?: number;
  igaScore?: number | null;
  workoutsCount?: number;
  stakePaid?: number;
  joinedAt?: unknown;
};

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
  startDate?: unknown;
  endDate?: unknown;
  endsAt?: unknown;
  winnerId?: string | null;
  winnerName?: string | null;
  winnerPhoto?: string | null;
  resultStatus?: string | null;
  resultReason?: string | null;
  stakeAmount?: number;
  potTotal?: number;
  extendedOnce?: boolean;
  scoringMode?: 'IGA' | 'LEGACY' | string;
  isLegacyMoneyChallenge?: boolean;
  entryFee?: number;
  netPrizePool?: number;
  members?: PrivateChallengeMember[];
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

export async function createPrivateChallenge(input: {
  title: string;
  description: string;
  durationDays: 7 | 15 | 30;
  stakeAmount?: number;
}): Promise<Record<string, any>> {
  return challengeRequest<Record<string, any>>('create', { method: 'POST', body: input });
}

export async function joinPrivateChallenge(inviteCode: string): Promise<Record<string, any>> {
  return challengeRequest<Record<string, any>>('join', { method: 'POST', body: { inviteCode: inviteCode.trim() } });
}
