import { useState } from 'react';
import { FileText, Search, CheckCircle2, Clock, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface Application {
  id: string;
  citizenName: string;
  service: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  nid: string;
  submittedDate: string;
  lastUpdated: string;
  notes?: string;
}

const mockApplications: Application[] = [
  {
    id: 'APP001',
    citizenName: 'Mohammad Rahim Uddin',
    service: 'Passport Renewal',
    status: 'reviewing',
    nid: '1234567890',
    submittedDate: '2024-02-20',
    lastUpdated: '2024-02-25',
    notes: 'Documents verified, awaiting final approval',
  },
  {
    id: 'APP002',
    citizenName: 'Fatima Begum Khan',
    service: 'Police Clearance',
    status: 'approved',
    nid: '0987654321',
    submittedDate: '2024-02-18',
    lastUpdated: '2024-02-23',
  },
  {
    id: 'APP003',
    citizenName: 'Ahmed Hassan',
    service: 'Going Abroad Permit',
    status: 'pending',
    nid: '5555555555',
    submittedDate: '2024-02-21',
    lastUpdated: '2024-02-21',
  },
  {
    id: 'APP004',
    citizenName: 'Sumaiya Rahman',
    service: 'Hajj Application',
    status: 'approved',
    nid: '3333333333',
    submittedDate: '2024-02-15',
    lastUpdated: '2024-02-22',
  },
  {
    id: 'APP005',
    citizenName: 'Hassan Ali',
    service: 'Passport Renewal',
    status: 'rejected',
    nid: '4444444444',
    submittedDate: '2024-02-19',
    lastUpdated: '2024-02-24',
    notes: 'Missing required documents',
  },
];

const getStatusIcon = (status: Application['status']) => {
  switch (status) {
    case 'approved':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'reviewing':
      return <Clock className="w-5 h-5 text-blue-600" />;
    case 'rejected':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Clock className="w-5 h-5 text-amber-600" />;
  }
};

const getStatusBadgeStyle = (status: Application['status']) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    reviewing: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return styles[status];
};

export function AdminApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.includes(searchTerm) ||
      app.nid.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter(a => a.status === 'pending').length,
    reviewing: mockApplications.filter(a => a.status === 'reviewing').length,
    approved: mockApplications.filter(a => a.status === 'approved').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-[rgb(var(--color-primary))]" />
          Applications Management
        </h1>
        <p className="text-gray-600 mt-2">Review and approve citizen service applications</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by citizen name, NID, or app ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'blue' },
            { label: 'Pending', value: stats.pending, color: 'amber' },
            { label: 'Reviewing', value: stats.reviewing, color: 'blue' },
            { label: 'Approved', value: stats.approved, color: 'green' },
            { label: 'Rejected', value: stats.rejected, color: 'red' },
          ].map((stat) => (
            <div key={stat.label} className={`p-3 bg-${stat.color}-50 rounded-lg text-center`}>
              <p className={`text-xs text-${stat.color}-600 font-medium`}>{stat.label}</p>
              <p className={`text-lg font-bold text-${stat.color}-900`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">App ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Citizen</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Updated</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <code className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-900">
                      {app.id}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.citizenName}</p>
                      <p className="text-xs text-gray-600">NID: {app.nid}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{app.service}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadgeStyle(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.submittedDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.lastUpdated}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="p-2 text-[rgb(var(--color-primary))] hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No applications found matching your filters</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedApp(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Application Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-600">Application ID</p>
                <p className="font-medium text-gray-900">{selectedApp.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Citizen Name</p>
                <p className="font-medium text-gray-900">{selectedApp.citizenName}</p>
              </div>
              <div>
                <p className="text-gray-600">Service</p>
                <p className="font-medium text-gray-900">{selectedApp.service}</p>
              </div>
              <div>
                <p className="text-gray-600">NID</p>
                <p className="font-medium text-gray-900">{selectedApp.nid}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={`font-medium inline-block px-3 py-1 rounded-full ${getStatusBadgeStyle(selectedApp.status)}`}>
                  {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                </p>
              </div>
              {selectedApp.notes && (
                <div>
                  <p className="text-gray-600">Notes</p>
                  <p className="font-medium text-gray-900">{selectedApp.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium">
                Approve
              </button>
              <button className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium">
                Reject
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
