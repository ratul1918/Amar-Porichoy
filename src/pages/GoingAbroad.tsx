import { Plane, Briefcase, GraduationCap, MapPin, Heart, Users, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useState } from 'react';

export function GoingAbroad() {
  const { t, language } = useLanguage();
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  const purposes = [
    {
      id: 'work',
      icon: Briefcase,
      titleBn: 'চাকরি',
      titleEn: 'Work',
      descBn: 'বিদেশে চাকরির জন্য প্রয়োজনীয় কাগজপত্র',
      descEn: 'Documents needed for overseas employment',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'study',
      icon: GraduationCap,
      titleBn: 'পড়াশোনা',
      titleEn: 'Study',
      descBn: 'উচ্চ শিক্ষার জন্য প্রয়োজনীয় কাগজপত্র',
      descEn: 'Documents needed for higher education',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'travel',
      icon: Plane,
      titleBn: 'ভ্রমণ',
      titleEn: 'Travel',
      descBn: 'পর্যটন বা পরিবার দেখার জন্য',
      descEn: 'For tourism or family visit',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 'hajj',
      icon: Heart,
      titleBn: 'হজ ও উমরাহ',
      titleEn: 'Hajj & Umrah',
      descBn: 'পবিত্র যাত্রার জন্য বিশেষ সেবা',
      descEn: 'Special services for sacred journey',
      gradient: 'from-amber-500 to-orange-600',
      link: '/hajj-umrah'
    }
  ];

  // Mock document readiness data
  const documentReadiness = {
    work: [
      { nameBn: 'পাসপোর্ট', nameEn: 'Passport', status: 'ready', validityBn: 'বৈধতা: ৫ বছর', validityEn: 'Valid for: 5 years' },
      { nameBn: 'জাতীয় পরিচয়পত্র', nameEn: 'National ID', status: 'ready', validityBn: 'যাচাইকৃত', validityEn: 'Verified' },
      { nameBn: 'পুলিশ ক্লিয়ারেন্স', nameEn: 'Police Clearance', status: 'action', validityBn: 'আবেদন করুন', validityEn: 'Apply Now' },
      { nameBn: 'ঠিকানা যাচাই', nameEn: 'Address Verification', status: 'issue', validityBn: 'ঠিকানা আপডেট প্রয়োজন', validityEn: 'Address update needed' },
      { nameBn: 'মেডিকেল সার্টিফিকেট', nameEn: 'Medical Certificate', status: 'pending', validityBn: 'এখনও শুরু হয়নি', validityEn: 'Not started yet' }
    ],
    study: [
      { nameBn: 'পাসপোর্ট', nameEn: 'Passport', status: 'ready', validityBn: 'বৈধতা: ৫ বছর', validityEn: 'Valid for: 5 years' },
      { nameBn: 'শিক্ষাগত সনদপত্র', nameEn: 'Educational Certificates', status: 'ready', validityBn: 'যাচাইকৃত', validityEn: 'Verified' },
      { nameBn: 'পুলিশ ক্লিয়ারেন্স', nameEn: 'Police Clearance', status: 'action', validityBn: 'আবেদন করুন', validityEn: 'Apply Now' },
      { nameBn: 'ব্যাংক স্টেটমেন্ট', nameEn: 'Bank Statement', status: 'pending', validityBn: 'এখনও শুরু হয়নি', validityEn: 'Not started yet' }
    ],
    travel: [
      { nameBn: 'পাসপোর্ট', nameEn: 'Passport', status: 'ready', validityBn: 'বৈধতা: ৫ বছর', validityEn: 'Valid for: 5 years' },
      { nameBn: 'জাতীয় পরিচয়পত্র', nameEn: 'National ID', status: 'ready', validityBn: 'যাচাইকৃত', validityEn: 'Verified' },
      { nameBn: 'ভ্রমণ বীমা', nameEn: 'Travel Insurance', status: 'action', validityBn: 'সংগ্রহ করুন', validityEn: 'Obtain this' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'from-green-500 to-emerald-500';
      case 'action': return 'from-amber-500 to-orange-500';
      case 'issue': return 'from-red-500 to-pink-500';
      case 'pending': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return CheckCircle2;
      case 'action': return Clock;
      case 'issue': return AlertCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return { bn: 'প্রস্তুত', en: 'Ready' };
      case 'action': return { bn: 'পদক্ষেপ প্রয়োজন', en: 'Action Needed' };
      case 'issue': return { bn: 'সমস্যা আছে', en: 'Issue Found' };
      case 'pending': return { bn: 'বাকি আছে', en: 'Pending' };
      default: return { bn: 'অজানা', en: 'Unknown' };
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6"
          >
            <Plane className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl text-white mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t('বিদেশে যাওয়ার প্রস্তুতি', 'Going Abroad Preparation')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl text-white/90 max-w-3xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t(
              'কী কাগজ প্রয়োজন? কোনটা প্রস্তুত? কোথায় ঘাটতি? - সব কিছু এক নজরে দেখুন',
              'What documents are needed? Which are ready? What is missing? - See everything at a glance'
            )}
          </motion.p>
        </div>
      </div>

      {/* Purpose Selection */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আপনি কেন বিদেশে যাচ্ছেন?', 'Why Are You Going Abroad?')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('উদ্দেশ্য বেছে নিলে আমরা সঠিক নির্দেশনা দেব', 'Choose your purpose and we will guide you correctly')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {purposes.map((purpose, index) => (
              <motion.div
                key={purpose.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {purpose.link ? (
                  <Link to={purpose.link}>
                    <div className={`relative h-full p-6 rounded-2xl bg-linear-to-br ${purpose.gradient} text-white cursor-pointer`}
                      style={{ boxShadow: 'var(--shadow-lg)' }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                        <purpose.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className={`text-xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(purpose.titleBn, purpose.titleEn)}
                      </h3>
                      <p className={`text-white/80 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(purpose.descBn, purpose.descEn)}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => setSelectedPurpose(purpose.id)}
                    className={`relative h-full w-full p-6 rounded-2xl bg-linear-to-br ${purpose.gradient} text-white transition-all ${
                      selectedPurpose === purpose.id ? 'ring-4 ring-white ring-opacity-50' : ''
                    }`}
                    style={{ boxShadow: 'var(--shadow-lg)' }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <purpose.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className={`text-xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(purpose.titleBn, purpose.titleEn)}
                    </h3>
                    <p className={`text-white/80 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(purpose.descBn, purpose.descEn)}
                    </p>
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Document Readiness Checklist */}
          {selectedPurpose && selectedPurpose !== 'hajj' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 md:p-12"
              style={{ boxShadow: 'var(--shadow-xl)' }}
            >
              <div className="mb-8">
                <h3 className={`text-3xl mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('আপনার কাগজপত্রের অবস্থা', 'Your Document Status')}
                </h3>
                <p className={`text-[rgb(var(--color-text-secondary))] text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('কোন কাগজ প্রস্তুত এবং কোথায় পদক্ষেপ নিতে হবে দেখুন', 'See which documents are ready and where action is needed')}
                </p>
              </div>

              <div className="space-y-4">
                {documentReadiness[selectedPurpose as keyof typeof documentReadiness]?.map((doc, index) => {
                  const StatusIcon = getStatusIcon(doc.status);
                  const statusText = getStatusText(doc.status);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-6 rounded-2xl bg-linear-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-[rgb(var(--color-accent))] transition-all"
                    >
                      <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${getStatusColor(doc.status)} flex items-center justify-center shrink-0`}>
                        <StatusIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-semibold mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t(doc.nameBn, doc.nameEn)}
                        </h4>
                        <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t(doc.validityBn, doc.validityEn)}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold bg-linear-to-r ${getStatusColor(doc.status)} text-white ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(statusText.bn, statusText.en)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('সতর্কতা ও পরামর্শ', 'Alerts & Recommendations')}
                    </h4>
                    <p className={`text-[rgb(var(--color-text-secondary))] mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(
                        'আপনার ঠিকানা যাচাই সম্পন্ন করুন। এটি ছাড়া পুলিশ ক্লিয়ারেন্স পেতে সমস্যা হবে।',
                        'Complete your address verification. Without this, you may face issues obtaining police clearance.'
                      )}
                    </p>
                    <Link to="/services">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold inline-flex items-center gap-2 ${language === 'bn' ? 'font-bangla' : ''}`}
                      >
                        {t('এখনই ঠিকানা যাচাই করুন', 'Verify Address Now')}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link to="/services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-10 py-5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold inline-flex items-center gap-3 ${language === 'bn' ? 'font-bangla' : ''}`}
                    style={{ boxShadow: 'var(--shadow-xl)' }}
                  >
                    {t('প্রয়োজনীয় সেবার জন্য আবেদন করুন', 'Apply for Required Services')}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          {!selectedPurpose && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-12 bg-white rounded-3xl"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <Users className="w-16 h-16 text-[rgb(var(--color-text-light))] mx-auto mb-4" />
              <p className={`text-xl text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('উপরে থেকে আপনার উদ্দেশ্য বেছে নিন', 'Choose your purpose from above')}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Guidance Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MapPin className="w-16 h-16 text-[rgb(var(--color-primary))] mx-auto mb-6" />
            <h2 className={`text-4xl mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আমরা পথ দেখাই', 'We Guide Your Way')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] mb-8 leading-relaxed ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t(
                'প্রতিটি ধাপে স্পষ্ট নির্দেশনা পাবেন। কোন কাগজ কখন লাগবে, কীভাবে পাবেন - সব বিস্তারিত জানতে পারবেন। আর কোনো দালাল বা মধ্যস্থতাকারীর প্রয়োজন নেই।',
                'You will get clear guidance at every step. When you need which document and how to get it - you will know everything in detail. No more middlemen needed.'
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
