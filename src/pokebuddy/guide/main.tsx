import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { GuidePage } from './GuidePage';

import '../../shared/styles/globals.css';
import './guide.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <GuidePage />
    </StrictMode>,
  );
}
