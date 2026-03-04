import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { 
  Users, Search, Filter, Eye, UserCheck, UserX, 
  Shield, AlertTriangle, Download, MoreVertical, CheckCircle2
} from 'lucide-react';

export function Citizens() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const citizens = [
    {
      id: '1234567890',
      name: 'Mohammad Rahman',
      nameBn: 'মোহাম্মদ রহমান',
      email: 'rahman@email.com',
      phone: '+880 1712345678',
      verified: true,
      status: 'active',
      registeredDate: '2023-01-15',
      lastActive: '2024-03-01',
      riskLevel: 'low'
    },
    {
      id: '9876543210',
      name: 'Fatima Khatun',
      nameBn: 'ফাতিমা খাতুন',
      email: 'fatima@email.com',
      phone: '+880 1798765432',
      verified: true,
      status: 'active',
      registeredDate: '2023-02-20',
      lastActive: '2024-02-29',
      riskLevel: 'low'
    },
    {
      id: '5678901234',
      name: 'Abdul Karim',
      nameBn: 'আব্দুল করিম',
      email: 'karim@email.com',
      phone: '+880 1756789012',
      verified: false,
      status: 'pending',
      registeredDate: '2024-02-28',
      lastActive: '2024-03-01',
      riskLevel: 'medium'
    },
    {
      id: '3456789012',
      name: 'Ayesha Begum',
      nameBn: 'আয়েশা বেগম',
      email: 'ayesha@email.com',
      phone: '+880 1734567890',
      verified: true,
      status: 'suspended',
      registeredDate: '2023-05-10',
      lastActive: '2024-01-15',
      riskLevel: 'high'
    }
  ];

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800 border-green-200', labelBn: 'সক্রিয়', labelEn: 'Active' },
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', labelBn: 'অপেক্ষমাণ', labelEn: 'Pending' },
    suspended: { color: 'bg-red-100 text-red-800 border-red-200', labelBn: 'স্থগিত', labelEn: 'Suspended' }
  };

  const riskConfig = {
    low: { color: 'text-green-600', labelBn: 'নিম্ন', labelEn: 'Low' },
    medium: { color: 'text-yellow-600', labelBn: 'মধ্যম', labelEn: 'Medium' },
    high: { color: 'text-red-600', labelBn: 'উচ্চ', labelEn: 'High' }
  };

  const filteredCitizens = citizens.filter(citizen => {
    const matchesSearch = 
      citizen.id.includes(searchQuery) ||
      citizen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citizen.nameBn.includes(searchQuery) ||
      citizen.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'verified' && citizen.verified) ||
      (filter === 'unverified' && !citizen.verified) ||
      citizen.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: citizens.length,
    verified: citizens.filter(c => c.verified).length,
    pending: citizens.filter(c => c.status === 'pending').length,
    suspended: citizens.filter(c => c.status === 'suspended').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
          {t('নাগরিক ব্যবস্থাপনা', 'Citizen Management')}
        </h1>
        <p className={`text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
          {t('নাগরিক তথ্য পরিচালনা এবং যাচাইকরণ', 'Manage and verify citizen information')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            icon: Users, 
            label: t('মোট নাগরিক', 'Total Citizens'), 
            value: stats.total,
            color: 'from-blue-500 to-cyan-500'
          },
          { 
            icon: UserCheck, 
            label: t('যাচাইকৃত', 'Verified'), 
            value: stats.verified,
            color: 'from-green-500 to-emerald-500'
          },
          { 
            icon: AlertTriangle, 
            label: t('অপেক্ষমাণ', 'Pending'), 
            value: stats.pending,
            color: 'from-yellow-500 to-orange-500'
          },
          { 
            icon: UserX, 
            label: t('স্থগিত', 'Suspended'), 
            value: stats.suspended,
            color: 'from-red-500 to-pink-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-sm text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('নাম, এনআইডি বা ইমেইল দিয়ে খুঁজুন...', 'Search by name, NID, or email...')}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'bn' ? 'font-bangla' : ''}`}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'bn' ? 'font-bangla' : ''}`}
        >
          <option value="all">{t('সকল', 'All')}</option>
          <option value="verified">{t('যাচাইকৃত', 'Verified')}</option>
          <option value="unverified">{t('অযাচাইকৃত', 'Unverified')}</option>
          <option value="active">{t('সক্রিয়', 'Active')}</option>
          <option value="pending">{t('অপেক্ষমাণ', 'Pending')}</option>
          <option value="suspended">{t('স্থগিত', 'Suspended')}</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700">
          <Download className="w-5 h-5" />
          <span className={language === 'bn' ? 'font-bangla' : ''}>
            {t('এক্সপোর্ট', 'Export')}
          </span>
        </button>
      </div>

      {/* Citizens Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('এনআইডি', 'NID')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('নাম', 'Name')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('যোগাযোগ', 'Contact')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('যাচাই', 'Verification')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('অবস্থা', 'Status')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ঝুঁকি', 'Risk')}
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('কার্যক্রম', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCitizens.map((citizen, index) => (
                <motion.tr
                  key={citizen.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">{citizen.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium text-gray-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {language === 'bn' ? citizen.nameBn : citizen.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('নিবন্ধিত', 'Registered')}: {citizen.registeredDate}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{citizen.email}</p>
                      <p className="text-gray-500">{citizen.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {citizen.verified ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className={`text-sm font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t('যাচাইকৃত', 'Verified')}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="w-5 h-5" />
                        <span className={`text-sm font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t('অপেক্ষমাণ', 'Pending')}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[citizen.status as keyof typeof statusConfig].color} ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(
                        statusConfig[citizen.status as keyof typeof statusConfig].labelBn,
                        statusConfig[citizen.status as keyof typeof statusConfig].labelEn
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${riskConfig[citizen.riskLevel as keyof typeof riskConfig].color} ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(
                        riskConfig[citizen.riskLevel as keyof typeof riskConfig].labelBn,
                        riskConfig[citizen.riskLevel as keyof typeof riskConfig].labelEn
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title={t('দেখুন', 'View')}>
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {!citizen.verified && (
                        <button className="p-2 hover:bg-green-50 rounded-lg" title={t('যাচাই করুন', 'Verify')}>
                          <UserCheck className="w-4 h-4 text-green-600" />
                        </button>
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

        {filteredCitizens.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className={`text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('কোন নাগরিক পাওয়া যায়নি', 'No citizens found')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
