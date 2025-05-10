import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // If user is already authenticated, redirect to their intended destination or dashboard
    if (isAuthenticated) {
      const destination = location.state?.from || '/dashboard';
      navigate(destination, { replace: true });
      return;
    }

    // Check if email is passed via location state
    if (location.state?.email) {
      setEmail(location.state.email);
    }

    // Show toast if user just confirmed their email
    if (location.state?.confirmed) {
      toast.success('Email confirmed! You can now log in.');
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
    try {
      await login(values.email, values.password);
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      if (error.code === 'UserNotConfirmedException') {
        // Redirect to confirmation page if user is not confirmed
        navigate('/confirm', { state: { email: values.email } });
      } else {
        setFieldError('password', 'Incorrect email or password');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-300 mt-2">Log in to your AceTogether account</p>
        </motion.div>
        
        <Card hoverEffect={false}>
          <Formik
            initialValues={{
              email: email,
              password: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Field
                      as={Input}
                      name="email"
                      id="email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      error={touched.email && errors.email}
                      className="pl-10"
                      autoComplete="email"
                    />
                    <div className="absolute inset-y-0 left-3 pt-6 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Field
                      as={Input}
                      name="password"
                      id="password"
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                      error={touched.password && errors.password}
                      className="pl-10"
                      autoComplete="current-password"
                    />
                    <div className="absolute inset-y-0 left-3 pt-6 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-accent focus:ring-accent border-gray-600 rounded bg-primary"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <Link to="/forgot-password" className="text-accent hover:text-accent-light">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:text-accent-light">
                Sign Up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;