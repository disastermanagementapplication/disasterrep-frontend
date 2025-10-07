import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../services/api';
import ReportForm from '../components/reports/ReportForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const statusOptions = ['All', 'Pending', 'In Progress', 'Resolved'];
  const categoryOptions = ['All', 'Fire', 'Flood', 'Earthquake', 'Storm', 'Accident', 'Medical Emergency', 'Other'];

  useEffect(() => {
    fetchReports();
  }, []);

  // Open form automatically if navigated with state { openForm: true }
  useEffect(() => {
    if (location.state?.openForm) {
      setIsFormOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, categoryFilter]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await reportsAPI.getAll();
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(report => report.category === categoryFilter);
    }

    setFilteredReports(filtered);
  };

  const handleCreateReport = async (reportData) => {
    try {
      const response = await reportsAPI.create(reportData);
      setReports([response.data.report, ...reports]);
      setIsFormOpen(false);
      toast.success('Report created successfully');
    } catch (error) {
      toast.error('Failed to create report');
      console.error('Error creating report:', error);
    }
  };

  const handleUpdateReport = async (reportData) => {
    try {
      const response = await reportsAPI.update(editingReport._id, reportData);
      setReports(reports.map(r => r._id === editingReport._id ? response.data.report : r));
      setEditingReport(null);
      toast.success('Report updated successfully');
    } catch (error) {
      toast.error('Failed to update report');
      console.error('Error updating report:', error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await reportsAPI.delete(reportId);
      setReports(reports.filter(r => r._id !== reportId));
      toast.success('Report deleted successfully');
    } catch (error) {
      toast.error('Failed to delete report');
      console.error('Error deleting report:', error);
    }
  };

  const openEditForm = (report) => {
    setEditingReport(report);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingReport(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'In Progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Disaster Reports</h1>
              <p className="text-dark-300">
                Manage and track disaster incident reports
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Report</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-dark-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCategoryFilter('All');
              }}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </motion.div>

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card-hover"
              >
                {/* Report Image */}
                {report.mediaUrl && (
                  <div className="mb-4">
                    <img
                      src={report.mediaUrl}
                      alt={report.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Report Content */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {report.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span>{report.status}</span>
                    </span>
                  </div>

                  <p className="text-dark-300 text-sm line-clamp-3">
                    {report.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-dark-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    {report.location && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {report.location}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-500 font-medium">
                      {report.category}
                    </span>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditForm(report)}
                        className="p-2 text-dark-400 hover:text-primary-500 hover:bg-dark-700 rounded-lg transition-colors duration-200"
                        title="Edit report"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="p-2 text-dark-400 hover:text-red-500 hover:bg-dark-700 rounded-lg transition-colors duration-200"
                        title="Delete report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <AlertTriangle className="h-12 w-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-400 mb-2">No reports found</h3>
              <p className="text-dark-500">
                {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All'
                  ? 'Try adjusting your filters'
                  : 'Create your first report to get started'
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Report Form Modal */}
      <ReportForm
        isOpen={isFormOpen || !!editingReport}
        onClose={closeForm}
        onSubmit={editingReport ? handleUpdateReport : handleCreateReport}
        initialData={editingReport}
        isEditing={!!editingReport}
      />
    </div>
  );
};

export default Reports;


