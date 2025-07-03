import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios'

const encoded = btoa(import.meta.env.VITE_USERNAME + ':' + import.meta.env.VITE_PASSWORD).toString('base64');

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Authorization'] = 'Basic ' + encoded;
axios.defaults.headers.post['Content-Type'] = 'application/form-data';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
