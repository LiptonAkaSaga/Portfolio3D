import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/portfolio/App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/portfolio/css/Style.css'; // <-- styl główny

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
