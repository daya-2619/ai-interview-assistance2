import { User } from '../types';
import { generateUserId, hashPassword } from './auth';

// Demo users for testing
export function seedDemoUsers(): void {
  const existingUsers = localStorage.getItem('interview_users');
  if (existingUsers && JSON.parse(existingUsers).length > 0) {
    return; // Don't seed if users already exist
  }

  const demoUsers: User[] = [
    {
      id: generateUserId(),
      email: 'interviewer@demo.com',
      name: 'Sarah Johnson',
      role: 'interviewer',
      password: hashPassword('demo123'),
      createdAt: new Date().toISOString()
    },
    {
      id: generateUserId(),
      email: 'candidate@demo.com',
      name: 'John Smith',
      role: 'interviewee',
      phone: '+1-555-0123',
      password: hashPassword('demo123'),
      createdAt: new Date().toISOString()
    }
  ];

  localStorage.setItem('interview_users', JSON.stringify(demoUsers));
}

// Call this function to seed demo data
export function initializeDemoData(): void {
  seedDemoUsers();
}
