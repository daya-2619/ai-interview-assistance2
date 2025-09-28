import { Eye, Mail, Phone, Calendar, Award, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Candidate } from '../../types';
import { exportCandidatesToCSV } from '../../utils/csvExport';

interface CandidateListProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

export function CandidateList({ candidates, onSelectCandidate }: CandidateListProps) {
  const handleExportCSV = () => {
    exportCandidatesToCSV(candidates);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Award className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Candidates Yet</h3>
        <p className="text-gray-600">Candidates will appear here once they start taking interviews.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header with Export Button */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Candidates ({candidates.length})
        </h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
          title="Export all candidates to CSV"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.resume.fileName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Mail size={14} className="text-gray-400 mr-2" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center">
                      <Phone size={14} className="text-gray-400 mr-2" />
                      {candidate.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.status === 'completed' ? (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.finalScore)}`}>
                      {candidate.finalScore}/100
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={14} className="text-gray-400 mr-2" />
                    {formatDate(candidate.startedAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(candidate.currentQuestionIndex / candidate.questions.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-max">
                      {candidate.currentQuestionIndex}/{candidate.questions.length}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectCandidate(candidate)}
                  >
                    <Eye size={16} className="mr-1" />
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}