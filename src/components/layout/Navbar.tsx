import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary-dark bg-opacity-90 backdrop-blur-sm z-10 border-b border-primary-light">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-white hover:text-accent transition-colors">
                Dashboard
              </Link>
              <button 
                className="p-2 rounded-full hover:bg-primary-light text-white"
                onClick={() => navigate('/dashboard/notifications')}
              >
                <Bell size={20} />
              </button>
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-primary-light text-white">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-primary-light border border-primary rounded-md shadow-lg hidden group-hover:block">
                  <div className="p-2 border-b border-primary">
                    <p className="text-sm text-accent font-medium">
                      {userRole === 'student' ? 'Student' : 'Mentor'}
                    </p>
                  </div>
                  <Link 
                    to="/dashboard/profile" 
                    className="block px-4 py-2 text-sm hover:bg-primary hover:text-accent"
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-primary hover:text-error flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary-light border-t border-primary"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-white hover:text-accent py-2 transition-colors"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/dashboard/notifications" 
                    className="text-white hover:text-accent py-2 transition-colors flex items-center"
                    onClick={closeMenu}
                  >
                    <Bell size={18} className="mr-2" />
                    Notifications
                  </Link>
                  <Link 
                    to="/dashboard/profile" 
                    className="text-white hover:text-accent py-2 transition-colors flex items-center"
                    onClick={closeMenu}
                  >
                    <User size={18} className="mr-2" />
                    My Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="text-white hover:text-error py-2 transition-colors flex items-center"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" fullWidth>Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button fullWidth>Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;