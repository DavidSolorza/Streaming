import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { CatalogSyncReceptor } from './core/receptors/catalogSyncReceptor';
import { UxNotificationReceptor } from './core/receptors/uxNotificationReceptor';

// Inicializar receptores de eventos
CatalogSyncReceptor.initialize();
UxNotificationReceptor.register();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
