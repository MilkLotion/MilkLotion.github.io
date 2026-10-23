import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { PokebuddyPage } from './PokebuddyPage';

import './pokebuddy.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <PokebuddyPage />
    </StrictMode>,
  );
}
