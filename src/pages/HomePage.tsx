import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, GraduationCap, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-90" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')] bg-cover bg-center opacity-20" />
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Unlock Your <span className="text-accent">Potential</span> With Expert Mentorship
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-300 mb-10"
            >
              Connect with industry professionals who can guide your career journey and open doors to exciting opportunities.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/signup">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/learn-more">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How AceTogether Works</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Our platform bridges the gap between students and industry professionals, creating valuable connections and opportunities.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full flex flex-col items-center text-center" hoverEffect={false}>
                <div className="bg-primary p-4 rounded-full mb-6">
                  <GraduationCap className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">For Students</h3>
                <p className="text-gray-300 mb-6 flex-grow">Create a profile showcasing your academic achievements, upload your resume, and apply to opportunities with industry professionals.</p>
                <Link to="/signup" className="text-accent hover:text-accent-light flex items-center">
                  Join as a Student
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full flex flex-col items-center text-center" hoverEffect={false}>
                <div className="bg-primary p-4 rounded-full mb-6">
                  <Briefcase className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">For Mentors</h3>
                <p className="text-gray-300 mb-6 flex-grow">Share your expertise, create opportunities, and connect with talented students who match your requirements and vision.</p>
                <Link to="/signup" className="text-accent hover:text-accent-light flex items-center">
                  Join as a Mentor
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full flex flex-col items-center text-center" hoverEffect={false}>
                <div className="bg-primary p-4 rounded-full mb-6">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Make Connections</h3>
                <p className="text-gray-300 mb-6 flex-grow">Engage through our platform with secure messaging, application tracking, and opportunity management tools.</p>
                <Link to="/learn-more" className="text-accent hover:text-accent-light flex items-center">
                  Learn How It Works
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">See how AceTogether has transformed careers and created opportunities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="relative pl-10">
              <div className="absolute top-6 left-6 transform -translate-x-1/2">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-primary-dark text-lg font-bold">"</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 italic">Thanks to AceTogether, I connected with a mentor from my dream company who guided me through the interview process. I'm now working at a job I love!</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center">
                  <span className="text-accent font-bold">MS</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-medium">Michelle S.</h4>
                  <p className="text-sm text-gray-400">Computer Science Graduate</p>
                </div>
              </div>
            </Card>
            
            <Card className="relative pl-10">
              <div className="absolute top-6 left-6 transform -translate-x-1/2">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-primary-dark text-lg font-bold">"</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 italic">As a mentor, I've found incredible talent through AceTogether. The platform makes it easy to find students who are a perfect fit for our opportunities.</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-dark flex items-center justify-center">
                  <span className="text-accent font-bold">JR</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-medium">James R.</h4>
                  <p className="text-sm text-gray-400">Tech Company Manager</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-light relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-95" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')] bg-cover bg-center opacity-10" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Advance Your Career?</h2>
            <p className="text-lg text-gray-300 mb-10">Join AceTogether today and connect with mentors and opportunities that can transform your future.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto mb-10">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-left">Create a personalized profile highlighting your skills</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-left">Connect with industry professionals</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-left">Apply to exclusive opportunities</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-left">Receive guidance from experienced mentors</p>
              </div>
            </div>
            
            <Link to="/signup">
              <Button size="lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;