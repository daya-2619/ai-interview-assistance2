import { ArrowLeft, Download, Mail, Phone, Calendar, Clock, Award, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Candidate } from '../../types';

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

export function CandidateDetail({ candidate, onBack }: CandidateDetailProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTimeSpent = candidate.answers.reduce((sum, answer) => sum + (answer?.timeSpent || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Button>
        
        <Button variant="secondary">
          <Download size={20} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Candidate Info Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail size={14} className="mr-2" />
                  {candidate.email}
                </div>
                <div className="flex items-center">
                  <Phone size={14} className="mr-2" />
                  {candidate.phone}
                </div>
              </div>
            </div>
          </div>
          
          {candidate.status === 'completed' && (
            <div className={`bg-gradient-to-r ${getScoreBg(candidate.finalScore)} rounded-lg p-4 text-white text-center`}>
              <Award className="mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold">{candidate.finalScore}</div>
              <div className="text-sm opacity-90">Final Score</div>
            </div>
          )}
        </div>
      </div>

      {/* Interview Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Started</h3>
              <p className="text-sm text-gray-600">{formatDate(candidate.startedAt)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <Clock className="text-green-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Total Time</h3>
              <p className="text-sm text-gray-600">{formatDuration(totalTimeSpent)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3">
            <FileText className="text-purple-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Resume</h3>
              <p className="text-sm text-gray-600">{candidate.resume.fileName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {candidate.status === 'completed' && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Performance Summary</h3>
          <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
        </div>
      )}

      {/* Questions and Answers */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Interview Questions & Answers</h3>
        
        <div className="space-y-8">
          {candidate.questions.map((question, index) => {
            const answer = candidate.answers[index];
            const isAnswered = answer !== undefined;
            
            return (
              <div key={question.id} className="border-l-4 border-gray-200 pl-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">
                        Time Limit: {formatDuration(question.timeLimit)}
                      </span>
                    </div>
                    {isAnswered && (
                      <span className={`text-lg font-bold ${getScoreColor(answer.score)}`}>
                        {answer.score}/100
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-medium text-gray-900 mb-2">{question.category}</p>
                    <p className="text-gray-700">{question.text}</p>
                  </div>
                  
                  {isAnswered ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">Candidate&apos;s Answer</span>
                          <span className="text-xs text-gray-600">
                            Time Spent: {formatDuration(answer.timeSpent || 0)}
                          </span>
                        </div>
                        <p className="text-gray-800">{answer.text || 'No answer provided'}</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Award className="text-yellow-600 mr-2" size={16} />
                          <span className="text-sm font-medium text-yellow-900">AI Feedback</span>
                        </div>
                        <p className="text-gray-800 text-sm">{answer.feedback || 'No feedback available'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-gray-600 italic">Not answered yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}