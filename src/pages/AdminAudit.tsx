import { useState } from 'react';
import { Clock, Search, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface AuditLog {
  id: string;
  eventType: 'login' | 'logout' | 'approval' | 'rejection' | 'verification' | 'error';
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string;
  status: 'success' | 'failure';
  timestamp: string;
  ipAddress: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD001',
    eventType: 'login',
    actor: 'admin',
    action: 'Admin login successful',
    resourceType: 'session',
    resourceId: 'sess-admin-001',
    status: 'success',
    timestamp: '2024-02-25 14:30:25',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'AUD002',
    eventType: 'verification',
    actor: 'Mohammad Rahim',
    action: 'Identity verified',
    resourceType: 'citizen',
    resourceId: 'citizen-001',
    status: 'success',
    timestamp: '2024-02-25 14:28:10',
    ipAddress: '203.0.113.45',
  },
  {
    id: 'AUD003',
    eventType: 'approval',
    actor: 'admin',
    action: 'Application approved',
    resourceType: 'application',
    resourceId: 'APP001',
    status: 'success',
    timestamp: '2024-02-25 14:15:30',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'AUD004',
    eventType: 'error',
    actor: 'system',
    action: 'Failed login attempt',
    resourceType: 'session',
    resourceId: 'sess-failed-001',
    status: 'failure',
    timestamp: '2024-02-25 14:10:15',
    ipAddress: '203.0.113.50',
  },
  {
    id: 'AUD005',
    eventType: 'rejection',
    actor: 'admin',
    action: 'Application rejected',
    resourceType: 'application',
    resourceId: 'APP005',
    status: 'success',
    timestamp: '2024-02-25 13:55:45',
    ipAddress: '192.168.1.100',
  },
];

const getEventIcon = (eventType: AuditLog['eventType']) => {
  switch (eventType) {
    case 'login':
      return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
    case 'logout':
      return <Clock className="w-5 h-5 text-gray-600" />;
    case 'approval':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'rejection':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case 'verification':
      return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Info className="w-5 h-5 text-gray-600" />;
  }
};

const getEventColor = (eventType: AuditLog['eventType']) => {
  switch (eventType) {
    case 'login':
      return 'bg-blue-50 border-blue-200';
    case 'logout':
      return 'bg-gray-50 border-gray-200';
    case 'approval':
      return 'bg-green-50 border-green-200';
    case 'rejection':
      return 'bg-red-50 border-red-200';
    case 'verification':
      return 'bg-purple-50 border-purple-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const getStatusBadge = (status: AuditLog['status']) => {
  return status === 'success'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';
};

export function AdminAudit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState<'all' | AuditLog['eventType']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failure'>('all');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceId.includes(searchTerm) ||
      log.ipAddress.includes(searchTerm);
    const matchesEventType = filterEventType === 'all' || log.eventType === filterEventType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesEventType && matchesStatus;
  });

  const eventTypes = [
    'login',
    'logout',
    'approval',
    'rejection',
    'verification',
    'error',
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-8 h-8 text-[rgb(var(--color-primary))]" />
          Audit Logs
        </h1>
        <p className="text-gray-600 mt-2">System activity and user actions</p>
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
              placeholder="Search by action, actor, resource, or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Event Type Filter */}
          <select
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value as any)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          >
            <option value="all">All Event Types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>
      </motion.div>

      {/* Logs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`border rounded-xl p-4 transition hover:shadow-md ${getEventColor(log.eventType)}`}
          >
            <div className="flex items-start gap-4">
              <div className="pt-1">{getEventIcon(log.eventType)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{log.action}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(log.status)}`}>
                      {log.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                    <span className="text-xs text-gray-600">{log.timestamp}</span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Actor:</span> {log.actor}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {log.resourceType}
                  </div>
                  <div>
                    <span className="font-medium">Resource:</span> {log.resourceId}
                  </div>
                  <div>
                    <span className="font-medium">IP:</span> {log.ipAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {filteredLogs.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No audit logs found matching your filters</p>
        </div>
      )}
    </div>
  );
}
