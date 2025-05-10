import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API } from 'aws-amplify';
import { 
  Briefcase, 
  ClipboardList, 
  MessageSquare, 
  User, 
  ArrowRight, 
  PlusCircle,
  Users,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Application, Opportunity, Notification } from '../../types';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    opportunitiesCount: 0,
    applicationsCount: 0,
    activeConversations: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [opportunitiesRes, applicationsRes, notificationsRes, conversationsRes] = await Promise.all([
          API.get('acetogether', '/opportunities/mentor', { queryStringParameters: { mentorId: user.username } }),
          API.get('acetogether', '/applications/mentor', { queryStringParameters: { mentorId: user.username } }),
          API.get('acetogether', '/notifications', { queryStringParameters: { userId: user.username, limit: 5 } }),
          API.get('acetogether', '/conversations', { queryStringParameters: { userId: user.username } }),
        ]);
        
        setOpportunities(opportunitiesRes.opportunities);
        setApplications(applicationsRes.applications);
        setNotifications(notificationsRes.notifications);
        
        // Calculate stats
        setStats({
          opportunitiesCount: opportunitiesRes.opportunities.length,
          applicationsCount: applicationsRes.applications.length,
          activeConversations: conversationsRes.conversations.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">
        Hello, {user?.attributes?.given_name}!
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="flex items-center">
            <div className="p-3 bg-accent/20 rounded-full mr-4">
              <Briefcase className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Posted Opportunities</p>
              <p className="text-2xl font-bold text-white">{stats.opportunitiesCount}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="flex items-center">
            <div className="p-3 bg-success/20 rounded-full mr-4">
              <ClipboardList className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-white">{stats.applicationsCount}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="flex items-center">
            <div className="p-3 bg-warning/20 rounded-full mr-4">
              <MessageSquare className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Active Conversations</p>
              <p className="text-2xl font-bold text-white">{stats.activeConversations}</p>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Your Opportunities */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Your Opportunities</h2>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/my-opportunities" className="text-accent hover:text-accent-light flex items-center text-sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <Link to="/dashboard/create-opportunity">
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-4 bg-primary-dark rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-primary-dark rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-primary-dark rounded w-1/4"></div>
                  </Card>
                ))}
              </>
            ) : opportunities.length > 0 ? (
              opportunities.slice(0, 3).map((opportunity) => (
                <Card key={opportunity.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {opportunity.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {opportunity.description.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-primary px-2 py-1 rounded-md text-xs text-gray-300">
                          {opportunity.requiredMajor}
                        </span>
                        <span className="bg-primary px-2 py-1 rounded-md text-xs text-gray-300">
                          GPA: {opportunity.minGpa}+
                        </span>
                      </div>
                    </div>
                    <div className="bg-accent/10 px-3 py-1 rounded-full flex items-center">
                      <Users className="h-3 w-3 text-accent mr-1" />
                      <span className="text-xs text-accent">
                        {applications.filter(app => app.opportunityId === opportunity.id).length} applicants
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <div className="text-center py-4">
                  <p className="text-gray-300 mb-4">You haven't created any opportunities yet.</p>
                  <Link to="/dashboard/create-opportunity">
                    <Button>Create Your First Opportunity</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
          
          {/* Recent Applications */}
          <div className="mt-8">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Recent Applications</h2>
              <Link to="/dashboard/applications" className="text-accent hover:text-accent-light flex items-center text-sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <>
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-4 bg-primary-dark rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-primary-dark rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-primary-dark rounded w-1/4"></div>
                    </Card>
                  ))}
                </>
              ) : applications.length > 0 ? (
                applications.slice(0, 3).map((application) => (
                  <Card key={application.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold mb-1">
                          {opportunities.find(o => o.id === application.opportunityId)?.title || 'Opportunity Title'}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm mb-2">
                          <User className="h-3 w-3 mr-1" />
                          Student: {application.studentName || 'Student Name'}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          Applied: {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm">Message</Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <div className="text-center py-4">
                    <p className="text-gray-300">No applications received yet.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        {/* Notifications and actions */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Notifications</h2>
            <div className="space-y-3">
              {loading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-primary-light p-3 rounded-md animate-pulse">
                      <div className="h-3 bg-primary-dark rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-primary-dark rounded w-1/2"></div>
                    </div>
                  ))}
                </>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="bg-primary-light p-3 rounded-md">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                        notification.type === 'message'
                          ? 'bg-accent/20'
                          : notification.type === 'opportunity'
                          ? 'bg-success/20'
                          : 'bg-warning/20'
                      }`}>
                        {notification.type === 'message' ? (
                          <MessageSquare className="h-4 w-4 text-accent" />
                        ) : notification.type === 'opportunity' ? (
                          <Briefcase className="h-4 w-4 text-success" />
                        ) : (
                          <ClipboardList className="h-4 w-4 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{notification.title}</p>
                        <p className="text-gray-400 text-xs">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-primary-light p-4 rounded-md text-center">
                  <p className="text-gray-300">No notifications yet</p>
                </div>
              )}
            </div>
            
            <div className="mt-3 text-right">
              <Link to="/dashboard/notifications" className="text-accent hover:text-accent-light text-sm">
                View All
              </Link>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <Card>
              <div className="space-y-3">
                <Link to="/dashboard/create-opportunity">
                  <Button fullWidth>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Opportunity
                  </Button>
                </Link>
                <Link to="/dashboard/messages">
                  <Button variant="outline" fullWidth>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                </Link>
                <Link to="/dashboard/applications">
                  <Button variant="outline" fullWidth>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Review Applications
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;