import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseClient';

export type AdminRealtimeState = {
  revision: number;
  lastEventType: string;
  lastEventSource: string;
  lastEventAt: string;
};

export function subscribeAdminRealtime(
  onChange: (state: AdminRealtimeState) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    doc(db, 'system_stats', 'admin_realtime'),
    (snapshot) => {
      const data = snapshot.exists() ? snapshot.data() : {};
      onChange({
        revision: Math.max(0, Number(data?.revision || 0)),
        lastEventType: String(data?.lastEventType || ''),
        lastEventSource: String(data?.lastEventSource || ''),
        lastEventAt: String(data?.lastEventAt || ''),
      });
    },
    (error) => onError?.(error),
  );
}
