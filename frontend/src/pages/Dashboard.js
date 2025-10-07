import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportsAPI, adminAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    recentReports: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch reports
      const reportsResponse = await reportsAPI.getAll();
      const reports = reportsResponse.data;

      // Calculate stats
      const totalReports = reports.length;
      const pendingReports = reports.filter(r => r.status === 'Pending').length;
      const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
      const recentReports = reports.slice(0, 5);

      setStats({
        totalReports,
        pendingReports,
        resolvedReports,
        recentReports,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pending',
      value: stats.pendingReports,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'This Month',
      value: stats.recentReports.length,
      icon: TrendingUp,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/10',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'In Progress':
        return 'text-blue-500 bg-blue-500/10';
      case 'Resolved':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Users className="h-5 w-5 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
          </div>
          <p className="text-dark-300">
            Here's what's happening with disaster reports today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="card-hover"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Reports List */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Reports</h2>
              <button onClick={() => navigate('/reports')} className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                View all
              </button>
            </div>
            
            <div className="space-y-4">
              {stats.recentReports.length > 0 ? (
                stats.recentReports.map((report, index) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate('/reports')}
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{report.title}</h3>
                      <p className="text-dark-400 text-xs mt-1 line-clamp-2">
                        {report.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-dark-500 text-xs flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        {report.location && (
                          <span className="text-dark-500 text-xs flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {report.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                  <p className="text-dark-400">No reports yet</p>
                  <p className="text-dark-500 text-sm">Create your first report to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 transition-colors duration-200 text-left"
                onClick={() => navigate('/reports', { state: { openForm: true } })}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-primary-500" />
                  <div>
                    <h3 className="text-white font-medium">Report New Incident</h3>
                    <p className="text-dark-400 text-sm">Create a new disaster report</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-dark-700 border border-dark-600 rounded-lg hover:bg-dark-600 transition-colors duration-200 text-left"
                onClick={() => navigate('/reports')}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-dark-400" />
                  <div>
                    <h3 className="text-white font-medium">View All Reports</h3>
                    <p className="text-dark-400 text-sm">Browse all disaster reports</p>
                  </div>
                </div>
              </motion.button>

              {isAdmin() && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-dark-700 border border-dark-600 rounded-lg hover:bg-dark-600 transition-colors duration-200 text-left"
                  onClick={() => navigate('/admin')}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-dark-400" />
                    <div>
                      <h3 className="text-white font-medium">Admin Panel</h3>
                      <p className="text-dark-400 text-sm">Manage users and reports</p>
                    </div>
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


