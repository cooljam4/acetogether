import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const ConfirmSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  code: Yup.string().required('Confirmation code is required'),
});

const ConfirmPage = () => {
  const { confirmSignup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from location state if available
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (values: any, { setSubmitting, setFieldError }: any) => {
    try {
      await confirmSignup(values.email, values.code);
      navigate('/login', { state: { email: values.email, confirmed: true } });
    } catch (error: any) {
      setFieldError('code', error.message);
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
          <h1 className="text-3xl font-bold text-white">Confirm Your Email</h1>
          <p className="text-gray-300 mt-2">We've sent a confirmation code to your email</p>
        </motion.div>
        
        <Card hoverEffect={false}>
          <Formik
            initialValues={{
              email: email,
              code: '',
            }}
            validationSchema={ConfirmSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <Field
                  as={Input}
                  name="email"
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  error={touched.email && errors.email}
                  disabled={!!email}
                />
                
                <Field
                  as={Input}
                  name="code"
                  id="code"
                  label="Confirmation Code"
                  placeholder="Enter the code from your email"
                  error={touched.code && errors.code}
                />
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Verify Email
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Didn't receive the code?{' '}
              <Link to="/signup" className="text-accent hover:text-accent-light">
                Resend Code
              </Link>
            </p>
            <p className="text-gray-300 mt-2">
              <Link to="/login" className="text-accent hover:text-accent-light">
                Back to Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmPage;