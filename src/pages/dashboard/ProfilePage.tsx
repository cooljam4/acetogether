import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { API, Storage } from 'aws-amplify';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, User, FileText, Briefcase, GraduationCap, Link as LinkIcon, Download } from 'lucide-react';
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

const ProfilePage = () => {
  const { user, userRole, refreshUserSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('acetogether', `/profile/${user.username}`, {});
      setProfile(response.profile);

      // Get signed URLs for profile picture and resume if they exist
      if (response.profile.profilePictureKey) {
        const pictureUrl = await Storage.get(response.profile.profilePictureKey);
        setProfilePictureUrl(pictureUrl);
      }

      if (response.profile.resumeKey) {
        const resumeUrl = await Storage.get(response.profile.resumeKey);
        setResumeUrl(resumeUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      let profilePictureKey = profile?.profilePictureKey;
      let resumeKey = profile?.resumeKey;

      // Upload new profile picture if changed
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop()?.toLowerCase();
        const fileName = `profile-pictures/${user.username}/${Date.now()}.${fileExt}`;
        
        await Storage.put(fileName, profilePicture, {
          contentType: profilePicture.type,
          level: 'protected'
        });
        
        profilePictureKey = fileName;
      }

      // Upload new resume if changed
      if (resume) {
        const fileExt = resume.name.split('.').pop()?.toLowerCase();
        const fileName = `resumes/${user.username}/${Date.now()}.${fileExt}`;
        
        await Storage.put(fileName, resume, {
          contentType: resume.type,
          level: 'protected'
        });
        
        resumeKey = fileName;
      }

      // Update profile
      await API.put('acetogether', `/profile/${user.username}`, {
        body: {
          ...values,
          profilePictureKey,
          resumeKey,
        },
      });

      await refreshUserSession();
      await fetchProfile();
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-24 bg-primary rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-primary rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-primary rounded w-1/4"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-primary rounded w-full"></div>
            <div className="h-4 bg-primary rounded w-3/4"></div>
            <div className="h-4 bg-primary rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            {editing ? (
              <Formik
                initialValues={{
                  ...(userRole === 'student' ? {
                    school: profile?.school || '',
                    major: profile?.major || '',
                    gpa: profile?.gpa || '',
                    degreeLevel: profile?.degreeLevel || '',
                    linkedinUrl: profile?.linkedinUrl || '',
                    bio: profile?.bio || '',
                  } : {
                    company: profile?.company || '',
                    jobTitle: profile?.jobTitle || '',
                    linkedinUrl: profile?.linkedinUrl || '',
                    bio: profile?.bio || '',
                  })
                }}
                validationSchema={userRole === 'student' ? StudentSchema : MentorSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-6">
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-white mb-4">Profile Picture</h3>
                      <div 
                        {...getProfilePicRootProps()} 
                        className="border-2 border-dashed border-primary-light rounded-md p-6 cursor-pointer hover:border-accent transition-colors"
                      >
                        <input {...getProfilePicInputProps()} />
                        {profilePicture || profilePictureUrl ? (
                          <div className="flex items-center justify-center">
                            <img 
                              src={profilePicture ? URL.createObjectURL(profilePicture) : profilePictureUrl!}
                              alt="Profile Preview"
                              className="w-32 h-32 object-cover rounded-full mb-4"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-12 w-12 text-accent mx-auto mb-4" />
                            <p className="text-white">
                              Drag and drop your profile picture here, or click to select
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Supported formats: JPG, PNG. Max size: 2MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {userRole === 'student' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field
                            as={Input}
                            name="school"
                            label="School"
                            placeholder="Enter your school name"
                            error={touched.school && errors.school}
                          />
                          
                          <Field
                            as={Input}
                            name="major"
                            label="Major"
                            placeholder="Enter your major"
                            error={touched.major && errors.major}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field
                            as={Input}
                            name="gpa"
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            label="GPA"
                            placeholder="Enter your GPA"
                            error={touched.gpa && errors.gpa}
                          />
                          
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-200">
                              Degree Level
                            </label>
                            <Field
                              as="select"
                              name="degreeLevel"
                              className="bg-primary border border-primary-light rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                              <option value="">Select degree level</option>
                              <option value="Bachelors">Bachelor's</option>
                              <option value="Masters">Master's</option>
                              <option value="PhD">PhD</option>
                              <option value="Associates">Associate's</option>
                            </Field>
                            {touched.degreeLevel && errors.degreeLevel && (
                              <p className="mt-1 text-sm text-error">{errors.degreeLevel}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-medium text-white mb-4">Resume</h3>
                          <div 
                            {...getResumeRootProps()} 
                            className="border-2 border-dashed border-primary-light rounded-md p-6 cursor-pointer hover:border-accent transition-colors"
                          >
                            <input {...getResumeInputProps()} />
                            {resume || resumeUrl ? (
                              <div className="flex items-center justify-center">
                                <FileText className="h-12 w-12 text-accent mb-4" />
                                <p className="text-white ml-4">
                                  {resume ? resume.name : 'Current resume uploaded'}
                                </p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="h-12 w-12 text-accent mx-auto mb-4" />
                                <p className="text-white">
                                  Drag and drop your resume here, or click to select
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Supported formats: PDF, DOC, DOCX. Max size: 5MB
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                          as={Input}
                          name="company"
                          label="Company"
                          placeholder="Enter your company name"
                          error={touched.company && errors.company}
                        />
                        
                        <Field
                          as={Input}
                          name="jobTitle"
                          label="Job Title"
                          placeholder="Enter your job title"
                          error={touched.jobTitle && errors.jobTitle}
                        />
                      </div>
                    )}

                    <Field
                      as={Input}
                      name="linkedinUrl"
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/yourprofile"
                      error={touched.linkedinUrl && errors.linkedinUrl}
                    />

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-200">
                        Bio
                      </label>
                      <Field
                        as="textarea"
                        name="bio"
                        rows={4}
                        className="bg-primary border border-primary-light rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Tell us about yourself..."
                      />
                      {touched.bio && errors.bio && (
                        <p className="mt-1 text-sm text-error">{errors.bio}</p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center">
                    {profilePictureUrl ? (
                      <img
                        src={profilePictureUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-primary-dark rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-accent" />
                      </div>
                    )}
                    <div className="ml-6">
                      <h2 className="text-2xl font-bold text-white">
                        {user.attributes.given_name} {user.attributes.family_name}
                      </h2>
                      <p className="text-gray-400">
                        {userRole === 'student' ? 'Student' : 'Mentor'}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    {userRole === 'student' ? (
                      <>
                        <div className="mb-6">
                          <h3 className="text-lg font-medium text-white mb-4">Academic Information</h3>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <GraduationCap className="h-5 w-5 text-accent mr-3" />
                              <div>
                                <p className="text-sm text-gray-400">School</p>
                                <p className="text-white">{profile?.school}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-5 w-5 text-accent mr-3" />
                              <div>
                                <p className="text-sm text-gray-400">Major</p>
                                <p className="text-white">{profile?.major}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="h-5 w-5 text-accent mr-3" />
                              <div>
                                <p className="text-sm text-gray-400">Degree Level</p>
                                <p className="text-white">{profile?.degreeLevel}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="h-5 w-5 text-accent mr-3" />
                              <div>
                                <p className="text-sm text-gray-400">GPA</p>
                                <p className="text-white">{profile?.gpa}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {resumeUrl && (
                          <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-4">Resume</h3>
                            <div className="bg-primary p-4 rounded-md flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-accent mr-3" />
                                <span className="text-white">Your Resume</span>
                              </div>
                              <a
                                href={resumeUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-accent hover:text-accent-light"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Professional Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-accent mr-3" />
                            <div>
                              <p className="text-sm text-gray-400">Company</p>
                              <p className="text-white">{profile?.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-accent mr-3" />
                            <div>
                              <p className="text-sm text-gray-400">Job Title</p>
                              <p className="text-white">{profile?.jobTitle}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {profile?.linkedinUrl && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-accent hover:text-accent-light"
                        >
                          <LinkIcon className="h-5 w-5 mr-2" />
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Bio</h3>
                    <p className="text-gray-300 whitespace-pre-line">
                      {profile?.bio || 'No bio provided yet.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;