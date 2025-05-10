import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import { useAuth } from './contexts/AuthContext';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LearnMorePage = lazy(() => import('./pages/LearnMorePage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ConfirmPage = lazy(() => import('./pages/auth/ConfirmPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ProfileSetupPage = lazy(() => import('./pages/auth/ProfileSetupPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const OpportunityPage = lazy(() => import('./pages/opportunities/OpportunityPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="learn-more" element={<LearnMorePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="confirm" element={<ConfirmPage />} />
          <Route path="login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile-setup" element={<ProfileSetupPage />} />
            <Route path="dashboard/*" element={<DashboardPage />} />
            <Route path="opportunity/:id" element={<OpportunityPage />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;