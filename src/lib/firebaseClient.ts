import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0890994677',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:477394623748:web:9e74760ae5cb5cb50d4451',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCqIc_q1LJLCtPLtlB0j_daTwvyCP7XkrE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0890994677.firebaseapp.com',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0890994677.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '477394623748',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, 'ai-studio-42777a57-821e-48f8-9e9d-06c615ecdcda');
