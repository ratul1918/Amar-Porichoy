import { Users, FileText, CheckCircle2, Clock, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down';
}

const statCards: StatCard[] = [
  {
    icon: <Users className="w-6 h-6" />,
    label: 'Total Citizens',
    value: '25,847',
    change: '+12.5%',
    changeType: 'up',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    label: 'Pending Applications',
    value: '342',
    change: '+5.2%',
    changeType: 'up',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    label: 'Approved Today',
    value: '156',
    change: '+8.1%',
    changeType: 'up',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    label: 'Active Sessions',
    value: '1,234',
    change: '+2.3%',
    changeType: 'up',
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in Porichoy today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-accent))]/10 rounded-lg text-[rgb(var(--color-primary))]">
                {stat.icon}
              </div>
              {stat.change && (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    stat.changeType === 'up'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { user: 'Mohammad Rahim', action: 'Submitted passport application', time: '2 hours ago', icon: FileText },
              { user: 'Fatima Begum', action: 'Identity verified', time: '5 hours ago', icon: CheckCircle2 },
              { user: 'Ahmed Hassan', action: 'Started police clearance', time: '1 day ago', icon: Clock },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
                <div className="p-2 bg-[rgb(var(--color-primary))]/10 rounded-lg text-[rgb(var(--color-primary))]">
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">API Health</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '98%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium text-green-600">Optimal</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '99.9%' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
      >
        <h3 className="font-semibold text-amber-900 mb-3">Pending Review</h3>
        <p className="text-sm text-amber-800">
          45 applications require manual review. Review pending applications in the <a href="/admin/applications" className="font-semibold hover:underline">Applications section</a>.
        </p>
      </motion.div>
    </div>
  );
}
