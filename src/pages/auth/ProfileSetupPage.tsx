import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Check, Loader } from 'lucide-react';
import { Auth, Storage, API } from 'aws-amplify';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

// Student Profile Schema
const StudentSchema = Yup.object().shape({
  school: Yup.string().required('School is required'),
  major: Yup.string().required('Major is required'),
  gpa: Yup.number()
    .min(0, 'GPA must be greater than 0')
    .max(4, 'GPA must be less than or equal to 4')
    .required('GPA is required'),
  degreeLevel: Yup.string().required('Degree level is required'),
  linkedinUrl: Yup.string().url('Must be a valid URL'),
  bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
});

// Mentor Profile Schema
const MentorSchema = Yup.object().shape({
  company: Yup.string().required('Company is required'),
  jobTitle: Yup.string().required('Job title is required'),
  linkedinUrl: Yup.string().url('Must be a valid URL'),
  bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
});

const ProfileSetupPage = () => {
  const { user, userRole, setProfileComplete } = useAuth();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUploading, setProfilePictureUploading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Profile picture dropzone
  const { 
    getRootProps: getProfilePicRootProps, 
    getInputProps: getProfilePicInputProps 
  } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 2097152, // 2MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setProfilePicture(acceptedFiles[0]);
      }
    },
    onDropRejected: () => {
      toast.error('Please upload a JPG or PNG image under 2MB');
    }
  });

  // Resume dropzone
  const { 
    getRootProps: getResumeRootProps, 
    getInputProps: getResumeInputProps 
  } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setResume(acceptedFiles[0]);
      }
    },
    onDropRejected: () => {
      toast.error('Please upload a PDF, DOC, or DOCX file under 5MB');
    }
  });

  // Handle file uploads to S3
  const uploadProfilePicture = async () => {
    if (!profilePicture || !user?.username) return null;

    try {
      setProfilePictureUploading(true);
      const fileExt = profilePicture.name.split('.').pop()?.toLowerCase();
      const fileName = `profile-pictures/${user.username}/${Date.now()}.${fileExt}`;
      
      await Storage.put(fileName, profilePicture, {
        contentType: profilePicture.type,
        level: 'protected',
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      
      setProfilePictureUploading(false);
      return fileName;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload profile picture');
      setProfilePictureUploading(false);
      return null;
    }
  };

  const uploadResume = async () => {
    if (!resume || !user?.username) return null;

    try {
      setResumeUploading(true);
      const fileExt = resume.name.split('.').pop()?.toLowerCase();
      const fileName = `resumes/${user.username}/${Date.now()}.${fileExt}`;
      
      await Storage.put(fileName, resume, {
        contentType: resume.type,
        level: 'protected',
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      
      setResumeUploading(false);
      return fileName;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume');
      setResumeUploading(false);
      return null;
    }
  };

  // Submit profile data to API
  const handleSubmit = async (values: any) => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      
      // Upload files first
      const [profilePictureKey, resumeKey] = await Promise.all([
        profilePicture ? uploadProfilePicture() : null,
        userRole === 'student' && resume ? uploadResume() : null
      ]);
      
      // Prepare profile data
      const profileData = {
        userId: currentUser.username,
        ...(profilePictureKey && { profilePictureKey }),
        ...values,
      };
      
      // Add resume key for student profiles
      if (userRole === 'student' && resumeKey) {
        profileData.resumeKey = resumeKey;
      }
      
      // Save profile data
      await API.post('acetogether', '/profile', {
        body: profileData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
      });
      
      // Update profile complete status
      setProfileComplete(true);
      
      toast.success('Profile setup complete!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast.error(error.message || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Set Up Your Profile</h1>
          <p className="text-gray-300 mt-2">
            {userRole === 'student' 
              ? 'Create your student profile to get discovered by mentors'
              : 'Create your mentor profile to connect with talented students'}
          </p>
        </div>
        
        <Card hoverEffect={false}>
          {/* Step Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 1 ? 'bg-accent text-primary-dark' : 'bg-primary-light text-gray-400'
                }`}>
                  {step > 1 ? <Check className="h-5 w-5" /> : '1'}
                </div>
                <div className={`h-1 w-12 ${
                  step > 1 ? 'bg-accent' : 'bg-primary-light'
                }`}></div>
              </div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 2 ? 'bg-accent text-primary-dark' : 'bg-primary-light text-gray-400'
                }`}>
                  {step > 2 ? <Check className="h-5 w-5" /> : '2'}
                </div>
                <div className={`h-1 w-12 ${
                  step > 2 ? 'bg-accent' : 'bg-primary-light'
                }`}></div>
              </div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 3 ? 'bg-accent text-primary-dark' : 'bg-primary-light text-gray-400'
                }`}>
                  3
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Basic Info</span>
              <span>Profile Picture</span>
              <span>{userRole === 'student' ? 'Resume' : 'Complete'}</span>
            </div>
          </div>
          
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
              
              <Formik
                initialValues={
                  userRole === 'student'
                    ? {
                        school: '',
                        major: '',
                        gpa: '',
                        degreeLevel: '',
                        linkedinUrl: '',
                        bio: '',
                      }
                    : {
                        company: '',
                        jobTitle: '',
                        linkedinUrl: '',
                        bio: '',
                      }
                }
                validationSchema={userRole === 'student' ? StudentSchema : MentorSchema}
                onSubmit={(values) => {
                  // Save values and go to next step
                  // (In a real implementation, you might want to store these in state)
                  setStep(2);
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    {userRole === 'student' ? (
                      // Student form fields
                      <>
                        <Field
                          as={Input}
                          name="school"
                          id="school"
                          label="School"
                          placeholder="Enter your school name"
                          error={touched.school && errors.school}
                        />
                        
                        <Field
                          as={Input}
                          name="major"
                          id="major"
                          label="Major"
                          placeholder="Enter your major"
                          error={touched.major && errors.major}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field
                            as={Input}
                            name="gpa"
                            id="gpa"
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            label="GPA"
                            placeholder="Enter your GPA"
                            error={touched.gpa && errors.gpa}
                          />
                          
                          <div>
                            <label htmlFor="degreeLevel" className="block text-sm font-medium mb-1 text-gray-200">
                              Degree Level
                            </label>
                            <Field
                              as="select"
                              name="degreeLevel"
                              id="degreeLevel"
                              className="bg-primary border border-primary-light rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                              <option value="">Select degree level</option>
                              <option value="Bachelors">Bachelor's</option>
                              <option value="Masters">Master's</option>
                              <option value="PhD">PhD</option>
                              <option value="Associates">Associate's</option>
                            </Field>
                            {touched.degreeLevel && errors.degreeLevel && (
                              <p className="mt-1 text-sm text-error">{errors.degreeLevel as string}</p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Mentor form fields
                      <>
                        <Field
                          as={Input}
                          name="company"
                          id="company"
                          label="Company"
                          placeholder="Enter your company name"
                          error={touched.company && errors.company}
                        />
                        
                        <Field
                          as={Input}
                          name="jobTitle"
                          id="jobTitle"
                          label="Job Title"
                          placeholder="Enter your job title"
                          error={touched.jobTitle && errors.jobTitle}
                        />
                      </>
                    )}
                    
                    {/* Common fields for both roles */}
                    <Field
                      as={Input}
                      name="linkedinUrl"
                      id="linkedinUrl"
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/yourprofile"
                      error={touched.linkedinUrl && errors.linkedinUrl}
                    />
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium mb-1 text-gray-200">
                        Bio
                      </label>
                      <Field
                        as="textarea"
                        name="bio"
                        id="bio"
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="bg-primary border border-primary-light rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      {touched.bio && errors.bio && (
                        <p className="mt-1 text-sm text-error">{errors.bio as string}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        Next Step
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Profile Picture</h2>
              <p className="text-gray-300 mb-6">Upload a professional profile photo. This will be visible to other users.</p>
              
              <div 
                {...getProfilePicRootProps()} 
                className="border-2 border-dashed border-primary-light rounded-md p-6 mb-6 cursor-pointer hover:border-accent transition-colors"
              >
                <input {...getProfilePicInputProps()} />
                {profilePicture ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={URL.createObjectURL(profilePicture)} 
                      alt="Profile Preview" 
                      className="w-32 h-32 object-cover rounded-full mb-4" 
                    />
                    <p className="text-accent">{profilePicture.name}</p>
                    <p className="text-sm text-gray-400 mt-1">Click or drag to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-accent mb-4" />
                    <p className="text-white text-center">Drag and drop your profile picture here, or click to select</p>
                    <p className="text-sm text-gray-400 mt-1">Supported formats: JPG, PNG. Max size: 2MB</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(userRole === 'student' ? 3 : 4)}
                  disabled={!profilePicture}
                >
                  {userRole === 'student' ? 'Next Step' : 'Complete Setup'}
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 3 && userRole === 'student' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Resume Upload</h2>
              <p className="text-gray-300 mb-6">Upload your resume. This will be shared with mentors when you apply to opportunities.</p>
              
              <div 
                {...getResumeRootProps()} 
                className="border-2 border-dashed border-primary-light rounded-md p-6 mb-6 cursor-pointer hover:border-accent transition-colors"
              >
                <input {...getResumeInputProps()} />
                {resume ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center mb-4">
                      <span className="text-primary text-xs font-bold">PDF</span>
                    </div>
                    <p className="text-accent">{resume.name}</p>
                    <p className="text-sm text-gray-400 mt-1">Click or drag to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-accent mb-4" />
                    <p className="text-white text-center">Drag and drop your resume here, or click to select</p>
                    <p className="text-sm text-gray-400 mt-1">Supported formats: PDF, DOC, DOCX. Max size: 5MB</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)}
                  disabled={!resume}
                >
                  Complete Setup
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-accent/20 p-4 rounded-full mb-6">
                  <Check className="h-12 w-12 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">You're All Set!</h2>
                <p className="text-gray-300 mb-8">Your profile information looks great. Ready to complete the setup?</p>
                
                <Button 
                  fullWidth 
                  onClick={() => {
                    const formData = {};
                    // In a real implementation, you would collect all the form data from previous steps
                    // and submit it here
                    handleSubmit(formData);
                  }}
                  isLoading={profilePictureUploading || resumeUploading}
                  disabled={profilePictureUploading || resumeUploading}
                >
                  {profilePictureUploading || resumeUploading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Uploading Files...
                    </>
                  ) : (
                    'Complete Profile Setup'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetupPage;