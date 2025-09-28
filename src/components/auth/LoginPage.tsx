import { useState } from 'react';
import { User, Mail, UserCheck, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { getRandomQuote } from '../../utils/quotes';

interface LoginPageProps {
  onLogin: (user: { id: string; email: string; name: string; role: 'interviewer' | 'interviewee' }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'interviewer' | 'interviewee' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const quote = getRandomQuote();

  const handleGmailLogin = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Simulate Gmail OAuth flow
    setTimeout(() => {
      const mockUser = {
        id: `user_${Date.now()}`,
        email: selectedRole === 'interviewer' ? 'interviewer@company.com' : 'candidate@email.com',
        name: selectedRole === 'interviewer' ? 'HR Manager' : 'John Candidate',
        role: selectedRole,
        avatar: `https://ui-avatars.com/api/?name=${selectedRole === 'interviewer' ? 'HR Manager' : 'John Candidate'}&background=3b82f6&color=fff`
      };
      
      onLogin(mockUser);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 flex flex-col justify-center text-white">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <Briefcase size={32} />
              </div>
              <h1 className="text-4xl font-bold mb-2">InterviewAI</h1>
              <p className="text-xl text-blue-100">Smart Interview Assistant Platform</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <blockquote className="text-lg italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <cite className="text-blue-200">— {quote.author}</cite>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>AI-powered question generation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span>Real-time performance analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                <span>Seamless candidate experience</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Choose your role to continue</p>
            </div>
            
            {/* Role Selection */}
            <div className="space-y-4 mb-8">
              <div
                onClick={() => setSelectedRole('interviewee')}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedRole === 'interviewee'
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    selectedRole === 'interviewee' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">I&apos;m a Candidate</h3>
                    <p className="text-sm text-gray-600">Take the interview and showcase your skills</p>
                  </div>
                  {selectedRole === 'interviewee' && (
                    <UserCheck className="text-blue-500" size={20} />
                  )}
                </div>
              </div>
              
              <div
                onClick={() => setSelectedRole('interviewer')}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedRole === 'interviewer'
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    selectedRole === 'interviewer' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Briefcase size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">I&apos;m an Interviewer</h3>
                    <p className="text-sm text-gray-600">Review candidates and manage interviews</p>
                  </div>
                  {selectedRole === 'interviewer' && (
                    <UserCheck className="text-purple-500" size={20} />
                  )}
                </div>
              </div>
            </div>
            
            {/* Login Button */}
            <Button
              onClick={handleGmailLogin}
              disabled={!selectedRole}
              loading={isLoading}
              className="w-full mb-4"
              size="lg"
            >
              <Mail className="mr-2" size={20} />
              Continue with Gmail
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}