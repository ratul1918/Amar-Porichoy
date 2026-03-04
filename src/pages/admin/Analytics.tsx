import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export function Analytics() {
  const { t, language } = useLanguage();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const kpis = [
    {
      labelBn: 'মোট আবেদন',
      labelEn: 'Total Applications',
      value: 15420,
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      labelBn: 'সক্রিয় ব্যবহারকারী',
      labelEn: 'Active Users',
      value: 8934,
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-emerald-600'
    },
    {
      labelBn: 'গড় প্রক্রিয়াকরণ সময়',
      labelEn: 'Avg Processing Time',
      value: '3.2 days',
      change: '-15.3%',
      trend: 'down',
      icon: Clock,
      color: 'from-purple-500 to-pink-600'
    },
    {
      labelBn: 'অনুমোদনের হার',
      labelEn: 'Approval Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const serviceStats = [
    { nameBn: 'পাসপোর্ট', nameEn: 'Passport', count: 4520, percentage: 29 },
    { nameBn: 'জাতীয় পরিচয়পত্র', nameEn: 'National ID', count: 3890, percentage: 25 },
    { nameBn: 'জন্ম সনদ', nameEn: 'Birth Certificate', count: 2340, percentage: 15 },
    { nameBn: 'পুলিশ ক্লিয়ারেন্স', nameEn: 'Police Clearance', count: 2110, percentage: 14 },
    { nameBn: 'অন্যান্য', nameEn: 'Others', count: 2560, percentage: 17 }
  ];

  const regionalData = [
    { divisionBn: 'ঢাকা', divisionEn: 'Dhaka', applications: 5200, users: 3400 },
    { divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', applications: 3100, users: 2100 },
    { divisionBn: 'খুলনা', divisionEn: 'Khulna', applications: 1800, users: 1200 },
    { divisionBn: 'রাজশাহী', divisionEn: 'Rajshahi', applications: 1900, users: 1300 },
    { divisionBn: 'সিলেট', divisionEn: 'Sylhet', applications: 1400, users: 900 },
    { divisionBn: 'বরিশাল', divisionEn: 'Barishal', applications: 1100, users: 750 },
    { divisionBn: 'রংপুর', divisionEn: 'Rangpur', applications: 920, users: 630 }
  ];

  const rejectionReasons = [
    { reasonBn: 'ভুল তথ্য', reasonEn: 'Incorrect Information', count: 234, percentage: 38 },
    { reasonBn: 'অসম্পূর্ণ নথি', reasonEn: 'Incomplete Documents', count: 189, percentage: 31 },
    { reasonBn: 'যাচাইকরণ ব্যর্থ', reasonEn: 'Verification Failed', count: 112, percentage: 18 },
    { reasonBn: 'অন্যান্য', reasonEn: 'Others', count: 80, percentage: 13 }
  ];

  const fraudAlerts = [
    {
      typeBn: 'ডুপ্লিকেট NID',
      typeEn: 'Duplicate NID',
      severity: 'high',
      count: 12,
      icon: AlertTriangle
    },
    {
      typeBn: 'সন্দেহজনক নথি',
      typeEn: 'Suspicious Document',
      severity: 'medium',
      count: 8,
      icon: FileText
    },
    {
      typeBn: 'মুখ যাচাইকরণ ব্যর্থ',
      typeEn: 'Face Verification Failed',
      severity: 'high',
      count: 5,
      icon: XCircle
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('বিশ্লেষণ ও রিপোর্ট', 'Analytics & Reports')}
              </h1>
              <p className={`text-lg text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('সিস্টেম পারফরম্যান্স এবং ব্যবহার বিশ্লেষণ', 'System performance and usage analytics')}
              </p>
            </div>

            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    timeRange === range
                      ? 'bg-[rgb(var(--color-primary))] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } ${language === 'bn' ? 'font-bangla' : ''}`}
                >
                  {range === 'week' && t('সপ্তাহ', 'Week')}
                  {range === 'month' && t('মাস', 'Month')}
                  {range === 'year' && t('বছর', 'Year')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${kpi.color} text-white`}
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-10 h-10 opacity-80" />
                  <span className={`px-2 py-1 rounded-lg bg-white/20 text-xs ${
                    kpi.trend === 'up' ? 'text-white' : 'text-white'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <div className={`text-3xl font-bold mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {kpi.value}
                </div>
                <div className={`text-white/90 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(kpi.labelBn, kpi.labelEn)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              <h3 className={`text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('সেবা বিতরণ', 'Service Distribution')}
              </h3>
            </div>

            <div className="space-y-4">
              {serviceStats.map((service, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {language === 'bn' ? service.nameBn : service.nameEn}
                    </span>
                    <span className="text-sm font-semibold">
                      {service.count.toLocaleString()} ({service.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${service.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Regional Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              <h3 className={`text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('আঞ্চলিক ব্যবহার', 'Regional Usage')}
              </h3>
            </div>

            <div className="space-y-3">
              {regionalData.map((region, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className={`${language === 'bn' ? 'font-bangla' : ''}`}>
                      {language === 'bn' ? region.divisionBn : region.divisionEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-600">
                      {region.applications.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {region.users.toLocaleString()} users
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rejection Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className={`text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('প্রত্যাখ্যানের কারণ', 'Rejection Reasons')}
              </h3>
            </div>

            <div className="space-y-4">
              {rejectionReasons.map((reason, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {language === 'bn' ? reason.reasonBn : reason.reasonEn}
                    </span>
                    <span className="text-sm font-semibold">
                      {reason.count} ({reason.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${reason.percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-red-500 to-pink-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fraud Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-6 border border-gray-200"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className={`text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('জালিয়াতি সনাক্তকরণ', 'Fraud Detection')}
              </h3>
            </div>

            <div className="space-y-3">
              {fraudAlerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      alert.severity === 'high' 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${
                          alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <span className={`${language === 'bn' ? 'font-bangla' : ''}`}>
                          {language === 'bn' ? alert.typeBn : alert.typeEn}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          alert.severity === 'high'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {alert.count} {t('টি', 'cases')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
