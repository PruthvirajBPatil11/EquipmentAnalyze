import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import { AppProvider } from './store/AppStore.jsx';
import './styles.css';
createRoot(document.getElementById('root')).render(<AppProvider><App /></AppProvider>);
