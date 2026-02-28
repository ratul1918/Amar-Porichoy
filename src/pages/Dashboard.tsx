import { Shield, User, MapPin, Calendar, CheckCircle2, AlertCircle, FileText, ArrowRight, Edit2, Lock, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export function Dashboard() {
  const { t, language } = useLanguage();

  // Mock verified identity data
  const identityData = {
    nameBn: 'মোহাম্মদ রহিম উদ্দিন',
    nameEn: 'Mohammad Rahim Uddin',
    nid: '১২৩৪৫৬৭৮৯০',
    birthDate: '০১ জানুয়ারি, ১৯৯০',
    birthDateEn: 'January 1, 1990',
    addressBn: 'বাড়ি: ২৫, সড়ক: ৭, ধানমন্ডি, ঢাকা-১২০৫',
    addressEn: 'House: 25, Road: 7, Dhanmondi, Dhaka-1205',
    phone: '০১৭১২-৩৪৫৬৭৮',
    email: 'rahim.uddin@example.com',
    photo: 'https://ui-avatars.com/api/?name=Mohammad+Rahim&background=0f4c75&color=fff&size=200'
  };

  const verifiedFields = [
    { icon: User, labelBn: 'পুরো নাম', labelEn: 'Full Name', valueBn: identityData.nameBn, valueEn: identityData.nameEn, verified: true },
    { icon: Shield, labelBn: 'এনআইডি নম্বর', labelEn: 'NID Number', valueBn: identityData.nid, valueEn: identityData.nid, verified: true },
    { icon: Calendar, labelBn: 'জন্ম তারিখ', labelEn: 'Date of Birth', valueBn: identityData.birthDate, valueEn: identityData.birthDateEn, verified: true },
    { icon: MapPin, labelBn: 'ঠিকানা', labelEn: 'Address', valueBn: identityData.addressBn, valueEn: identityData.addressEn, verified: true },
    { icon: Phone, labelBn: 'মোবাইল নম্বর', labelEn: 'Mobile Number', valueBn: identityData.phone, valueEn: identityData.phone, verified: true },
    { icon: Mail, labelBn: 'ইমেইল', labelEn: 'Email', valueBn: identityData.email, valueEn: identityData.email, verified: false }
  ];

  const recentApplications = [
    {
      id: '১',
      idEn: '1',
      serviceBn: 'পাসপোর্ট নবায়ন',
      serviceEn: 'Passport Renewal',
      status: 'processing',
      statusBn: 'প্রক্রিয়াধীন',
      statusEn: 'Processing',
      dateBn: '১৫ জানুয়ারি, ২০২৬',
      dateEn: 'January 15, 2026'
    },
    {
      id: '২',
      idEn: '2',
      serviceBn: 'পুলিশ ক্লিয়ারেন্স',
      serviceEn: 'Police Clearance',
      status: 'approved',
      statusBn: 'অনুমোদিত',
      statusEn: 'Approved',
      dateBn: '১০ জানুয়ারি, ২০২৬',
      dateEn: 'January 10, 2026'
    }
  ];

  const quickActions = [
    {
      titleBn: 'নতুন সেবার জন্য আবেদন',
      titleEn: 'Apply for New Service',
      descBn: 'স্বয়ংক্রিয় ফর্মসহ',
      descEn: 'With auto-filled forms',
      icon: FileText,
      link: '/services',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      titleBn: 'আবেদন ট্র্যাক করুন',
      titleEn: 'Track Applications',
      descBn: 'রিয়েল-টাইম স্ট্যাটাস',
      descEn: 'Real-time status',
      icon: CheckCircle2,
      link: '/tracking',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'from-green-500 to-emerald-500';
      case 'processing': return 'from-blue-500 to-indigo-500';
      case 'pending': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t(`স্বাগতম, ${identityData.nameBn.split(' ')[0]}`, `Welcome, ${identityData.nameEn.split(' ')[0]}`)}
          </h1>
          <p className={`text-lg text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আপনার যাচাইকৃত পরিচয় তথ্য ও সেবার সারসংক্ষেপ', 'Your verified identity information and service summary')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Identity Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-br from-[rgb(var(--color-primary))] to-slate-700 rounded-3xl p-8 text-white sticky top-24"
              style={{ boxShadow: 'var(--shadow-xl)' }}
            >
              {/* Verified Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-100 text-sm mb-6">
                <CheckCircle2 className="w-4 h-4" />
                <span className={language === 'bn' ? 'font-bangla' : ''}>
                  {t('যাচাইকৃত পরিচয়', 'Verified Identity')}
                </span>
              </div>

              {/* Photo */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6 border-4 border-white/20">
                <img src={identityData.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>

              {/* Name */}
              <h2 className={`text-2xl text-center mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t(identityData.nameBn, identityData.nameEn)}
              </h2>

              {/* NID */}
              <div className="text-center text-white/80 mb-6">
                <div className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('এনআইডি নম্বর', 'NID Number')}
                </div>
                <div className={`text-lg font-semibold ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {identityData.nid}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('৫', '5')}
                  </div>
                  <div className={`text-sm text-white/80 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('যাচাইকৃত তথ্য', 'Verified Data')}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('২', '2')}
                  </div>
                  <div className={`text-sm text-white/80 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('সক্রিয় আবেদন', 'Active Applications')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Verified Identity Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('আপনার যাচাইকৃত তথ্য', 'Your Verified Information')}
                </h3>
                <Link to="/services">
                  <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-primary))] transition-all ${language === 'bn' ? 'font-bangla' : ''}`}>
                    <Edit2 className="w-4 h-4" />
                    {t('আপডেট করুন', 'Update Info')}
                  </button>
                </Link>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
                {verifiedFields.map((field, index) => (
                  <div
                    key={index}
                    className={`p-6 flex items-start gap-4 ${
                      index !== verifiedFields.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-teal-100 flex items-center justify-center shrink-0">
                      <field.icon className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm text-[rgb(var(--color-text-light))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t(field.labelBn, field.labelEn)}
                        </span>
                        {field.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('যাচাইকৃত', 'Verified')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {t('যাচাই করুন', 'Verify')}
                          </span>
                        )}
                      </div>
                      <div className={`text-lg font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(field.valueBn, field.valueEn)}
                      </div>
                    </div>
                    {field.verified && (
                      <Lock className="w-5 h-5 text-[rgb(var(--color-text-light))]" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-sm text-blue-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(
                        'এই তথ্য সরকারি রেকর্ড থেকে যাচাইকৃত। যেকোনো সেবার আবেদনে এই তথ্য স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে।',
                        'This information is verified from government records. It will be automatically used in any service application.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`text-2xl mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('দ্রুত পদক্ষেপ', 'Quick Actions')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={`p-6 rounded-2xl bg-linear-to-br ${action.gradient} text-white cursor-pointer`}
                      style={{ boxShadow: 'var(--shadow-lg)' }}
                    >
                      <action.icon className="w-10 h-10 mb-4" />
                      <h4 className={`text-xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(action.titleBn, action.titleEn)}
                      </h4>
                      <p className={`text-white/90 text-sm mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(action.descBn, action.descEn)}
                      </p>
                      <div className="inline-flex items-center gap-2 text-white font-semibold">
                        {t('শুরু করুন', 'Start')}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('সাম্প্রতিক আবেদন', 'Recent Applications')}
                </h3>
                <Link to="/tracking">
                  <button className={`text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-hover))] font-medium inline-flex items-center gap-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('সব দেখুন', 'View All')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
                {recentApplications.map((app, index) => (
                  <div
                    key={index}
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index !== recentApplications.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`text-lg font-semibold ${language === 'bn' ? 'font-bangla' : ''}`}>
                            {t(app.serviceBn, app.serviceEn)}
                          </h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-linear-to-r ${getStatusColor(app.status)}`}>
                            {t(app.statusBn, app.statusEn)}
                          </span>
                        </div>
                        <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t(`আবেদন নম্বর: ${app.id}`, `Application No: ${app.idEn}`)} • {t(app.dateBn, app.dateEn)}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[rgb(var(--color-text-light))]" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
