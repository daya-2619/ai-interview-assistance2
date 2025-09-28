import { useState, useEffect } from 'react';
import { User, Candidate, InterviewSession, Answer } from '../../types';
import { ResumeUpload } from './ResumeUpload';
import { MissingFields } from './MissingFields';
import { InterviewChat } from './InterviewChat';
import { InterviewComplete } from './InterviewComplete';
import { WelcomeBackModal } from '../common/WelcomeBackModal';
import { generateQuestions, generateFinalSummary } from '../../utils/mockAI';
import { ExtractedData } from '../../utils/resumeParser';
import { saveCandidates, saveCurrentSession } from '../../utils/storage';

interface InterviewFlowProps {
  user: User;
  candidates: Candidate[];
  currentSession: InterviewSession | null;
  onUpdateCandidates: (candidates: Candidate[]) => void;
  onUpdateSession: (session: InterviewSession | null) => void;
}

type FlowStep = 'upload' | 'fields' | 'welcome-back' | 'interview' | 'complete';

export function InterviewFlow({
  user,
  candidates,
  currentSession,
  onUpdateCandidates,
  onUpdateSession
}: InterviewFlowProps) {
  const [step, setStep] = useState<FlowStep>('upload');
  const [resumeData, setResumeData] = useState<{ fileName: string; extractedData: ExtractedData } | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check if there's an existing session to resume
    if (currentSession && currentSession.isActive) {
      const existingCandidate = candidates.find(c => c.id === currentSession.candidateId);
      if (existingCandidate && existingCandidate.status !== 'completed') {
        setCurrentCandidate(existingCandidate);
        setStep('welcome-back');
      }
    }
  }, [currentSession, candidates]);

  const handleResumeProcessed = (fileName: string, extractedData: ExtractedData) => {
    setResumeData({ fileName, extractedData });
    
    // Check if any fields are missing
    const hasAllFields = extractedData.name && extractedData.email && extractedData.phone;
    setStep(hasAllFields ? 'interview' : 'fields');
    
    if (hasAllFields) {
      startInterview({
        name: extractedData.name!,
        email: extractedData.email!,
        phone: extractedData.phone!
      });
    }
  };

  const handleFieldsComplete = (completeData: Required<ExtractedData>) => {
    startInterview(completeData);
  };

  const startInterview = (candidateData: Required<ExtractedData>) => {
    const candidate: Candidate = {
      id: `candidate_${Date.now()}`,
      name: user?.name || candidateData.name,
      email: user?.email || candidateData.email,
      phone: user?.phone || candidateData.phone,
      resume: {
        fileName: resumeData?.fileName || 'resume.pdf',
        fileType: resumeData?.fileName.endsWith('.docx') ? 'docx' : 'pdf',
        uploadDate: new Date().toISOString(),
        extractedData: candidateData
      },
      questions: generateQuestions(),
      answers: [],
      finalScore: 0,
      summary: '',
      status: 'in-progress',
      startedAt: new Date().toISOString(),
      currentQuestionIndex: 0
    };

    const updatedCandidates = [...candidates, candidate];
    onUpdateCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);

    const session: InterviewSession = {
      candidateId: candidate.id,
      currentQuestion: 0,
      startTime: new Date().toISOString(),
      isActive: true
    };
    onUpdateSession(session);
    saveCurrentSession(session);

    setCurrentCandidate(candidate);
    setStep('interview');
  };

  const handleAnswerSubmit = (answer: Answer) => {
    if (!currentCandidate) return;

    const updatedCandidate = {
      ...currentCandidate,
      answers: [...currentCandidate.answers, answer]
    };

    const updatedCandidates = candidates.map(c => 
      c.id === updatedCandidate.id ? updatedCandidate : c
    );

    onUpdateCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);
    setCurrentCandidate(updatedCandidate);
  };

  const handleQuestionChange = (questionIndex: number) => {
    if (!currentCandidate || !currentSession) return;

    const updatedCandidate = {
      ...currentCandidate,
      currentQuestionIndex: questionIndex
    };

    const updatedSession = {
      ...currentSession,
      currentQuestion: questionIndex
    };

    const updatedCandidates = candidates.map(c => 
      c.id === updatedCandidate.id ? updatedCandidate : c
    );

    onUpdateCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);
    onUpdateSession(updatedSession);
    saveCurrentSession(updatedSession);
    
    setCurrentCandidate(updatedCandidate);
  };

  const handleInterviewComplete = () => {
    if (!currentCandidate) return;

    const { score, summary } = generateFinalSummary(currentCandidate.answers);
    
    const completedCandidate = {
      ...currentCandidate,
      finalScore: score,
      summary,
      status: 'completed' as const,
      completedAt: new Date().toISOString()
    };

    const updatedCandidates = candidates.map(c => 
      c.id === completedCandidate.id ? completedCandidate : c
    );

    onUpdateCandidates(updatedCandidates);
    saveCandidates(updatedCandidates);
    
    // Clear current session
    onUpdateSession(null);
    saveCurrentSession(null);
    
    setCurrentCandidate(completedCandidate);
    setStep('complete');
  };

  const handlePauseToggle = () => {
    if (!currentSession) return;
    
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    const updatedSession = {
      ...currentSession,
      pausedAt: newPausedState ? new Date().toISOString() : undefined
    };
    
    onUpdateSession(updatedSession);
    saveCurrentSession(updatedSession);
  };

  const handleResumeInterview = () => {
    setStep('interview');
    setIsPaused(false);
  };

  const handleRestartInterview = () => {
    // Clear current session and start fresh
    onUpdateSession(null);
    saveCurrentSession(null);
    setCurrentCandidate(null);
    setStep('upload');
    setIsPaused(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return <ResumeUpload onResumeProcessed={handleResumeProcessed} />;
      
      case 'fields':
        return (
          <MissingFields
            extractedData={resumeData?.extractedData || {}}
            onComplete={handleFieldsComplete}
          />
        );
      
      case 'interview':
        return currentCandidate ? (
          <InterviewChat
            questions={currentCandidate.questions}
            onAnswerSubmit={handleAnswerSubmit}
            onInterviewComplete={handleInterviewComplete}
            currentQuestionIndex={currentCandidate.currentQuestionIndex}
            onQuestionChange={handleQuestionChange}
            isPaused={isPaused}
            onPauseToggle={handlePauseToggle}
          />
        ) : null;
      
      case 'complete':
        return currentCandidate ? (
          <InterviewComplete
            candidate={currentCandidate}
            onRestart={handleRestartInterview}
          />
        ) : null;
      
      default:
        return <ResumeUpload onResumeProcessed={handleResumeProcessed} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {renderStep()}
      </div>
      
      {step === 'welcome-back' && currentCandidate && (
        <WelcomeBackModal
          isOpen={true}
          candidate={currentCandidate}
          onResume={handleResumeInterview}
          onRestart={handleRestartInterview}
        />
      )}
    </div>
  );
}