import { useState, useEffect } from 'react';
import { User, Candidate, InterviewSession } from './types';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/interviewer/Dashboard';
import { InterviewFlow } from './components/interview/InterviewFlow';
import { loadUser, saveUser, loadCandidates, loadCurrentSession } from './utils/storage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted data on app start
    const savedUser = loadUser();
    const savedCandidates = loadCandidates();
    const savedSession = loadCurrentSession();

    setUser(savedUser);
    setCandidates(savedCandidates);
    setCurrentSession(savedSession);
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    saveUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    saveUser(null);
  };

  const updateCandidates = (newCandidates: Candidate[]) => {
    setCandidates(newCandidates);
  };

  const updateCurrentSession = (session: InterviewSession | null) => {
    setCurrentSession(session);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading InterviewAI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === 'interviewer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              <h1 className="text-xl font-bold text-gray-900">InterviewAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">Interviewer</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
        <Dashboard candidates={candidates} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <h1 className="text-xl font-bold text-gray-900">InterviewAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600">Candidate</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <InterviewFlow
        user={user}
        candidates={candidates}
        currentSession={currentSession}
        onUpdateCandidates={updateCandidates}
        onUpdateSession={updateCurrentSession}
      />
    </div>
  );
}

export default App;