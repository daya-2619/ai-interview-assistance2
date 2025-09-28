import { Clock } from 'lucide-react';

interface TimerProps {
  time: number;
  totalTime: number;
  isRunning: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export function Timer({ time, totalTime, isRunning, difficulty }: TimerProps) {
  const percentage = ((totalTime - time) / totalTime) * 100;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy': return 'from-green-400 to-green-600';
      case 'Medium': return 'from-yellow-400 to-yellow-600';
      case 'Hard': return 'from-red-400 to-red-600';
    }
  };
  
  const getRingColor = () => {
    if (time <= 10) return 'text-red-500';
    if (time <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center space-x-4 bg-white rounded-lg p-4 shadow-md">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className={getRingColor()}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock size={20} className={getRingColor()} />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor()} text-white`}>
            {difficulty}
          </span>
          <span className={`text-2xl font-bold ${getRingColor()}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${getDifficultyColor()} transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          {isRunning ? 'Time remaining' : 'Timer paused'}
        </p>
      </div>
    </div>
  );
}