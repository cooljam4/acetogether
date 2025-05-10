import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { API, Storage } from 'aws-amplify';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const OpportunitySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  requiredMajor: Yup.string().required('Required major is required'),
  minGpa: Yup.number()
    .min(0, 'GPA must be greater than 0')
    .max(4, 'GPA must be less than or equal to 4')
    .required('Minimum GPA is required'),
  requiredDegreeLevel: Yup.string().required('Required degree level is required'),
  questions: Yup.array().of(
    Yup.object().shape({
      question: Yup.string().required('Question is required')
    })
  ),
});

const CreateOpportunityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [detailsFile, setDetailsFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setDetailsFile(acceptedFiles[0]);
      }
    },
    onDropRejected: () => {
      toast.error('Please upload a PDF, DOC, or DOCX file under 5MB');
    }
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setIsUploading(true);
      let detailsUrl = null;

      // Upload details file if provided
      if (detailsFile) {
        const fileExt = detailsFile.name.split('.').pop()?.toLowerCase();
        const fileName = `opportunities/${user.username}/${Date.now()}.${fileExt}`;
        
        await Storage.put(fileName, detailsFile, {
          contentType: detailsFile.type,
          level: 'protected'
        });
        
        detailsUrl = fileName;
      }

      // Create opportunity
      const opportunity = await API.post('acetogether', '/opportunity', {
        body: {
          ...values,
          mentorId: user.username,
          detailsUrl,
        },
      });

      // Create quiz if questions are provided
      if (values.questions && values.questions.length > 0) {
        await API.post('acetogether', '/quiz', {
          body: {
            opportunityId: opportunity.id,
            questions: values.questions,
          },
        });
      }

      toast.success('Opportunity created successfully!');
      navigate('/dashboard/my-opportunities');
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error('Failed to create opportunity. Please try again.');
    } finally {
      setIsUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Opportunity</h1>
        
        <Card>
          <Formik
            initialValues={{
              title: '',
              description: '',
              requiredMajor: '',
              minGpa: '',
              requiredDegreeLevel: '',
              questions: [{ question: '' }],
            }}
            validationSchema={OpportunitySchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                <Field
                  as={Input}
                  name="title"
                  label="Opportunity Title"
                  placeholder="Enter the opportunity title"
                  error={touched.title && errors.title}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-200">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={6}
                    className="bg-primary border border-primary-light rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Describe the opportunity in detail..."
                  />
                  {touched.description && errors.description && (
                    <p className="mt-1 text-sm text-error">{errors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    as={Input}
                    name="requiredMajor"
                    label="Required Major"
                    placeholder="e.g., Computer Science"
                    error={touched.requiredMajor && errors.requiredMajor}
                  />
                  
                  <Field
                    as={Input}
                    name="minGpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    label="Minimum GPA"
                    placeholder="e.g., 3.0"
                    error={touched.minGpa && errors.minGpa}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-200">
                    Required Degree Level
                  </label>
                  <Field
                    as="select"
                    name="requiredDegreeLevel"
                    className="bg-primary border border-primary-light rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select degree level</option>
                    <option value="Bachelors">Bachelor's</option>
                    <option value="Masters">Master's</option>
                    <option value="PhD">PhD</option>
                    <option value="Associates">Associate's</option>
                  </Field>
                  {touched.requiredDegreeLevel && errors.requiredDegreeLevel && (
                    <p className="mt-1 text-sm text-error">{errors.requiredDegreeLevel}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Additional Details Document</h3>
                  <div 
                    {...getRootProps()} 
                    className="border-2 border-dashed border-primary-light rounded-md p-6 cursor-pointer hover:border-accent transition-colors"
                  >
                    <input {...getInputProps()} />
                    {detailsFile ? (
                      <div className="flex items-center justify-center">
                        <FileText className="h-8 w-8 text-accent mr-3" />
                        <div>
                          <p className="text-white">{detailsFile.name}</p>
                          <p className="text-sm text-gray-400">Click or drag to replace</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-accent mx-auto mb-4" />
                        <p className="text-white">
                          Drag and drop your details document here, or click to select
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Supported formats: PDF, DOC, DOCX. Max size: 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Application Questions</h3>
                  <div className="space-y-4">
                    {values.questions.map((_, index) => (
                      <div key={index}>
                        <Field
                          as={Input}
                          name={`questions.${index}.question`}
                          label={`Question ${index + 1}`}
                          placeholder="Enter your question"
                          error={
                            touched.questions?.[index]?.question &&
                            errors.questions?.[index]?.question
                          }
                        />
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const questions = [...values.questions, { question: '' }];
                        setFieldValue('questions', questions);
                      }}
                    >
                      Add Question
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting || isUploading}
                    disabled={isSubmitting || isUploading}
                  >
                    Create Opportunity
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default CreateOpportunityPage;