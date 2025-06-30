import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ممكن تزيد ستايل عام هنا

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

