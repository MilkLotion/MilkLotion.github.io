import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { LandingPage } from './landing/LandingPage';

import '../shared/styles/globals.css';
import './pokebuddy.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <LandingPage />
    </StrictMode>,
  );
}
