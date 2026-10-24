import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { DexPage } from './DexPage';

import '../../shared/styles/globals.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <DexPage />
    </StrictMode>,
  );
}
