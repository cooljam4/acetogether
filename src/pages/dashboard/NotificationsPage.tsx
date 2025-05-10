import { useState, useEffect } from 'react';
import { Bell, MessageSquare, Briefcase, ClipboardList } from 'lucide-react';
import { Amplify } from 'aws-amplify';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Notification } from '../../types';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await Amplify.API.get('acetogether', '/notifications', {
          queryStringParameters: { userId: user.username }
        });
        setNotifications(response.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await Amplify.API.put('acetogether', `/notifications/${notificationId}/read`, {});
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Amplify.API.put('acetogether', '/notifications/read-all', {
        body: { userId: user.username }
      });
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-accent" />;
      case 'opportunity':
        return <Briefcase className="h-5 w-5 text-success" />;
      case 'application':
        return <ClipboardList className="h-5 w-5 text-warning" />;
      default:
        return <Bell className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
        </div>
        
        {notifications.some(n => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary-dark rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-primary-dark rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-primary-dark rounded w-1/2"></div>
                </div>
              </div>
            </Card>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-colors ${!notification.read ? 'border-accent/50' : ''}`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-4 ${
                  notification.type === 'message'
                    ? 'bg-accent/20'
                    : notification.type === 'opportunity'
                    ? 'bg-success/20'
                    : 'bg-warning/20'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                  <p className="text-gray-400 text-sm">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-500 text-xs">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No notifications</h3>
              <p className="text-gray-400">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;