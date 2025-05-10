import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API, Auth, Storage } from 'aws-amplify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  Download, 
  GraduationCap, 
  Building,
  User,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Opportunity, Quiz, QuizQuestion } from '../../types';
import Input from '../../components/ui/Input';

const OpportunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [mentorDetails, setMentorDetails] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [detailsUrl, setDetailsUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        setLoading(true);
        
        // Fetch opportunity details
        const opportunityRes = await API.get('acetogether', `/opportunity/${id}`, {});
        setOpportunity(opportunityRes.opportunity);
        
        // Check if user has already applied (if they're a student)
        if (userRole === 'student') {
          const applicationRes = await API.get('acetogether', '/applications/student', {
            queryStringParameters: { userId: user.username, opportunityId: id },
          });
          setHasApplied(applicationRes.applications.length > 0);
        }
        
        // Fetch mentor details
        const mentorRes = await API.get('acetogether', `/profile/${opportunityRes.opportunity.mentorId}`, {});
        setMentorDetails(mentorRes.profile);
        
        // Fetch quiz if it exists
        if (opportunityRes.opportunity.quiz) {
          const quizRes = await API.get('acetogether', `/quiz/${opportunityRes.opportunity.quiz.id}`, {});
          setQuiz(quizRes.quiz);
        }
        
        // Get signed URL for details document if it exists
        if (opportunityRes.opportunity.detailsUrl) {
          const signedUrl = await Storage.get(opportunityRes.opportunity.detailsUrl);
          setDetailsUrl(signedUrl);
        }
        
      } catch (error) {
        console.error('Error fetching opportunity data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunityData();
  }, [id, user, userRole]);

  // Generate validation schema dynamically based on quiz questions
  const generateValidationSchema = () => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      return Yup.object().shape({});
    }

    const validationFields: any = {};
    quiz.questions.forEach((question: QuizQuestion) => {
      validationFields[`answer_${question.id}`] = Yup.string().required('Answer is required');
    });

    return Yup.object().shape(validationFields);
  };

  const handleSubmitApplication = async (values: any) => {
    try {
      // Format the answers
      const answers = Object.keys(values).map(key => {
        const questionId = key.replace('answer_', '');
        return {
          questionId,
          answer: values[key],
        };
      });

      // Submit application
      await API.post('acetogether', '/application', {
        body: {
          opportunityId: id,
          studentId: user.username,
          answers,
        },
      });

      // Show success and navigate to applications
      alert('Application submitted successfully!');
      navigate('/dashboard/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-pulse">
            <div className="h-8 bg-primary-dark rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-primary-dark rounded w-full mb-3"></div>
            <div className="h-4 bg-primary-dark rounded w-full mb-3"></div>
            <div className="h-4 bg-primary-dark rounded w-3/4"></div>
          </Card>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Opportunity Not Found</h2>
            <p className="text-gray-300 mb-6">The opportunity you're looking for doesn't exist or has been removed.</p>
            <Link to="/dashboard/opportunities">
              <Button>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Opportunities
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard/opportunities" className="text-accent hover:text-accent-light flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Link>
        </div>
        
        <Card className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{opportunity.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-primary-dark px-3 py-1 rounded-md text-sm text-gray-300 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-accent" />
                  {opportunity.requiredMajor}
                </span>
                <span className="bg-primary-dark px-3 py-1 rounded-md text-sm text-gray-300 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-accent" />
                  {opportunity.requiredDegreeLevel}
                </span>
                <span className="bg-primary-dark px-3 py-1 rounded-md text-sm text-gray-300 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-accent" />
                  GPA: {opportunity.minGpa}+
                </span>
              </div>
            </div>
            
            {userRole === 'student' && !hasApplied && (
              <div className="flex-shrink-0">
                <Button size="sm" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Apply Now
                </Button>
              </div>
            )}
            
            {userRole === 'student' && hasApplied && (
              <div className="flex-shrink-0">
                <span className="bg-success/20 text-success px-4 py-2 rounded-md">
                  Applied
                </span>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">Description</h2>
            <p className="text-gray-300 whitespace-pre-line">{opportunity.description}</p>
          </div>
          
          {detailsUrl && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-3">Additional Details</h2>
              <div className="bg-primary-dark p-4 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-300">Opportunity Details Document</span>
                </div>
                <a href={detailsUrl} download target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            </div>
          )}
          
          {mentorDetails && (
            <div>
              <h2 className="text-xl font-bold text-white mb-3">About the Mentor</h2>
              <div className="bg-primary-dark p-4 rounded-md">
                <div className="flex items-center mb-3">
                  {mentorDetails.profilePictureUrl ? (
                    <img 
                      src={mentorDetails.profilePictureUrl} 
                      alt={mentorDetails.firstName} 
                      className="w-12 h-12 rounded-full object-cover mr-4" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-accent" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-medium">{mentorDetails.firstName} {mentorDetails.lastName}</h3>
                    <p className="text-gray-400 text-sm">{mentorDetails.jobTitle} at {mentorDetails.company}</p>
                  </div>
                </div>
                {mentorDetails.bio && (
                  <p className="text-gray-300 text-sm">{mentorDetails.bio}</p>
                )}
                {mentorDetails.linkedinUrl && (
                  <a 
                    href={mentorDetails.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light text-sm flex items-center mt-2"
                  >
                    View LinkedIn Profile
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          )}
        </Card>
        
        {userRole === 'student' && !hasApplied && quiz && quiz.questions && quiz.questions.length > 0 && (
          <Card id="application-form">
            <h2 className="text-xl font-bold text-white mb-4">Application Questions</h2>
            <p className="text-gray-300 mb-6">
              Please answer the following questions to complete your application.
            </p>
            
            <Formik
              initialValues={quiz.questions.reduce((acc: any, question: QuizQuestion) => {
                acc[`answer_${question.id}`] = '';
                return acc;
              }, {})}
              validationSchema={generateValidationSchema()}
              onSubmit={handleSubmitApplication}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  {quiz.questions.map((question: QuizQuestion, index: number) => (
                    <div key={question.id}>
                      <label className="block text-white font-medium mb-2">
                        {index + 1}. {question.question}
                      </label>
                      <Field
                        as="textarea"
                        name={`answer_${question.id}`}
                        rows={4}
                        className="bg-primary border border-primary-light rounded-md px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      {errors[`answer_${question.id}`] && touched[`answer_${question.id}`] && (
                        <p className="mt-1 text-sm text-error">{errors[`answer_${question.id}`] as string}</p>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Submit Application
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        )}
        
        {userRole === 'student' && !hasApplied && (!quiz || !quiz.questions || quiz.questions.length === 0) && (
          <Card id="application-form">
            <h2 className="text-xl font-bold text-white mb-4">Apply to this Opportunity</h2>
            <p className="text-gray-300 mb-6">
              No questions required for this opportunity. Click below to apply.
            </p>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => handleSubmitApplication({})}
              >
                Submit Application
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OpportunityPage;