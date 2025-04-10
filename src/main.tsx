import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router';
import AnimatedRoutes from './routes/AnimatedRoutes';
import Layout from './components/Layout';

import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
