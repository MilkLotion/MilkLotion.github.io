import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { PatchNotesPage } from './PatchNotesPage';

import '../../shared/styles/globals.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <PatchNotesPage />
    </StrictMode>,
  );
}
