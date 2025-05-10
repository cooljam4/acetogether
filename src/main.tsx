import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Configure Amplify
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
  },
  Storage: {
    AWSS3: {
      bucket: import.meta.env.VITE_S3_BUCKET,
      region: import.meta.env.VITE_AWS_REGION,
      // Enable file uploads for authenticated users only
      level: 'protected',
      // Set correct content type for files
      contentType: 'auto',
      // Enable server-side encryption
      serverSideEncryption: 'AES256',
      // Set CORS configuration
      customPrefix: {
        public: 'public/',
        protected: 'protected/',
        private: 'private/'
      }
    }
  },
  API: {
    endpoints: [
      {
        name: 'acetogether',
        endpoint: import.meta.env.VITE_API_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION,
      },
    ],
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#101223',
              color: '#fff',
              border: '1px solid #F0C26D',
            },
            duration: 4000,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);