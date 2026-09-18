import { auth } from './firebaseClient';
import { API_BASE } from './adminApi';

export type StoreProduct = {
  productId: string;
  name: string;
  brand?: string;
  category?: string;
  productStatus?: string;
  images?: { primary?: string | null; thumbnail?: string | null; gallery?: string[] };
  imageStatus?: string;
  cashPrice?: number | null;
  canPurchaseWithCash?: boolean;
  availableForPurchase?: boolean;
  canPurchaseWithCoinsDiscount?: boolean;
  coinDiscountPrice?: number | null;
  coinDiscountAmount?: number | null;
  availableForDrop?: boolean;
  dropState?: string;
  availableCommercialStock?: number;
  drop?: { id?: string; coinPrice?: number | null; availableStock?: number | null } | null;
  weight?: string | number | null;
  weightUnit?: string | null;
  package?: string | null;
};

export type StoreAddress = {
  recipientName: string;
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
};

export type StoreOrder = Record<string, any> & {
  orderId: string;
  status: string;
  totalCashAmount?: number;
};

export type StorePayment = {
  provider?: string;
  paymentId?: string;
  invoiceUrl?: string | null;
  qrCode?: { encodedImage?: string; payload?: string; expirationDate?: string };
};

export type StoreCatalogue = {
  products: StoreProduct[];
  activeDrop: Record<string, any> | null;
  coinWallet: { balance?: number; lifetimeEarned?: number; lifetimeSpent?: number } | null;
};

async function storeRequest<T>(action?: string, options: { method?: 'GET' | 'POST'; body?: Record<string, unknown>; query?: Record<string, string | number | undefined> } = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre na sua conta Invictus para acessar os Drops.');
  const token = await user.getIdToken();
  const url = new URL(`${API_BASE}/api/store`);
  if (action) url.searchParams.set('action', action);
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
  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.error || payload?.message || `Falha na loja (${response.status}).`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return payload as T;
}

export async function getStoreCatalogue(): Promise<StoreCatalogue> {
  const payload = await storeRequest<any>();
  return {
    products: Array.isArray(payload?.products) ? payload.products : [],
    activeDrop: payload?.activeDrop || null,
    coinWallet: payload?.coinWallet || null,
  };
}

export async function createStoreOrder(input: { productId: string; quantity: number; address: StoreAddress; paymentMethod: 'MONEY' | 'COINS_PLUS_MONEY'; idempotencyKey: string }): Promise<{ order: StoreOrder; payment?: StorePayment }> {
  return storeRequest('create-cash-order', { method: 'POST', body: input });
}

export async function redeemStoreDrop(input: { productId: string; quantity: number; address: StoreAddress; idempotencyKey: string }): Promise<{ order: StoreOrder }> {
  return storeRequest('redeem-with-coins', { method: 'POST', body: input });
}

export async function getMyStoreOrders(): Promise<StoreOrder[]> {
  const payload = await storeRequest<any>('my-orders');
  return Array.isArray(payload?.orders) ? payload.orders : [];
}

export async function getStoreOrder(orderId: string): Promise<StoreOrder> {
  const payload = await storeRequest<any>('payment-status', { query: { orderId } });
  if (!payload?.order) throw new Error('Pedido não encontrado.');
  return payload.order as StoreOrder;
}
