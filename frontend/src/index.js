import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './config/App';
import '../node_modules/bootstrap-scss/bootstrap.scss';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

