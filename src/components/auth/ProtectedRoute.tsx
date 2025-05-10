import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, isProfileComplete } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If the user is on a path that's not profile-setup but their profile is not complete,
  // redirect them to profile-setup
  if (!isProfileComplete && location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" state={{ from: location.pathname }} replace />;
  }

  // If the user is trying to access profile-setup but their profile is already complete,
  // redirect them to their intended destination or dashboard
  if (isProfileComplete && location.pathname === '/profile-setup') {
    const destination = location.state?.from || '/dashboard';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;