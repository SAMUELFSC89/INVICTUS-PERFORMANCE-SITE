import { auth } from './firebaseClient';
import { API_BASE } from './adminApi';

export type PowerLiftExercise = 'supino' | 'agachamento' | 'terra';
export type PowerLiftTier = 'UNRANKED' | 'FERRO' | 'BRONZE' | 'PRATA' | 'OURO' | 'PLATINA' | 'DIAMANTE';

export type PowerLiftSeasonEntry = {
  id: string;
  exercise: PowerLiftExercise;
  tier: PowerLiftTier;
  bestVolume: number;
  bestWeight: number;
  rawScore: number;
  competitiveScore: number;
  defendingChampion: boolean;
  defenseMultiplier: number;
  eliteOptIn: boolean;
  validMarks: number;
};

export type PowerLiftSeasonStatus = {
  season: { id: string; number: number; startsAt: string; endsAt: string };
  competitionSex: 'male' | 'female';
  entries: Record<PowerLiftExercise, PowerLiftSeasonEntry>;
  general: {
    eligible: boolean;
    optedIn: boolean;
    rawScore: number;
    competitiveScore: number;
    defendingMaster: boolean;
    defenseMultiplier: number;
  };
  rewards: {
    tier: Record<Exclude<PowerLiftTier, 'UNRANKED'>, number>;
    podium: Record<string, number>;
    master: number;
  };
};

export type PowerLiftRankingRow = Record<string, any> & {
  rank: number;
  userId: string;
  userName: string;
  exercise?: PowerLiftExercise;
  tier?: PowerLiftTier;
  rawScore?: number;
  competitiveScore?: number;
  bestVolume?: number;
};

async function request<T>(action: string, options: { method?: 'GET' | 'POST'; query?: Record<string, string | number | undefined>; body?: Record<string, unknown> } = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre na sua conta Invictus para acompanhar o Power Lift.');
  const token = await user.getIdToken();
  const url = new URL(`${API_BASE}/api/powerlift`);
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(options.query || {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }
  const response = await fetch(url.toString(), {
    method: options.method || (options.body ? 'POST' : 'GET'),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) throw new Error(payload?.error || payload?.message || `Falha no Power Lift (${response.status}).`);
  return payload as T;
}

export const getPowerLiftSeasonStatus = () => request<PowerLiftSeasonStatus>('status');

export async function getPowerLiftRanking(exercise?: PowerLiftExercise, limit = 25): Promise<{ records: PowerLiftRankingRow[]; generalRanking?: PowerLiftRankingRow[] }> {
  return request('ranking', { query: { exercise, limit } });
}

export async function setPowerLiftOptIn(scope: 'elite' | 'general', optedIn: boolean, exercise?: PowerLiftExercise): Promise<Record<string, any>> {
  return request('opt-in', { method: 'POST', body: { scope, optedIn, ...(exercise ? { exercise } : {}) } });
}
