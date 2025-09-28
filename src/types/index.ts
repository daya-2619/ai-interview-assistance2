export interface User {
  id: string;
  email: string;
  name: string;
  role: 'interviewer' | 'interviewee';
  phone?: string;
  avatar?: string;
  password?: string; // For demo purposes - in production, never store passwords in frontend
  createdAt?: string;
}

export interface AuthUser {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role: 'interviewer' | 'interviewee';
}

export interface Resume {
  fileName: string;
  fileType: string;
  uploadDate: string;
  extractedData: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  text: string;
  timeSpent: number;
  score: number;
  feedback: string;
  submittedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume: Resume;
  questions: Question[];
  answers: Answer[];
  finalScore: number;
  summary: string;
  status: 'pending' | 'in-progress' | 'completed' | 'paused';
  startedAt: string;
  completedAt?: string;
  currentQuestionIndex: number;
}

export interface InterviewSession {
  candidateId: string;
  currentQuestion: number;
  startTime: string;
  pausedAt?: string;
  isActive: boolean;
}