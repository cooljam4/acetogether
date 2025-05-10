import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import * as Auth from '@aws-amplify/auth';
import { Storage } from '@aws-amplify/storage';
import toast from 'react-hot-toast';

type UserRole = 'student' | 'mentor' | null;

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  userRole: UserRole;
  loading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<any>;
  confirmSignup: (email: string, code: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isProfileComplete: boolean;
  setProfileComplete: (value: boolean) => void;
  refreshUserSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  userRole: null,
  loading: true,
  signup: async () => {},
  confirmSignup: async () => {},
  login: async () => {},
  logout: async () => {},
  isProfileComplete: false,
  setProfileComplete: () => {},
  refreshUserSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [toastIds, setToastIds] = useState<Record<string, string>>({});

  // Helper function to show toast without duplication
  const showToast = (message: string, type: 'success' | 'error', key?: string) => {
    if (key && toastIds[key]) {
      toast.dismiss(toastIds[key]);
    }

    const id = toast[type](message, {
      duration: 4000,
      id: key // This ensures only one toast with this key exists
    });

    if (key) {
      setToastIds(prev => ({ ...prev, [key]: id }));
    }
  };

  const checkUserAuth = async () => {
    try {
      const currentUser = await Auth.getCurrentAuthenticatedUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      
      const { attributes } = currentUser;
      setUserRole(attributes['custom:role'] as UserRole);
      
      try {
        const userData = await Amplify.API.get('acetogether', `/profile/${currentUser.username}`, {});
        setIsProfileComplete(!!userData);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('Error checking profile:', error);
        }
        setIsProfileComplete(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  const refreshUserSession = async () => {
    try {
      const currentSession = await Auth.currentSession();
      await Auth.currentAuthenticatedUser({ bypassCache: true });
      return checkUserAuth();
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          given_name: firstName,
          family_name: lastName,
          'custom:role': role,
        },
      });
      
      showToast('Account created! Please check your email for confirmation code.', 'success', 'signup');
      return user;
    } catch (error: any) {
      if (error.code === 'UsernameExistsException') {
        showToast('An account with this email already exists.', 'error', 'signup-error');
      } else {
        showToast(error.message || 'Failed to sign up', 'error', 'signup-error');
      }
      throw error;
    }
  };

  const confirmSignup = async (email: string, code: string) => {
    try {
      await Auth.confirmSignUp(email, code);
      showToast('Email confirmed! You can now log in.', 'success', 'confirm');
      return true;
    } catch (error: any) {
      if (error.code === 'CodeMismatchException') {
        showToast('Invalid confirmation code. Please try again.', 'error', 'confirm-error');
      } else if (error.code === 'ExpiredCodeException') {
        showToast('Confirmation code has expired. Please request a new one.', 'error', 'confirm-error');
      } else {
        showToast(error.message || 'Failed to confirm signup', 'error', 'confirm-error');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
      setIsAuthenticated(true);
      
      setUserRole(user.attributes['custom:role'] as UserRole);
      
      try {
        const userData = await Amplify.API.get('acetogether', `/profile/${user.username}`, {});
        setIsProfileComplete(!!userData);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('Error checking profile:', error);
        }
        setIsProfileComplete(false);
      }
      
      showToast('Login successful', 'success', 'login');
      return user;
    } catch (error: any) {
      if (error.code === 'UserNotConfirmedException') {
        showToast('Please confirm your email address first.', 'error', 'login-error');
      } else if (error.code === 'NotAuthorizedException') {
        showToast('Incorrect email or password.', 'error', 'login-error');
      } else if (error.code === 'UserNotFoundException') {
        showToast('No account found with this email.', 'error', 'login-error');
      } else {
        showToast(error.message || 'Failed to log in', 'error', 'login-error');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsProfileComplete(false);
      showToast('Logged out successfully', 'success', 'logout');
    } catch (error: any) {
      console.error('Logout error:', error);
      showToast(error.message || 'Failed to log out', 'error', 'logout-error');
    }
  };

  const setProfileComplete = (value: boolean) => {
    setIsProfileComplete(value);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole,
        loading,
        signup,
        confirmSignup,
        login,
        logout,
        isProfileComplete,
        setProfileComplete,
        refreshUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};