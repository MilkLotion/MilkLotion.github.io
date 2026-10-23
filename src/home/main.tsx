import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { HomePage } from './HomePage';

import './home.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <HomePage />
    </StrictMode>,
  );
}
