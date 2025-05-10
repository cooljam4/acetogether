import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, MessageSquare, CheckCircle, Award, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LearnMorePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Discover <span className="text-accent">AceTogether</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-6"
            >
              Learn how our platform connects talented students with mentors and unlocks opportunities for both.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300">
                AceTogether was founded on a simple principle: to bridge the gap between academic achievement and professional opportunity. We believe that talented students deserve access to mentors who can guide their career journeys, and that companies benefit from discovering fresh talent with potential.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="flex flex-col items-center text-center">
                <div className="bg-primary p-3 rounded-full mb-5">
                  <GraduationCap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">For Students</h3>
                <p className="text-gray-300">We empower students to showcase their talents and connect with mentors who can guide their professional development.</p>
              </Card>
              
              <Card className="flex flex-col items-center text-center">
                <div className="bg-primary p-3 rounded-full mb-5">
                  <Briefcase className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">For Mentors</h3>
                <p className="text-gray-300">We help professionals discover promising talent and share their expertise with the next generation of leaders.</p>
              </Card>
              
              <Card className="flex flex-col items-center text-center">
                <div className="bg-primary p-3 rounded-full mb-5">
                  <MessageSquare className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Our Platform</h3>
                <p className="text-gray-300">We provide a secure, professional environment for meaningful connections and relationship building.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How AceTogether Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Our platform makes it easy to build professional relationships and find opportunities.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-accent opacity-30"></div>
              
              <div className="grid grid-cols-1 gap-12">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 order-2 md:order-1">
                    <Card>
                      <h3 className="text-xl font-bold text-white mb-3">Create Your Profile</h3>
                      <p className="text-gray-300 mb-4">
                        Students: Showcase your academic achievements, skills, and career goals.
                      </p>
                      <p className="text-gray-300">
                        Mentors: Share your experience, expertise, and what you're looking for in potential mentees.
                      </p>
                    </Card>
                  </div>
                  <div className="md:mx-10 my-6 md:my-0 order-1 md:order-2 relative z-10">
                    <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl font-bold">1</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:mx-10 my-6 md:my-0 order-1 relative z-10">
                    <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl font-bold">2</span>
                    </div>
                  </div>
                  <div className="flex-1 order-2">
                    <Card>
                      <h3 className="text-xl font-bold text-white mb-3">Create or Apply to Opportunities</h3>
                      <p className="text-gray-300 mb-4">
                        Mentors: Create opportunity listings with clear requirements and expectations.
                      </p>
                      <p className="text-gray-300">
                        Students: Browse opportunities and apply to those that match your skills and interests.
                      </p>
                    </Card>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 order-2 md:order-1">
                    <Card>
                      <h3 className="text-xl font-bold text-white mb-3">Connect and Communicate</h3>
                      <p className="text-gray-300 mb-4">
                        Mentors review applications and initiate conversations with promising candidates.
                      </p>
                      <p className="text-gray-300">
                        Our secure messaging system facilitates professional communication and relationship building.
                      </p>
                    </Card>
                  </div>
                  <div className="md:mx-10 my-6 md:my-0 order-1 md:order-2 relative z-10">
                    <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl font-bold">3</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:mx-10 my-6 md:my-0 order-1 relative z-10">
                    <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl font-bold">4</span>
                    </div>
                  </div>
                  <div className="flex-1 order-2">
                    <Card>
                      <h3 className="text-xl font-bold text-white mb-3">Grow Together</h3>
                      <p className="text-gray-300 mb-4">
                        Build meaningful professional relationships that benefit both parties.
                      </p>
                      <p className="text-gray-300">
                        Track progress, share resources, and open doors to new opportunities.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Real people, real success. Here's what our users have to say.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center">
                    <span className="text-accent font-bold">JD</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Jason D.</h4>
                  <p className="text-sm text-gray-400">Engineering Student</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-300 italic">
                "AceTogether connected me with a mentor who helped me refine my resume and prepare for interviews. I landed my dream internship because of their guidance!"
              </p>
            </Card>
            
            <Card>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center">
                    <span className="text-accent font-bold">ML</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Maria L.</h4>
                  <p className="text-sm text-gray-400">Marketing Director</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-300 italic">
                "As a mentor, I've found incredible talent through this platform. The quiz feature helps me quickly identify candidates who align with our company's values and needs."
              </p>
            </Card>
            
            <Card>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center">
                    <span className="text-accent font-bold">TR</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Taylor R.</h4>
                  <p className="text-sm text-gray-400">Business Graduate</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-300 italic">
                "The structured approach to mentorship on AceTogether made all the difference. I received guidance that was directly relevant to my career goals and helped me navigate my job search."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Our comprehensive set of tools designed to facilitate meaningful connections.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Role-Based Profiles</h3>
                <p className="text-gray-300">Customized profiles for students and mentors with relevant information fields.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Secure File Storage</h3>
                <p className="text-gray-300">Upload resumes, portfolios, and opportunity documents with confidence.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Opportunity Creation</h3>
                <p className="text-gray-300">Easily create and manage opportunity listings with specific requirements.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Custom Quiz Questions</h3>
                <p className="text-gray-300">Create tailored quiz questions to identify the right candidates for opportunities.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Controlled Communication</h3>
                <p className="text-gray-300">Secure, mentor-initiated messaging system for professional interactions.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Smart Notifications</h3>
                <p className="text-gray-300">Stay updated with relevant notifications about your opportunities and connections.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Application Tracking</h3>
                <p className="text-gray-300">Easily monitor application status and progress for both students and mentors.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Responsive Design</h3>
                <p className="text-gray-300">Access the platform seamlessly from any device, anywhere.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Data Security</h3>
                <p className="text-gray-300">Enterprise-grade security for your personal information and communications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Join AceTogether?</h2>
            <p className="text-lg text-gray-300 mb-8">Start your journey of connection, mentorship, and opportunity today.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMorePage;