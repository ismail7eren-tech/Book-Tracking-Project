import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global stiller (CSS Değişkenleri vb.)
import App from './App.jsx';

// Uygulamanın ana başlangıç noktası
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);