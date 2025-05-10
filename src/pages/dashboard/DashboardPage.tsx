import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/ui/LoadingScreen';
import DashboardLayout from './DashboardLayout';

// Lazy load dashboard pages
const StudentDashboard = lazy(() => import('./StudentDashboard'));
const MentorDashboard = lazy(() => import('./MentorDashboard'));
const ProfilePage = lazy(() => import('./ProfilePage'));
const NotificationsPage = lazy(() => import('./NotificationsPage'));
const OpportunitiesPage = lazy(() => import('./OpportunitiesPage'));
const MessagesPage = lazy(() => import('./MessagesPage'));
const CreateOpportunityPage = lazy(() => import('./CreateOpportunityPage'));
const ApplicationsPage = lazy(() => import('./ApplicationsPage'));

const DashboardPage = () => {
  const { userRole } = useAuth();

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Default dashboard route based on user role */}
          <Route 
            index 
            element={
              userRole === 'student' ? <StudentDashboard /> : <MentorDashboard />
            } 
          />
          
          {/* Common routes for both roles */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="messages/*" element={<MessagesPage />} />
          
          {/* Student-specific routes */}
          {userRole === 'student' && (
            <>
              <Route path="opportunities" element={<OpportunitiesPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
            </>
          )}
          
          {/* Mentor-specific routes */}
          {userRole === 'mentor' && (
            <>
              <Route path="create-opportunity" element={<CreateOpportunityPage />} />
              <Route path="my-opportunities" element={<OpportunitiesPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
            </>
          )}
          
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
};

export default DashboardPage;