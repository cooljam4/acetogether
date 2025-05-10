import { useState, useEffect, useRef } from 'react';
import { API } from 'aws-amplify';
import { format } from 'date-fns';
import { Send, User, Search, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Conversation, Message } from '../../types';

const MessagesPage = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<Record<string, any>>({});
  const [canMessage, setCanMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      // Student can only message if there are existing messages
      if (userRole === 'student') {
        checkCanMessage(selectedConversation.id);
      }
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkCanMessage = async (conversationId: string) => {
    try {
      const response = await API.get('acetogether', `/messages/${conversationId}`, {});
      // Student can message if there's at least one message from the mentor
      setCanMessage(response.messages.some((msg: Message) => msg.senderId === selectedConversation?.mentorId));
    } catch (error) {
      console.error('Error checking message permission:', error);
      setCanMessage(false);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await API.get('acetogether', '/conversations', {
        queryStringParameters: { userId: user.username }
      });
      setConversations(response.conversations);

      // Fetch participant details for all conversations
      const participantIds = response.conversations.reduce((ids: string[], conv: Conversation) => {
        if (userRole === 'student') {
          ids.push(conv.mentorId);
        } else {
          ids.push(conv.studentId);
        }
        return ids;
      }, []);

      const uniqueIds = [...new Set(participantIds)];
      const participantDetails: Record<string, any> = {};

      await Promise.all(
        uniqueIds.map(async (id) => {
          const userResponse = await API.get('acetogether', `/profile/${id}`, {});
          participantDetails[id] = userResponse.profile;
        })
      );

      setParticipants(participantDetails);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await API.get('acetogether', `/messages/${conversationId}`, {});
      setMessages(response.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // Check if user has permission to send message
    if (userRole === 'student' && !canMessage) {
      return;
    }

    try {
      const message = await API.post('acetogether', '/message', {
        body: {
          conversationId: selectedConversation.id,
          content: newMessage.trim(),
          senderId: user.username
        }
      });

      setMessages([...messages, message]);
      setNewMessage('');

      // Update conversation's last message timestamp
      const updatedConversations = conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessageAt: new Date().toISOString() }
          : conv
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter((conversation) => {
    const participant = userRole === 'student' 
      ? participants[conversation.mentorId]
      : participants[conversation.studentId];
    
    if (!participant) return false;

    const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const getParticipantName = (conversation: Conversation) => {
    const participantId = userRole === 'student' ? conversation.mentorId : conversation.studentId;
    const participant = participants[participantId];
    return participant ? `${participant.firstName} ${participant.lastName}` : 'Loading...';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
              <div className="p-4 border-b border-primary">
                <div className="relative">
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-primary rounded w-3/4"></div>
                            <div className="h-3 bg-primary rounded w-1/2 mt-2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="divide-y divide-primary">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full p-4 text-left hover:bg-primary transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-primary' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-accent" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-white font-medium">
                              {getParticipantName(conversation)}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Last message: {format(new Date(conversation.lastMessageAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    {userRole === 'student' 
                      ? "Mentors will appear here when they message you"
                      : "No conversations found"}
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Messages */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-primary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-accent" />
                        </div>
                        <h2 className="ml-3 text-lg font-medium text-white">
                          {getParticipantName(selectedConversation)}
                        </h2>
                      </div>
                      {userRole === 'student' && !canMessage && (
                        <div className="flex items-center text-warning">
                          <Lock className="h-4 w-4 mr-2" />
                          <span className="text-sm">Waiting for mentor to start the conversation</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user.username ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.senderId === user.username
                                ? 'bg-accent text-primary-dark'
                                : 'bg-primary text-white'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user.username
                                ? 'text-primary-dark/70'
                                : 'text-gray-400'
                            }`}>
                              {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-primary">
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          userRole === 'student' && !canMessage
                            ? "Waiting for mentor to start the conversation..."
                            : "Type your message..."
                        }
                        disabled={userRole === 'student' && !canMessage}
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={!newMessage.trim() || (userRole === 'student' && !canMessage)}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <User className="h-12 w-12 text-accent mx-auto mb-4" />
                    <p className="text-gray-400">
                      {userRole === 'student'
                        ? "Select a conversation to view messages"
                        : "Select a student to start messaging"}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;