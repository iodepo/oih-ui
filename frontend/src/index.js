import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './config/App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

