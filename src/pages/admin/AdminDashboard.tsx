import {
  Users, FileText, CheckCircle2, Clock, TrendingUp, AlertCircle, Shield, Zap,
  Activity, Eye, ArrowUp, ArrowDown, Bell, Calendar, MapPin, BarChart3,
  Percent, DollarSign, UserCheck, AlertTriangle, XCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectId } from '../../utils/supabase/info';

export function AdminDashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Use mock data for demo mode
      setStats({
        totalCitizens: 1250 + liveCount,
        verifiedCitizens: 980,
        totalApplications: 3420,
        applicationsThisMonth: 145,
        activeServices: 62,
        applicationsByStatus: {
          pending: 45,
          processing: 78,
          approved: 3200,
          rejected: 97
        },
        activeUsers: 342,
        systemHealth: 98.5,
        processingTime: 2.3,
        rejectionRate: 2.8
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setLoading(false);
    }
  };

  // Chart data
  const userGrowthData = [
    { month: 'Jan', users: 850 },
    { month: 'Feb', users: 920 },
    { month: 'Mar', users: 1050 },
    { month: 'Apr', users: 1150 },
    { month: 'May', users: 1200 },
    { month: 'Jun', users: 1250 }
  ];

  const serviceUsageData = [
    { service: 'e-Passport', count: 450 },
    { service: 'NID', count: 380 },
    { service: 'Birth Cert', count: 320 },
    { service: 'Tax Cert', count: 280 },
    { service: 'Driving License', count: 220 },
    { service: 'Others', count: 350 }
  ];

  const applicationStatusData = [
    { name: 'Approved', value: 3200, color: '#10b981' },
    { name: 'Processing', value: 78, color: '#3b82f6' },
    { name: 'Pending', value: 45, color: '#f59e0b' },
    { name: 'Rejected', value: 97, color: '#ef4444' }
  ];

  const activityData = [
    { time: '00:00', activity: 45 },
    { time: '04:00', activity: 28 },
    { time: '08:00', activity: 156 },
    { time: '12:00', activity: 234 },
    { time: '16:00', activity: 189 },
    { time: '20:00', activity: 98 }
  ];

  const regionalData = [
    { region: 'Dhaka', applications: 1200 },
    { region: 'Chittagong', applications: 850 },
    { region: 'Sylhet', applications: 420 },
    { region: 'Rajshahi', applications: 380 },
    { region: 'Khulna', applications: 320 },
    { region: 'Barisal', applications: 250 }
  ];

  const recentAlerts = [
    { type: 'warning', message: '45 applications pending review', time: '2 min ago' },
    { type: 'info', message: 'System backup completed', time: '15 min ago' },
    { type: 'error', message: 'Suspicious login attempt detected', time: '1 hour ago' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      value: stats.totalCitizens,
      titleBn: 'মোট নাগরিক',
      titleEn: 'Total Citizens',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/admin/citizens'
    },
    {
      icon: CheckCircle2,
      value: stats.verifiedCitizens,
      titleBn: 'যাচাইকৃত নাগরিক',
      titleEn: 'Verified Citizens',
      gradient: 'from-green-500 to-emerald-500',
      link: '/admin/citizens'
    },
    {
      icon: FileText,
      value: stats.totalApplications,
      titleBn: 'মোট আবেদন',
      titleEn: 'Total Applications',
      gradient: 'from-purple-500 to-pink-500',
      link: '/admin/applications'
    },
    {
      icon: Activity,
      value: stats.activeUsers,
      titleBn: 'সক্রিয় ব্যবহারকারী',
      titleEn: 'Active Users',
      gradient: 'from-orange-500 to-red-500',
      link: '/admin/analytics'
    }
  ];

  const applicationStatusCards = [
    {
      icon: Clock,
      value: stats.applicationsByStatus.pending,
      titleBn: 'অপেক্ষমাণ',
      titleEn: 'Pending',
      color: 'from-yellow-500 to-orange-500',
      link: '/admin/applications?status=pending'
    },
    {
      icon: TrendingUp,
      value: stats.applicationsByStatus.processing,
      titleBn: 'প্রক্রিয়াধীন',
      titleEn: 'Processing',
      color: 'from-blue-500 to-indigo-500',
      link: '/admin/applications?status=processing'
    },
    {
      icon: CheckCircle2,
      value: stats.applicationsByStatus.approved,
      titleBn: 'অনুমোদিত',
      titleEn: 'Approved',
      color: 'from-green-500 to-emerald-500',
      link: '/admin/applications?status=approved'
    },
    {
      icon: XCircle,
      value: stats.applicationsByStatus.rejected,
      titleBn: 'প্রত্যাখ্যাত',
      titleEn: 'Rejected',
      color: 'from-red-500 to-pink-500',
      link: '/admin/applications?status=rejected'
    }
  ];

  const quickActions = [
    {
      icon: Eye,
      titleBn: 'আবেদন পর্যালোচনা',
      titleEn: 'Review Applications',
      descBn: 'অপেক্ষমাণ আবেদন পর্যালোচনা এবং অনুমোদন',
      descEn: 'Review and approve pending applications',
      gradient: 'from-teal-500 to-cyan-500',
      link: '/admin/applications?status=pending'
    },
    {
      icon: UserCheck,
      titleBn: 'নাগরিক যাচাই',
      titleEn: 'Verify Citizens',
      descBn: 'নাগরিক পরিচয় যাচাই এবং অনুমোদন',
      descEn: 'Verify and approve citizen identities',
      gradient: 'from-purple-500 to-pink-500',
      link: '/admin/citizens'
    },
    {
      icon: BarChart3,
      titleBn: 'বিশ্লেষণ দেখুন',
      titleEn: 'View Analytics',
      descBn: 'সিস্টেম পরিসংখ্যান এবং প্রতিবেদন',
      descEn: 'System statistics and reports',
      gradient: 'from-indigo-500 to-blue-500',
      link: '/admin/analytics'
    },
    {
      icon: Shield,
      titleBn: 'নিরাপত্তা পর্যবেক্ষণ',
      titleEn: 'Security Monitoring',
      descBn: 'নিরাপত্তা সতর্কতা এবং অডিট লগ',
      descEn: 'Security alerts and audit logs',
      gradient: 'from-red-500 to-orange-500',
      link: '/admin/security'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Demo Mode Notice */}
          {((projectId as string) === 'demo-project' || (projectId as string) === 'your-project-id') && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-blue-900 font-medium mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('ডেমো মোড', 'Demo Mode')}
                  </p>
                  <p className={`text-sm text-blue-800 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(
                      'আপনি ডেমো ডেটা দেখছেন। Supabase সংযোগ করতে .env ফাইলে আপনার প্রজেক্ট আইডি এবং API কী যোগ করুন।',
                      'You are viewing demo data. To connect to Supabase, add your project ID and API key to the .env file.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('অ্যাডমিন ড্যাশবোর্ড', 'Admin Dashboard')}
          </h1>
          <p className={`text-lg text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('সিস্টেম পরিচালনা ও পর্যবেক্ষণ', 'System management and monitoring')}
          </p>

          {/* Admin Welcome Card */}
          {user && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] text-white">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <div>
                  <p className={`font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('স্বাগতম,', 'Welcome,')} {language === 'bn' ? user.nameBn : user.name}
                  </p>
                  <p className={`text-sm text-white/80 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('অ্যাডমিন অ্যাকাউন্ট', 'Admin Account')} • {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white cursor-pointer hover:scale-105 transition-transform`}
                  style={{ boxShadow: 'var(--shadow-lg)' }}
                >
                  <stat.icon className="w-10 h-10 mb-4 opacity-80" />
                  <div className={`text-4xl font-bold mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {language === 'bn' ? convertToBengaliNumber(stat.value) : stat.value.toLocaleString()}
                  </div>
                  <div className={`text-white/90 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(stat.titleBn, stat.titleEn)}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Application Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className={`text-2xl mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আবেদনের অবস্থা', 'Application Status')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {applicationStatusCards.map((stat, index) => (
              <Link key={index} to={stat.link}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 cursor-pointer"
                  style={{ boxShadow: 'var(--shadow-md)' }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {language === 'bn' ? convertToBengaliNumber(stat.value) : stat.value.toLocaleString()}
                  </div>
                  <div className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(stat.titleBn, stat.titleEn)}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className={`text-2xl mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('দ্রুত পদক্ষেপ', 'Quick Actions')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`p-8 rounded-2xl bg-gradient-to-br ${action.gradient} text-white cursor-pointer`}
                  style={{ boxShadow: 'var(--shadow-lg)' }}
                >
                  <action.icon className="w-12 h-12 mb-4 opacity-90" />
                  <h3 className={`text-2xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(action.titleBn, action.titleEn)}
                  </h3>
                  <p className={`text-white/90 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(action.descBn, action.descEn)}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 className={`text-xl font-bold mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('ব্যবহারকারী প্রবৃদ্ধি', 'User Growth')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Service Usage Chart */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 className={`text-xl font-bold mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('সেবা ব্যবহার', 'Service Usage')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceUsageData}>
                <XAxis dataKey="service" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Application Status Pie Chart */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 className={`text-xl font-bold mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আবেদনের অবস্থা', 'Application Status')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 className={`text-xl font-bold mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('সক্রিয়তা', 'Activity')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="activity" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Data Chart */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 className={`text-xl font-bold mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('রিজিওনাল ডেটা', 'Regional Data')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalData}>
                <XAxis dataKey="region" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 className={`text-xl font-bold mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('সাম্প্রতিক অর্থনৈতিক অসুবিধা', 'Recent Alerts')}
            </h3>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className={`flex items-center gap-3 ${alert.type}`}>
                  <Bell className="w-5 h-5" />
                  <div>
                    <p className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {alert.message}
                    </p>
                    <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert numbers to Bengali
function convertToBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => {
    return digit >= '0' && digit <= '9' ? bengaliDigits[parseInt(digit)] : digit;
  }).join('');
}