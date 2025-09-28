import { Question, Answer } from '../types';

const QUESTIONS_POOL: Question[] = [
  // Easy Questions
  {
    id: 'easy-1',
    text: 'What is the difference between let, const, and var in JavaScript?',
    difficulty: 'Easy',
    timeLimit: 20,
    category: 'JavaScript Basics'
  },
  {
    id: 'easy-2',
    text: 'Explain what JSX is and how it differs from regular HTML.',
    difficulty: 'Easy',
    timeLimit: 20,
    category: 'React Basics'
  },
  {
    id: 'easy-3',
    text: 'What is the purpose of the package.json file in a Node.js project?',
    difficulty: 'Easy',
    timeLimit: 20,
    category: 'Node.js Basics'
  },
  // Medium Questions
  {
    id: 'medium-1',
    text: 'Explain the React component lifecycle and the useEffect hook.',
    difficulty: 'Medium',
    timeLimit: 60,
    category: 'React Advanced'
  },
  {
    id: 'medium-2',
    text: 'How would you implement authentication middleware in Express.js?',
    difficulty: 'Medium',
    timeLimit: 60,
    category: 'Node.js Security'
  },
  {
    id: 'medium-3',
    text: 'What are closures in JavaScript and provide a practical example?',
    difficulty: 'Medium',
    timeLimit: 60,
    category: 'JavaScript Advanced'
  },
  // Hard Questions
  {
    id: 'hard-1',
    text: 'Design a real-time chat application architecture using WebSockets. Explain your approach to scaling and message persistence.',
    difficulty: 'Hard',
    timeLimit: 120,
    category: 'System Design'
  },
  {
    id: 'hard-2',
    text: 'Implement a custom React hook for managing complex state with optimistic updates and error handling.',
    difficulty: 'Hard',
    timeLimit: 120,
    category: 'React Expert'
  },
  {
    id: 'hard-3',
    text: 'Explain how you would optimize a Node.js application for high concurrency and memory efficiency.',
    difficulty: 'Hard',
    timeLimit: 120,
    category: 'Performance'
  }
];

export function generateQuestions(): Question[] {
  const easy = QUESTIONS_POOL.filter(q => q.difficulty === 'Easy').slice(0, 2);
  const medium = QUESTIONS_POOL.filter(q => q.difficulty === 'Medium').slice(0, 2);
  const hard = QUESTIONS_POOL.filter(q => q.difficulty === 'Hard').slice(0, 2);
  
  return [...easy, ...medium, ...hard];
}

export function simulateAIScoring(question: Question, answer: string, timeSpent: number): { score: number; feedback: string } {
  // Simulate AI scoring based on answer length, keywords, and time efficiency
  const answerLength = answer.trim().length;
  const timeEfficiency = timeSpent < question.timeLimit * 0.8 ? 1.2 : 1;
  
  let baseScore = 0;
  let feedback = '';
  
  if (answerLength < 50) {
    baseScore = Math.random() * 30 + 10; // 10-40
    feedback = 'Answer could be more detailed. Consider providing examples or deeper explanations.';
  } else if (answerLength < 150) {
    baseScore = Math.random() * 30 + 40; // 40-70
    feedback = 'Good foundation. Some aspects could be expanded with more technical depth.';
  } else {
    baseScore = Math.random() * 30 + 60; // 60-90
    feedback = 'Comprehensive answer demonstrating solid understanding of the concept.';
  }
  
  // Adjust for difficulty
  if (question.difficulty === 'Easy') {
    baseScore = Math.min(baseScore * 0.8, 85);
  } else if (question.difficulty === 'Hard') {
    baseScore = Math.min(baseScore * 1.3, 95);
  }
  
  // Apply time efficiency
  const finalScore = Math.round(Math.min(baseScore * timeEfficiency, 100));
  
  return {
    score: finalScore,
    feedback: `${feedback} Time efficiency: ${timeSpent < question.timeLimit * 0.5 ? 'Excellent' : timeSpent < question.timeLimit * 0.8 ? 'Good' : 'Adequate'}.`
  };
}

export function generateFinalSummary(answers: Answer[]): { score: number; summary: string } {
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const averageScore = totalScore / answers.length;
  
  let performanceLevel = '';
  let summary = '';
  
  if (averageScore >= 85) {
    performanceLevel = 'Exceptional';
    summary = 'Outstanding performance across all difficulty levels. Demonstrates deep technical knowledge and excellent problem-solving skills. Strong candidate for senior positions.';
  } else if (averageScore >= 70) {
    performanceLevel = 'Strong';
    summary = 'Solid technical foundation with good understanding of key concepts. Shows potential for growth and would be valuable to the team.';
  } else if (averageScore >= 55) {
    performanceLevel = 'Moderate';
    summary = 'Basic understanding of concepts with room for improvement. May benefit from additional training and mentorship.';
  } else {
    performanceLevel = 'Needs Development';
    summary = 'Limited technical knowledge demonstrated. Would require significant training and support to meet role requirements.';
  }
  
  return {
    score: Math.round(averageScore),
    summary: `${performanceLevel}: ${summary}`
  };
}