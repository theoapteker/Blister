'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Building2,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

interface BuddyMatch {
  id: string;
  employeeId: string;
  buddyId: string;
  status: 'pending' | 'active' | 'completed';
  matchedAt: Date;
  employee: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    title: string | null;
    department: string | null;
    startDate: Date | null;
  };
  buddy: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    title: string | null;
    department: string | null;
    startDate: Date | null;
  };
}

interface Stats {
  total: number;
  active: number;
  pending: number;
  completed: number;
}

export default function AdminBuddiesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<BuddyMatch[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchBuddyMatches();
  }, []);

  const fetchBuddyMatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/buddy-matches');
      if (!response.ok) throw new Error('Failed to fetch buddy matches');
      const data = await response.json();
      setMatches(data.matches);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching buddy matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = filter === 'all'
    ? matches
    : matches.filter(m => m.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'completed':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8" />
                Buddy Match Management
              </h1>
              <p className="text-gray-300 mt-1">View and manage all buddy matches in your organization</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer transition-all ${
              filter === 'all' ? 'ring-2 ring-purple-400' : ''
            }`}
            onClick={() => setFilter('all')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Total Matches</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer transition-all ${
              filter === 'active' ? 'ring-2 ring-green-400' : ''
            }`}
            onClick={() => setFilter('active')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.active}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer transition-all ${
              filter === 'pending' ? 'ring-2 ring-yellow-400' : ''
            }`}
            onClick={() => setFilter('pending')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer transition-all ${
              filter === 'completed' ? 'ring-2 ring-gray-400' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.completed}</p>
              </div>
              <XCircle className="w-12 h-12 text-gray-400" />
            </div>
          </motion.div>
        </div>

        {/* Matches List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {filter === 'all' ? 'All Matches' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Matches`}
              <span className="text-gray-400 ml-2">({filteredMatches.length})</span>
            </h2>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">No matches found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6 flex-1">
                      {/* Employee */}
                      <div className="flex items-start gap-4 flex-1">
                        {match.employee.avatar ? (
                          <img
                            src={match.employee.avatar}
                            alt={match.employee.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {match.employee.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{match.employee.name}</h3>
                          <p className="text-sm text-gray-400">{match.employee.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            {match.employee.title && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {match.employee.title}
                              </span>
                            )}
                            {match.employee.department && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {match.employee.department}
                              </span>
                            )}
                            {match.employee.startDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(match.employee.startDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center px-4">
                        <div className="text-2xl text-gray-400">→</div>
                      </div>

                      {/* Buddy */}
                      <div className="flex items-start gap-4 flex-1">
                        {match.buddy.avatar ? (
                          <img
                            src={match.buddy.avatar}
                            alt={match.buddy.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            {match.buddy.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{match.buddy.name}</h3>
                          <p className="text-sm text-gray-400">{match.buddy.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            {match.buddy.title && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {match.buddy.title}
                              </span>
                            )}
                            {match.buddy.department && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {match.buddy.department}
                              </span>
                            )}
                            {match.buddy.startDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(match.buddy.startDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(match.status)}`}>
                        {getStatusIcon(match.status)}
                        <span className="text-sm font-medium capitalize">{match.status}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(match.matchedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
