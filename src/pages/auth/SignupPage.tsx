import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { ArrowRight, Indent as Student, BriefcaseIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string().oneOf(['student', 'mentor'], 'Please select a role').required('Role is required'),
});

const SignupPage = () => {
  const [selectedRole, setSelectedRole] = useState<null | 'student' | 'mentor'>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
    try {
      await signup(values.email, values.password, values.firstName, values.lastName, values.role);
      // Navigate to confirmation page with email prefilled
      navigate('/confirm', { state: { email: values.email } });
    } catch (error: any) {
      if (error.message.includes('email')) {
        setFieldError('email', error.message);
      } else if (error.message.includes('password')) {
        setFieldError('password', error.message);
      } else {
        setFieldError('general', error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
          <p className="text-gray-300 mt-2">Join AceTogether and connect with opportunities</p>
        </div>
        
        <Card hoverEffect={false}>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: selectedRole || '',
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedRole('student');
                        setFieldValue('role', 'student');
                      }}
                      className={`cursor-pointer p-4 rounded-md border flex flex-col items-center transition-colors ${
                        selectedRole === 'student'
                          ? 'border-accent bg-primary'
                          : 'border-primary-light bg-primary hover:border-accent-light'
                      }`}
                    >
                      <Student className={`h-8 w-8 mb-2 ${selectedRole === 'student' ? 'text-accent' : 'text-gray-400'}`} />
                      <span className={selectedRole === 'student' ? 'text-accent' : 'text-gray-300'}>Student</span>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedRole('mentor');
                        setFieldValue('role', 'mentor');
                      }}
                      className={`cursor-pointer p-4 rounded-md border flex flex-col items-center transition-colors ${
                        selectedRole === 'mentor'
                          ? 'border-accent bg-primary'
                          : 'border-primary-light bg-primary hover:border-accent-light'
                      }`}
                    >
                      <BriefcaseIcon className={`h-8 w-8 mb-2 ${selectedRole === 'mentor' ? 'text-accent' : 'text-gray-400'}`} />
                      <span className={selectedRole === 'mentor' ? 'text-accent' : 'text-gray-300'}>Mentor</span>
                    </motion.div>
                  </div>
                  {errors.role && touched.role && (
                    <div className="text-error text-sm mt-1">{errors.role}</div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Field
                      as={Input}
                      name="firstName"
                      id="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      error={touched.firstName && errors.firstName}
                    />
                  </div>
                  <div>
                    <Field
                      as={Input}
                      name="lastName"
                      id="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      error={touched.lastName && errors.lastName}
                    />
                  </div>
                </div>
                
                <Field
                  as={Input}
                  name="email"
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  error={touched.email && errors.email}
                />
                
                <Field
                  as={Input}
                  name="password"
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  error={touched.password && errors.password}
                />
                
                <Field
                  as={Input}
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  error={touched.confirmPassword && errors.confirmPassword}
                />
                
                {errors.general && (
                  <div className="text-error text-sm">{errors.general}</div>
                )}
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-light">
                Log In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;