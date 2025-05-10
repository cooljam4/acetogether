import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  Bell, 
  Briefcase, 
  MessageSquare, 
  ClipboardList, 
  File, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-20 left-4 z-30 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-primary-light p-2 rounded-full shadow-lg"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-accent" />
          ) : (
            <Menu className="h-6 w-6 text-accent" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        className={`fixed top-16 left-0 h-full bg-primary-light w-64 p-6 shadow-xl z-20 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          <div className="space-y-6 flex-grow">
            <div className="space-y-2">
              <p className="text-gray-400 text-xs uppercase font-medium">DASHBOARD</p>
              <Link
                to="/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/dashboard') && location.pathname === '/dashboard'
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-primary hover:text-accent'
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                <span>Overview</span>
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/dashboard/profile')
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-primary hover:text-accent'
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/dashboard/notifications"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/dashboard/notifications')
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-primary hover:text-accent'
                }`}
              >
                <Bell className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-gray-400 text-xs uppercase font-medium">OPPORTUNITIES</p>
              {userRole === 'student' ? (
                <Link
                  to="/dashboard/opportunities"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive('/dashboard/opportunities')
                      ? 'bg-accent/10 text-accent'
                      : 'hover:bg-primary hover:text-accent'
                  }`}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  <span>Browse Opportunities</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/dashboard/create-opportunity"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActive('/dashboard/create-opportunity')
                        ? 'bg-accent/10 text-accent'
                        : 'hover:bg-primary hover:text-accent'
                    }`}
                  >
                    <PlusCircle className="h-5 w-5 mr-3" />
                    <span>Create Opportunity</span>
                  </Link>
                  <Link
                    to="/dashboard/my-opportunities"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActive('/dashboard/my-opportunities')
                        ? 'bg-accent/10 text-accent'
                        : 'hover:bg-primary hover:text-accent'
                    }`}
                  >
                    <Briefcase className="h-5 w-5 mr-3" />
                    <span>My Opportunities</span>
                  </Link>
                </>
              )}
              <Link
                to="/dashboard/applications"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/dashboard/applications')
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-primary hover:text-accent'
                }`}
              >
                <ClipboardList className="h-5 w-5 mr-3" />
                <span>
                  {userRole === 'student' ? 'My Applications' : 'Manage Applications'}
                </span>
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-gray-400 text-xs uppercase font-medium">COMMUNICATION</p>
              <Link
                to="/dashboard/messages"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/dashboard/messages')
                    ? 'bg-accent/10 text-accent'
                    : 'hover:bg-primary hover:text-accent'
                }`}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                <span>Messages</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center p-2 w-full rounded-md text-gray-300 hover:bg-primary hover:text-error transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="md:pl-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;