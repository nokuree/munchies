import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import "bootstrap/dist/css/bootstrap.min.css"
import "./styles.css"

// renders all our fun code
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


