import { Candidate } from '../types';

export interface CSVExportData {
  candidate: string;
  contact: string;
  status: string;
  score: string;
  date: string;
  progress: string;
  actions: string;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getProgressPercentage(candidate: Candidate): string {
  const totalQuestions = candidate.questions.length;
  const answeredQuestions = candidate.answers.length;
  const percentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  return `${percentage}% (${answeredQuestions}/${totalQuestions})`;
}

export function getStatusDisplay(status: string): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'paused': return 'Paused';
    default: return status;
  }
}

export function getScoreDisplay(candidate: Candidate): string {
  if (candidate.status === 'completed') {
    return `${candidate.finalScore}/100`;
  } else if (candidate.answers.length > 0) {
    const averageScore = candidate.answers.reduce((sum, answer) => sum + (answer?.score || 0), 0) / candidate.answers.length;
    return `${Math.round(averageScore)}/100 (partial)`;
  }
  return 'Not started';
}

export function getContactInfo(candidate: Candidate): string {
  const parts = [];
  if (candidate.email) parts.push(candidate.email);
  if (candidate.phone) parts.push(candidate.phone);
  return parts.join(' | ');
}

export function candidatesToCSVData(candidates: Candidate[]): CSVExportData[] {
  return candidates.map(candidate => ({
    candidate: candidate.name,
    contact: getContactInfo(candidate),
    status: getStatusDisplay(candidate.status),
    score: getScoreDisplay(candidate),
    date: formatDate(candidate.startedAt),
    progress: getProgressPercentage(candidate),
    actions: candidate.status === 'completed' ? 'View Results' : 
             candidate.status === 'in-progress' ? 'Continue Interview' : 
             candidate.status === 'paused' ? 'Resume Interview' : 'Start Interview'
  }));
}

export function downloadCSV(data: CSVExportData[], filename: string = 'candidates.csv'): void {
  // Create CSV content
  const headers = ['Candidate', 'Contact', 'Status', 'Score', 'Date', 'Progress', 'Actions'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.candidate}"`,
      `"${row.contact}"`,
      `"${row.status}"`,
      `"${row.score}"`,
      `"${row.date}"`,
      `"${row.progress}"`,
      `"${row.actions}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportCandidatesToCSV(candidates: Candidate[]): void {
  const csvData = candidatesToCSVData(candidates);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `interviewai-candidates-${timestamp}.csv`;
  downloadCSV(csvData, filename);
  
  // Show success message
  console.log(`✅ CSV exported successfully: ${filename} (${candidates.length} candidates)`);
}
