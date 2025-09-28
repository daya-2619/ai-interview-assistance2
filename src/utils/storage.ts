import { Candidate, InterviewSession, User } from '../types';

const STORAGE_KEYS = {
  CANDIDATES: 'interview_candidates',
  CURRENT_SESSION: 'interview_session',
  USER: 'interview_current_user',
  USERS: 'interview_users'
} as const;

export function saveCandidates(candidates: Candidate[]): void {
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
}

export function loadCandidates(): Candidate[] {
  const stored = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
  return stored ? JSON.parse(stored) : [];
}

export function saveCurrentSession(session: InterviewSession | null): void {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
}

export function loadCurrentSession(): InterviewSession | null {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  return stored ? JSON.parse(stored) : null;
}

export function saveUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function loadUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}