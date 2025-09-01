import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './style.css'

const appElement = document.querySelector('#app');
if (appElement) {
  createRoot(appElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
