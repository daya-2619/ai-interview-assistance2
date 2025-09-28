import { useState, useEffect, useRef } from 'react';

export function useTimer(initialTime: number, onComplete?: () => void) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, time, onComplete]);

  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const stop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(initialTime);
  };

  const reset = (newTime?: number) => {
    setTime(newTime ?? initialTime);
    setIsRunning(false);
    setIsPaused(false);
  };

  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset
  };
}