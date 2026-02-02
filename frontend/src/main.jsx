import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";


// Redux Provider
import { Provider } from 'react-redux';
import store from './store';

// Auth Context Provider (uses Redux internally)

import './index.css'
// import './pages/patient/Patient_Settings/index.css'


import { AuthProvider } from './context/AuthContext.jsx';

// Toast notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Tooltip } from 'bootstrap';

/**
 * Application Entry Point
 * 
 * Provider Hierarchy:
 * 1. Redux Provider - Global state management
 * 2. BrowserRouter - Routing
 * 3. AuthProvider - Authentication context (uses Redux)
 * 4. App - Main application
 * 
 * @author MediConnect Team
 */

document.addEventListener("DOMContentLoaded", () => {
  [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
    .map(el => new Tooltip(el));
});


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </BrowserRouter>
  </Provider>,
)
