// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'mentor';
  profileComplete: boolean;
}

export interface StudentProfile {
  id: string;
  userId: string;
  school: string;
  major: string;
  gpa: number;
  degreeLevel: string;
  linkedinUrl: string;
  bio: string;
  profilePictureUrl?: string;
  resumeUrl?: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  company: string;
  jobTitle: string;
  linkedinUrl: string;
  bio: string;
  profilePictureUrl?: string;
}

// Opportunity Types
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  requiredMajor: string;
  minGpa: number;
  requiredDegreeLevel: string;
  detailsUrl?: string;
  mentorId: string;
  createdAt: string;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  opportunityId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  answers: QuizAnswer[];
  appliedAt: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

// Message Types
export interface Conversation {
  id: string;
  opportunityId: string;
  studentId: string;
  mentorId: string;
  lastMessageAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'opportunity' | 'message' | 'application' | 'profile';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}