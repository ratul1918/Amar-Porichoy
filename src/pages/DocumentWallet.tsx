import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { 
  FileText, 
  Shield, 
  Download, 
  Share2, 
  Eye,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Upload,
  Search,
  Filter,
  MoreVertical,
  QrCode
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  name: string;
  nameBn: string;
  issueDate: string;
  expiryDate?: string;
  status: 'verified' | 'pending' | 'expired';
  issuer: string;
  documentNumber: string;
  category: 'identity' | 'education' | 'property' | 'financial' | 'government';
}

export function DocumentWallet() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const documents: Document[] = [
    {
      id: '1',
      type: 'nid',
      name: 'National ID Card',
      nameBn: 'জাতীয় পরিচয়পত্র',
      issueDate: '2020-01-15',
      status: 'verified',
      issuer: 'Election Commission',
      documentNumber: '1234567890',
      category: 'identity'
    },
    {
      id: '2',
      type: 'passport',
      name: 'Passport',
      nameBn: 'পাসপোর্ট',
      issueDate: '2022-03-20',
      expiryDate: '2027-03-20',
      status: 'verified',
      issuer: 'Department of Immigration & Passports',
      documentNumber: 'AB1234567',
      category: 'identity'
    },
    {
      id: '3',
      type: 'birth',
      name: 'Birth Certificate',
      nameBn: 'জন্ম নিবন্ধন সনদ',
      issueDate: '1990-05-10',
      status: 'verified',
      issuer: 'Birth & Death Registration',
      documentNumber: '12345678901234567',
      category: 'identity'
    },
    {
      id: '4',
      type: 'ssc',
      name: 'SSC Certificate',
      nameBn: 'এসএসসি সার্টিফিকেট',
      issueDate: '2008-08-15',
      status: 'verified',
      issuer: 'Board of Education',
      documentNumber: 'SSC-123456',
      category: 'education'
    },
    {
      id: '5',
      type: 'police-clearance',
      name: 'Police Clearance',
      nameBn: 'পুলিশ ক্লিয়ারেন্স',
      issueDate: '2023-11-01',
      expiryDate: '2024-11-01',
      status: 'expired',
      issuer: 'Bangladesh Police',
      documentNumber: 'PC-789012',
      category: 'government'
    },
    {
      id: '6',
      type: 'tax',
      name: 'Tax Certificate',
      nameBn: 'কর সনদপত্র',
      issueDate: '2024-01-15',
      status: 'verified',
      issuer: 'NBR',
      documentNumber: 'TIN-123456789',
      category: 'financial'
    }
  ];

  const categories = [
    { id: 'all', nameBn: 'সকল', nameEn: 'All', count: documents.length },
    { id: 'identity', nameBn: 'পরিচয়', nameEn: 'Identity', count: documents.filter(d => d.category === 'identity').length },
    { id: 'education', nameBn: 'শিক্ষা', nameEn: 'Education', count: documents.filter(d => d.category === 'education').length },
    { id: 'government', nameBn: 'সরকারি', nameEn: 'Government', count: documents.filter(d => d.category === 'government').length },
    { id: 'financial', nameBn: 'আর্থিক', nameEn: 'Financial', count: documents.filter(d => d.category === 'financial').length },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.nameBn.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
            <CheckCircle2 className="w-3 h-3" />
            {t('যাচাইকৃত', 'Verified')}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
            <Clock className="w-3 h-3" />
            {t('অপেক্ষমাণ', 'Pending')}
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
            <AlertCircle className="w-3 h-3" />
            {t('মেয়াদোত্তীর্ণ', 'Expired')}
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'identity':
        return Shield;
      case 'education':
        return FileText;
      case 'government':
        return FileText;
      case 'financial':
        return FileText;
      default:
        return FileText;
    }
  };

  const stats = [
    { 
      labelBn: 'মোট নথি', 
      labelEn: 'Total Documents', 
      value: documents.length,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      labelBn: 'যাচাইকৃত', 
      labelEn: 'Verified', 
      value: documents.filter(d => d.status === 'verified').length,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      labelBn: 'মেয়াদোত্তীর্ণ', 
      labelEn: 'Expired', 
      value: documents.filter(d => d.status === 'expired').length,
      color: 'from-red-500 to-pink-600'
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
          <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('ডিজিটাল ডকুমেন্ট ওয়ালেট', 'Digital Document Wallet')}
          </h1>
          <p className={`text-lg text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আপনার সকল যাচাইকৃত নথি এক জায়গায়', 'All your verified documents in one place')}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white`}
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <div className={`text-4xl font-bold mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {stat.value}
              </div>
              <div className={`text-white/90 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t(stat.labelBn, stat.labelEn)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('নথি খুঁজুন...', 'Search documents...')}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] ${language === 'bn' ? 'font-bangla' : ''}`}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {t(cat.nameBn, cat.nameEn)} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, index) => {
            const Icon = getCategoryIcon(doc.category);
            
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] transition-all cursor-pointer"
                style={{ boxShadow: 'var(--shadow-md)' }}
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {getStatusBadge(doc.status)}
                </div>

                <h3 className={`text-lg mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {language === 'bn' ? doc.nameBn : doc.name}
                </h3>

                <div className="space-y-2 text-sm text-[rgb(var(--color-text-secondary))]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className={language === 'bn' ? 'font-bangla' : ''}>
                      {doc.documentNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className={language === 'bn' ? 'font-bangla' : ''}>
                      {t('ইস্যু:', 'Issued:')} {doc.issueDate}
                    </span>
                  </div>
                  {doc.expiryDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className={language === 'bn' ? 'font-bangla' : ''}>
                        {t('মেয়াদ:', 'Expires:')} {doc.expiryDate}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-sm">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors text-sm">
                    <Share2 className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-sm">
                    <QrCode className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Upload New Document */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-8 rounded-2xl border-2 border-dashed border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] transition-colors cursor-pointer text-center"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--color-text-light))]" />
          <h3 className={`text-lg mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('নতুন নথি আপলোড করুন', 'Upload New Document')}
          </h3>
          <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('PDF, JPG বা PNG ফাইল আপলোড করুন', 'Upload PDF, JPG or PNG files')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
