import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RebuildApp from './RebuildApp';
import './RebuildApp.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RebuildApp />
  </StrictMode>,
);
