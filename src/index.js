import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssVarsProvider } from '@mui/joy'; // Import CssVarsProvider
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <CssVarsProvider>
    <App />
  </CssVarsProvider>
);
