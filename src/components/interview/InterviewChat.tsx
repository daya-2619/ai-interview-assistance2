import { useState, useEffect, useRef } from 'react';
import { Send, Pause, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Timer } from '../ui/Timer';
import { useTimer } from '../../hooks/useTimer';
import { Question, Answer } from '../../types';
import { simulateAIScoring } from '../../utils/mockAI';
import { getRandomQuote } from '../../utils/quotes';

interface InterviewChatProps {
  questions: Question[];
  onAnswerSubmit: (answer: Answer) => void;
  onInterviewComplete: () => void;
  currentQuestionIndex: number;
  onQuestionChange: (index: number) => void;
  isPaused: boolean;
  onPauseToggle: () => void;
}

export function InterviewChat({
  questions,
  onAnswerSubmit,
  onInterviewComplete,
  currentQuestionIndex,
  onQuestionChange,
  isPaused,
  onPauseToggle
}: InterviewChatProps) {
  const [answer, setAnswer] = useState('');
  const [submittedAnswers, setSubmittedAnswers] = useState<Answer[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentQuestion = questions[currentQuestionIndex];
  const startTime = useRef(Date.now());

  const {
    time,
    isRunning,
    start,
    pause,
    resume,
    reset
  } = useTimer(currentQuestion?.timeLimit || 0, handleTimeUp);

  useEffect(() => {
    if (currentQuestion && !isPaused) {
      startTime.current = Date.now();
      reset(currentQuestion.timeLimit);
      start();
    }
  }, [currentQuestionIndex, currentQuestion, isPaused, reset, start]);

  useEffect(() => {
    if (isPaused) {
      pause();
    } else if (!isPaused && time > 0) {
      resume();
    }
  }, [isPaused, pause, resume, time]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [submittedAnswers, currentQuestionIndex]);

  function handleTimeUp() {
    submitAnswer(true);
  }

  const submitAnswer = (timeUp = false) => {
    if (!currentQuestion) return;
    
    const timeSpent = currentQuestion.timeLimit - time;
    const { score, feedback } = simulateAIScoring(currentQuestion, answer, timeSpent);
    
    const answerObj: Answer = {
      questionId: currentQuestion.id,
      text: answer || (timeUp ? "Time's up - No answer provided" : ''),
      timeSpent,
      score,
      feedback,
      submittedAt: new Date().toISOString()
    };

    setSubmittedAnswers(prev => [...prev, answerObj]);
    onAnswerSubmit(answerObj);
    setAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        onQuestionChange(currentQuestionIndex + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        onInterviewComplete();
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      if (answer.trim() && isRunning) {
        submitAnswer();
      }
    }
  };

  if (!currentQuestion) {
    return <div>Loading questions...</div>;
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const quote = getRandomQuote();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className="text-sm text-gray-600">{currentQuestion.category}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onPauseToggle}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <Timer
          time={time}
          totalTime={currentQuestion.timeLimit}
          isRunning={isRunning && !isPaused}
          difficulty={currentQuestion.difficulty}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm italic text-gray-700">&ldquo;{quote.text}&rdquo;</p>
            <p className="text-xs text-gray-600 mt-1">— {quote.author}</p>
          </div>

          {/* Previous Q&As */}
          {submittedAnswers.map((ans) => {
            const question = questions.find(q => q.id === ans.questionId);
            return (
              <div key={ans.questionId} className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-gray-500">AI INTERVIEWER</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      question?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question?.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-900">{question?.text}</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 ml-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600">YOUR ANSWER</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-600">
                        Time: {Math.floor(ans.timeSpent / 60)}:{String(ans.timeSpent % 60).padStart(2, '0')}
                      </span>
                      <span className={`text-xs font-medium ${
                        ans.score >= 80 ? 'text-green-600' :
                        ans.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Score: {ans.score}/100
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-2">{ans.text}</p>
                  <p className="text-xs text-gray-600 bg-white rounded p-2">{ans.feedback}</p>
                </div>
              </div>
            );
          })}

          {/* Current Question */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs font-medium text-gray-500">AI INTERVIEWER</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <p className="text-gray-900 text-lg leading-relaxed">{currentQuestion.text}</p>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isPaused ? "Interview is paused..." : "Type your answer here... (Ctrl+Enter to submit)"}
              disabled={!isRunning || isPaused || time === 0}
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => submitAnswer()}
              disabled={!answer.trim() || !isRunning || isPaused}
              size="lg"
              className="h-24 px-8"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Press Ctrl+Enter to submit quickly</span>
          <span>{answer.length} characters</span>
        </div>
      </div>
    </div>
  );
}