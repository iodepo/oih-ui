import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './config/App';
import './index.scss';
import { AppTranslationProvider } from 'TranslationsManager/AppTranslationProvider';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppTranslationProvider> <App /></AppTranslationProvider>

  </React.StrictMode>
);

