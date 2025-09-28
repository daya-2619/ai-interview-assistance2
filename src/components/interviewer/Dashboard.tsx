import { useState } from 'react';
import { Search, Filter, Users, TrendingUp, Clock, Award, Download } from 'lucide-react';
import { Candidate } from '../../types';
import { CandidateList } from './CandidateList';
import { CandidateDetail } from './CandidateDetail';
import { getRandomQuote } from '../../utils/quotes';
import { exportCandidatesToCSV } from '../../utils/csvExport';

interface DashboardProps {
  candidates: Candidate[];
}

export function Dashboard({ candidates }: DashboardProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');

  const quote = getRandomQuote();

  const handleExportCSV = () => {
    exportCandidatesToCSV(filteredCandidates);
  };

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.finalScore - a.finalScore;
        case 'date':
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const stats = {
    total: candidates.length,
    completed: candidates.filter(c => c.status === 'completed').length,
    inProgress: candidates.filter(c => c.status === 'in-progress').length,
    averageScore: candidates.filter(c => c.status === 'completed').length > 0 
      ? Math.round(candidates.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.finalScore, 0) / candidates.filter(c => c.status === 'completed').length)
      : 0
  };

  if (selectedCandidate) {
    return (
      <CandidateDetail
        candidate={selectedCandidate}
        onBack={() => setSelectedCandidate(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Dashboard</h1>
            <p className="text-gray-600">Manage and review candidate interviews</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 max-w-md">
            <p className="text-sm italic text-gray-700">&ldquo;{quote.text}&rdquo;</p>
            <p className="text-xs text-gray-600 mt-1">— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Users className="text-blue-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Total Candidates</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Award className="text-green-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Completed</h3>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <Clock className="text-yellow-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">In Progress</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-purple-500" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Avg. Score</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.averageScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'in-progress' | 'pending')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'name' | 'date')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              title="Export candidates to CSV"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <CandidateList
        candidates={filteredCandidates}
        onSelectCandidate={setSelectedCandidate}
      />
    </div>
  );
}