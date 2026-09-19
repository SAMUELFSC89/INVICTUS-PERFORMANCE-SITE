import { auth } from './firebaseClient';
import { API_BASE } from './adminApi';
import {
  COMPETITIVE_HR_ACKNOWLEDGEMENT_VERSION,
  PRIVACY_POLICY_VERSION,
  TERMS_VERSION,
} from './publicLegal';

export type Championship = {
  id: string;
  editionId: string;
  type: 'arena_musculacao' | 'run_elite_corrida';
  title: string;
  edition: string;
  subtitle: string;
  description: string;
  categoryLabel: string;
  durationDays?: number;
  startAt: string;
  endAt: string;
  settlementAt?: string;
  registrationPrice: number;
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  registrationOpen?: boolean;
  registrationReadinessReason?: string;
  participantCount?: number;
  prizePool?: number;
  revealedPrizePool?: number;
  prizeDistribution?: Array<{ rank: number; percentage?: number; amount: number; label: string }>;
  revealedPrizeDistribution?: Array<{ rank: number; percentage?: number; amount: number; label: string }>;
  status: string;
  regulationVersion: string;
  regulationHash: string;
  antiFraudProfile?: {
    minDurationMinutes?: number;
    maxDurationMinutes?: number;
    requireGeofence?: boolean;
    requireContinuousGPS?: boolean;
    maxRiskScore?: number;
    allowedCardioTypes?: string[];
    [key: string]: unknown;
  };
};

export type ChampionshipRegistration = {
  championshipId: string;
  editionId: string;
  status: string;
  paymentStatus: string;
  valor?: number;
  amount?: number;
  asaasCheckoutUrl?: string;
  checkoutUrl?: string;
  criadaEm?: string;
  pagaEm?: string;
};

const HR_CONSENT_TYPE = 'competitive_hr_measurement_acknowledgement';

async function tokenHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre na sua conta Invictus para continuar.');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function api<T>(path: string, options: { method?: 'GET' | 'POST'; body?: Record<string, unknown>; auth?: boolean } = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: options.auth === false ? (options.body ? { 'Content-Type': 'application/json' } : undefined) : await tokenHeaders(),
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error || payload?.message || `Não foi possível concluir a operação (${response.status}).`);
  }
  return payload as T;
}

export async function getChampionships(): Promise<Championship[]> {
  const payload = await api<{ championships?: Championship[] }>('/api/championships', { auth: false });
  return Array.isArray(payload.championships) ? payload.championships : [];
}

export async function getChampionship(championshipId: string): Promise<Championship | null> {
  const championships = await getChampionships();
  return championships.find(item => item.id === championshipId) || null;
}

export async function getMyChampionshipRegistrations(): Promise<ChampionshipRegistration[]> {
  const payload = await api<{ registrations?: ChampionshipRegistration[] }>('/api/championships/my-registrations');
  return Array.isArray(payload.registrations) ? payload.registrations : [];
}

export async function acceptChampionshipRegulation(championship: Championship): Promise<{ acceptanceId: string }> {
  return api<{ acceptanceId: string }>('/api/championships/accept-regulation', {
    method: 'POST',
    body: {
      championshipId: championship.id,
      regulationVersion: championship.regulationVersion,
      regulationHash: championship.regulationHash,
      locale: navigator.language || 'pt-BR',
      platform: 'web',
      hrAcknowledgement: {
        accepted: true,
        consentType: HR_CONSENT_TYPE,
        competitionId: championship.id,
        competitionRulesVersion: championship.regulationVersion,
        hrAcknowledgementVersion: COMPETITIVE_HR_ACKNOWLEDGEMENT_VERSION,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        termsVersion: TERMS_VERSION,
        platform: 'web',
        appVersion: String(import.meta.env.VITE_APP_VERSION || 'site'),
        locale: navigator.language || 'pt-BR',
      },
    },
  });
}

export async function createChampionshipCheckout(championshipId: string, acceptanceId: string) {
  return api<{
    success: true;
    championshipId: string;
    editionId: string;
    valor: number;
    jaExistia: boolean;
    checkoutId: string;
    checkoutUrl: string;
  }>('/api/championships/payment', {
    method: 'POST',
    body: { championshipId, acceptanceId, checkoutSurface: 'web' },
  });
}

export async function getChampionshipProgress(championshipId: string) {
  return api<any>(`/api/championships/progress?championshipId=${encodeURIComponent(championshipId)}`);
}
