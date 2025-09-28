import { Trophy, Star, Clock, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { Candidate } from '../../types';
import { getRandomQuote } from '../../utils/quotes';

interface InterviewCompleteProps {
  candidate: Candidate;
  onRestart: () => void;
}

export function InterviewComplete({ candidate, onRestart }: InterviewCompleteProps) {
  const quote = getRandomQuote();
  const averageTime = candidate.answers.length > 0 
    ? candidate.answers.reduce((sum, ans) => sum + (ans?.timeSpent || 0), 0) / candidate.answers.length 
    : 0;
  
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Trophy className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
        <p className="text-lg text-gray-600">Great job, {candidate.name}! Here&apos;s your performance summary.</p>
      </div>

      {/* Score Card */}
      <div className={`bg-gradient-to-r ${getScoreBg(candidate.finalScore)} rounded-lg p-8 text-white mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Final Score</h2>
            <p className="text-white text-opacity-90">Based on all 6 questions</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{candidate.finalScore}</div>
            <div className="text-xl opacity-90">/100</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Clock className="text-blue-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Average Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {Math.floor(averageTime / 60)}:{String(averageTime % 60).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Target className="text-green-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Questions Answered</h3>
              <p className="text-2xl font-bold text-green-600">{candidate.answers.length}/6</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Star className="text-yellow-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Best Score</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {Math.max(...candidate.answers.map(a => a.score))}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Question Breakdown</h3>
        <div className="space-y-4">
          {candidate.questions.map((question, index) => {
            const answer = candidate.answers[index];
            const hasAnswer = answer && answer.score !== undefined;
            
            return (
              <div key={question.id} className="border-l-4 border-gray-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="font-medium text-gray-900">{question.category}</span>
                  </div>
                  <span className={`text-lg font-bold ${hasAnswer ? getScoreColor(answer.score) : 'text-gray-400'}`}>
                    {hasAnswer ? `${answer.score}/100` : 'Not answered'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{question.text}</p>
                <p className="text-xs text-gray-500">
                  {hasAnswer ? (answer.feedback || 'No feedback available') : 'Waiting for answer...'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Performance Summary</h3>
        <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
      </div>

      {/* Motivational Quote */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
        <blockquote className="text-center">
          <p className="text-lg italic text-gray-700 mb-4">&ldquo;{quote.text}&rdquo;</p>
          <cite className="text-gray-500">— {quote.author}</cite>
        </blockquote>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button onClick={onRestart} size="lg">
          Take Another Interview
        </Button>
      </div>
    </div>
  );
}