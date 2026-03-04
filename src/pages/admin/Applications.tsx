import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { 
  FileText, Search, Filter, Eye, Check, X, Clock, 
  ChevronDown, Download, MoreVertical, AlertCircle
} from 'lucide-react';

export function Applications() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const applications = [
    {
      id: 'APP001234',
      applicantName: 'Mohammad Rahman',
      applicantNameBn: 'মোহাম্মদ রহমান',
      service: 'e-Passport',
      serviceBn: 'ই-পাসপোর্ট',
      status: 'pending',
      submittedDate: '2024-03-01',
      nid: '1234567890',
      priority: 'normal'
    },
    {
      id: 'APP001235',
      applicantName: 'Fatima Khatun',
      applicantNameBn: 'ফাতিমা খাতুন',
      service: 'NID Registration',
      serviceBn: 'জাতীয় পরিচয়পত্র নিবন্ধন',
      status: 'processing',
      submittedDate: '2024-02-28',
      nid: '9876543210',
      priority: 'high'
    },
    {
      id: 'APP001236',
      applicantName: 'Abdul Karim',
      applicantNameBn: 'আব্দুল করিম',
      service: 'Birth Certificate',
      serviceBn: 'জন্ম সনদপত্র',
      status: 'approved',
      submittedDate: '2024-02-25',
      nid: '5678901234',
      priority: 'normal'
    },
    {
      id: 'APP001237',
      applicantName: 'Ayesha Begum',
      applicantNameBn: 'আয়েশা বেগম',
      service: 'Driving License',
      serviceBn: 'ড্রাইভিং লাইসেন্স',
      status: 'rejected',
      submittedDate: '2024-02-20',
      nid: '3456789012',
      priority: 'normal'
    },
    {
      id: 'APP001238',
      applicantName: 'Kamal Hossain',
      applicantNameBn: 'কামাল হোসেন',
      service: 'Tax Certificate',
      serviceBn: 'কর সনদপত্র',
      status: 'pending',
      submittedDate: '2024-03-01',
      nid: '7890123456',
      priority: 'urgent'
    }
  ];

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', labelBn: 'অপেক্ষমাণ', labelEn: 'Pending' },
    processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', labelBn: 'প্রক্রিয়াধীন', labelEn: 'Processing' },
    approved: { color: 'bg-green-100 text-green-800 border-green-200', labelBn: 'অনুমোদিত', labelEn: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800 border-red-200', labelBn: 'প্রত্যাখ্যাত', labelEn: 'Rejected' }
  };

  const priorityConfig = {
    urgent: { color: 'text-red-600', labelBn: 'জরুরি', labelEn: 'Urgent' },
    high: { color: 'text-orange-600', labelBn: 'উচ্চ', labelEn: 'High' },
    normal: { color: 'text-gray-600', labelBn: 'সাধারণ', labelEn: 'Normal' }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = 
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantNameBn.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    processing: applications.filter(a => a.status === 'processing').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
          {t('আবেদন ব্যবস্থাপনা', 'Application Management')}
        </h1>
        <p className={`text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
          {t('নাগরিকদের আবেদন পর্যালোচনা এবং প্রক্রিয়াকরণ', 'Review and process citizen applications')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'all', labelBn: 'সব আবেদন', labelEn: 'All', color: 'border-gray-300' },
          { key: 'pending', labelBn: 'অপেক্ষমাণ', labelEn: 'Pending', color: 'border-yellow-300' },
          { key: 'processing', labelBn: 'প্রক্রিয়াধীন', labelEn: 'Processing', color: 'border-blue-300' },
          { key: 'approved', labelBn: 'অনুমোদিত', labelEn: 'Approved', color: 'border-green-300' },
          { key: 'rejected', labelBn: 'প্রত্যাখ্যাত', labelEn: 'Rejected', color: 'border-red-300' }
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setFilter(stat.key)}
            className={`p-4 rounded-xl border-2 transition-all ${
              filter === stat.key 
                ? `${stat.color} bg-gray-50` 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{stats[stat.key as keyof typeof stats]}</p>
            <p className={`text-sm text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t(stat.labelBn, stat.labelEn)}
            </p>
          </button>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('আবেদন আইডি বা নাম দিয়ে খুঁজুন...', 'Search by ID or name...')}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'bn' ? 'font-bangla' : ''}`}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span className={language === 'bn' ? 'font-bangla' : ''}>
            {t('ফিল্টার', 'Filters')}
          </span>
        </button>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700">
          <Download className="w-5 h-5" />
          <span className={language === 'bn' ? 'font-bangla' : ''}>
            {t('এক্সপোর্ট', 'Export')}
          </span>
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('আবেদন আইডি', 'Application ID')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('আবেদনকারী', 'Applicant')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('সেবা', 'Service')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('অবস্থা', 'Status')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('অগ্রাধিকার', 'Priority')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('তারিখ', 'Date')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('কার্যক্রম', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">{app.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {language === 'bn' ? app.applicantNameBn : app.applicantName}
                      </p>
                      <p className="text-sm text-gray-500">{app.nid}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {language === 'bn' ? app.serviceBn : app.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[app.status as keyof typeof statusConfig].color} ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(
                        statusConfig[app.status as keyof typeof statusConfig].labelBn,
                        statusConfig[app.status as keyof typeof statusConfig].labelEn
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${priorityConfig[app.priority as keyof typeof priorityConfig].color} ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(
                        priorityConfig[app.priority as keyof typeof priorityConfig].labelBn,
                        priorityConfig[app.priority as keyof typeof priorityConfig].labelEn
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{app.submittedDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title={t('দেখুন', 'View')}
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button className="p-2 hover:bg-green-50 rounded-lg" title={t('অনুমোদন', 'Approve')}>
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg" title={t('প্রত্যাখ্যান', 'Reject')}>
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className={`text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('কোন আবেদন পাওয়া যায়নি', 'No applications found')}
            </p>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedApp(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold text-gray-900 mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('আবেদনের বিবরণ', 'Application Details')}
                </h2>
                <p className="text-sm text-gray-600">{selectedApp.id}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm text-gray-600 mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('আবেদনকারী', 'Applicant')}
                  </p>
                  <p className={`font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {language === 'bn' ? selectedApp.applicantNameBn : selectedApp.applicantName}
                  </p>
                </div>
                <div>
                  <p className={`text-sm text-gray-600 mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('এনআইডি', 'NID')}
                  </p>
                  <p className="font-medium font-mono">{selectedApp.nid}</p>
                </div>
                <div>
                  <p className={`text-sm text-gray-600 mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('সেবা', 'Service')}
                  </p>
                  <p className={`font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {language === 'bn' ? selectedApp.serviceBn : selectedApp.service}
                  </p>
                </div>
                <div>
                  <p className={`text-sm text-gray-600 mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('জমা দেওয়ার তারিখ', 'Submitted Date')}
                  </p>
                  <p className="font-medium">{selectedApp.submittedDate}</p>
                </div>
              </div>

              {selectedApp.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 py-3 px-4 rounded-xl bg-green-600 text-white hover:bg-green-700">
                    {t('অনুমোদন করুন', 'Approve')}
                  </button>
                  <button className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700">
                    {t('প্রত্যাখ্যান করুন', 'Reject')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
