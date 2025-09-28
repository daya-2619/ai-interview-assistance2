import { Play, RotateCcw, Clock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Candidate } from '../../types';
import { getRandomQuote } from '../../utils/quotes';

interface WelcomeBackModalProps {
  isOpen: boolean;
  candidate: Candidate;
  onResume: () => void;
  onRestart: () => void;
}

export function WelcomeBackModal({ isOpen, candidate, onResume, onRestart }: WelcomeBackModalProps) {
  const quote = getRandomQuote();
  const progress = ((candidate.currentQuestionIndex) / candidate.questions.length) * 100;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Welcome Back!"
      size="lg"
    >
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Clock className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome back, {candidate.name}!
          </h3>
          <p className="text-gray-600">
            We found your previous interview session. You can continue where you left off or start fresh.
          </p>
        </div>

        {/* Progress Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-gray-900">Progress</h4>
              <p className="text-2xl font-bold text-blue-600">
                {candidate.currentQuestionIndex}/{candidate.questions.length}
              </p>
              <p className="text-sm text-gray-600">Questions completed</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Current Score</h4>
              <p className="text-2xl font-bold text-green-600">
                {candidate.answers.length > 0 
                  ? Math.round(candidate.answers.reduce((sum, ans) => sum + ans.score, 0) / candidate.answers.length)
                  : 0}/100
              </p>
              <p className="text-sm text-gray-600">Average so far</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% complete</p>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-sm italic text-gray-700">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-xs text-gray-600 mt-1">— {quote.author}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={onResume}
            className="flex-1"
            size="lg"
          >
            <Play size={20} className="mr-2" />
            Continue Interview
          </Button>
          
          <Button
            onClick={onRestart}
            variant="secondary"
            className="flex-1"
            size="lg"
          >
            <RotateCcw size={20} className="mr-2" />
            Start Over
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Your progress is automatically saved. You can always come back later to continue.
        </p>
      </div>
    </Modal>
  );
}