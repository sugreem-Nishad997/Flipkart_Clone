import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {GoogleOAuthProvider} from '@react-oauth/google';
import App from './App.jsx' 
import './index.css'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='1012651405355-vpa5hno7f68vd26066pjj0fquvn6pv3u.apps.googleusercontent.com'>
    <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>,
)
