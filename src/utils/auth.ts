import { User, AuthUser } from '../types';

// Simple authentication utilities for demo purposes
// In production, use proper authentication services like Auth0, Firebase Auth, or Supabase Auth

export function generateUserId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function signUp(authData: AuthUser): Promise<{ success: boolean; user?: User; message?: string }> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Validate input
      if (!validateEmail(authData.email)) {
        resolve({ success: false, message: 'Please enter a valid email address' });
        return;
      }

      if (!authData.name || authData.name.trim().length < 2) {
        resolve({ success: false, message: 'Name must be at least 2 characters long' });
        return;
      }

      if (authData.role === 'interviewee' && (!authData.phone || !validatePhone(authData.phone))) {
        resolve({ success: false, message: 'Please enter a valid phone number' });
        return;
      }

      const passwordValidation = validatePassword(authData.password);
      if (!passwordValidation.isValid) {
        resolve({ success: false, message: passwordValidation.message });
        return;
      }

      // Check if user already exists
      const existingUsers = getStoredUsers();
      const existingUser = existingUsers.find(user => user.email === authData.email);
      
      if (existingUser) {
        resolve({ success: false, message: 'An account with this email already exists' });
        return;
      }

      // Create new user
      const newUser: User = {
        id: generateUserId(),
        email: authData.email,
        name: authData.name.trim(),
        role: authData.role,
        phone: authData.phone,
        password: hashPassword(authData.password), // Store hashed password
        createdAt: new Date().toISOString()
      };

      // Save user
      existingUsers.push(newUser);
      localStorage.setItem('interview_users', JSON.stringify(existingUsers));

      resolve({ success: true, user: newUser });
    }, 1000);
  });
}

export function signIn(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      if (!validateEmail(email)) {
        resolve({ success: false, message: 'Please enter a valid email address' });
        return;
      }

      const users = getStoredUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        resolve({ success: false, message: 'No account found with this email address' });
        return;
      }

      if (user.password !== hashPassword(password)) {
        resolve({ success: false, message: 'Invalid password' });
        return;
      }

      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;
      resolve({ success: true, user: userWithoutPassword });
    }, 1000);
  });
}

export function getStoredUsers(): User[] {
  const stored = localStorage.getItem('interview_users');
  return stored ? JSON.parse(stored) : [];
}

export function signOut(): void {
  localStorage.removeItem('interview_current_user');
}
