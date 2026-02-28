import { Heart, CheckCircle2, FileText, Users, Phone, Clock, MapPin, Shield, AlertCircle, Book, Plane } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useState } from 'react';

export function HajjUmrah() {
  const { t, language } = useLanguage();
  const [selectedJourney, setSelectedJourney] = useState<'hajj' | 'umrah'>('hajj');

  const journeyTypes = [
    {
      id: 'hajj' as const,
      titleBn: 'হজ',
      titleEn: 'Hajj',
      descBn: 'পবিত্র হজের যাত্রার প্রস্তুতি',
      descEn: 'Preparation for sacred Hajj journey'
    },
    {
      id: 'umrah' as const,
      titleBn: 'উমরাহ',
      titleEn: 'Umrah',
      descBn: 'উমরাহ পালনের সম্পূর্ণ সহায়তা',
      descEn: 'Complete support for Umrah pilgrimage'
    }
  ];

  const preparationSteps = [
    {
      icon: FileText,
      titleBn: 'প্রয়োজনীয় কাগজপত্র',
      titleEn: 'Required Documents',
      descBn: 'পাসপোর্ট, জাতীয় পরিচয়পত্র, টিকা কার্ড',
      descEn: 'Passport, National ID, Vaccination Card',
      statusBn: 'প্রস্তুত',
      statusEn: 'Ready',
      status: 'ready'
    },
    {
      icon: Shield,
      titleBn: 'পরিচয় যাচাই',
      titleEn: 'Identity Verification',
      descBn: 'আপনার পরিচয় সম্পূর্ণভাবে যাচাইকৃত',
      descEn: 'Your identity is fully verified',
      statusBn: 'সম্পন্ন',
      statusEn: 'Complete',
      status: 'ready'
    },
    {
      icon: Heart,
      titleBn: 'স্বাস্থ্য পরীক্ষা',
      titleEn: 'Health Checkup',
      descBn: 'চিকিৎসা পরীক্ষা ও টিকা সম্পন্ন করুন',
      descEn: 'Complete medical checkup and vaccination',
      statusBn: 'পদক্ষেপ নিন',
      statusEn: 'Take Action',
      status: 'action'
    },
    {
      icon: Book,
      titleBn: 'হজ প্রশিক্ষণ',
      titleEn: 'Hajj Training',
      descBn: 'হজের নিয়ম-কানুন শিখুন',
      descEn: 'Learn Hajj rules and rituals',
      statusBn: 'শুরু করুন',
      statusEn: 'Start Now',
      status: 'pending'
    },
    {
      icon: Plane,
      titleBn: 'ভিসা ও টিকিট',
      titleEn: 'Visa & Ticket',
      descBn: 'ভিসা প্রসেসিং ও টিকিট বুকিং',
      descEn: 'Visa processing and ticket booking',
      statusBn: 'বাকি আছে',
      statusEn: 'Pending',
      status: 'pending'
    }
  ];

  const documents = [
    { nameBn: 'পাসপোর্ট', nameEn: 'Passport', status: 'ready', validityBn: 'বৈধ আছে ২ বছর', validityEn: 'Valid for 2 years' },
    { nameBn: 'জাতীয় পরিচয়পত্র', nameEn: 'National ID', status: 'ready', validityBn: 'যাচাইকৃত', validityEn: 'Verified' },
    { nameBn: 'মেডিকেল সার্টিফিকেট', nameEn: 'Medical Certificate', status: 'action', validityBn: 'সংগ্রহ করুন', validityEn: 'Obtain This' },
    { nameBn: 'টিকা কার্ড', nameEn: 'Vaccination Card', status: 'action', validityBn: 'টিকা নিন', validityEn: 'Get Vaccinated' },
    { nameBn: 'ছবি', nameEn: 'Photograph', status: 'ready', validityBn: 'আপলোড করা আছে', validityEn: 'Uploaded' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'from-green-500 to-emerald-500';
      case 'action': return 'from-amber-500 to-orange-500';
      case 'pending': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return CheckCircle2;
      case 'action': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const supportOptions = [
    {
      icon: Users,
      titleBn: 'পরিবার সহায়তা',
      titleEn: 'Family Assistance',
      descBn: 'পরিবারের সদস্য আপনার পক্ষে আবেদন করতে পারবে',
      descEn: 'Family members can apply on your behalf'
    },
    {
      icon: Phone,
      titleBn: 'হেল্পলাইন',
      titleEn: 'Helpline',
      descBn: '১৬৩৩৩ নম্বরে যোগাযোগ করুন',
      descEn: 'Contact us at 16333'
    },
    {
      icon: Book,
      titleBn: 'ভিডিও গাইড',
      titleEn: 'Video Guide',
      descBn: 'বাংলায় ধাপে ধাপে ভিডিও দেখুন',
      descEn: 'Watch step-by-step videos in Bangla'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section with Respectful Design */}
      <div className="relative bg-linear-to-br from-amber-600 via-orange-600 to-yellow-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('হজ ও উমরাহ পোর্টাল', 'Hajj & Umrah Portal')}
              </h1>
              <p className={`text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t(
                  'পবিত্র যাত্রার সম্পূর্ণ প্রস্তুতি - শান্ত ও সহজ প্রক্রিয়ায়',
                  'Complete sacred journey preparation - in a calm and easy process'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 rounded-xl bg-white text-amber-700 text-lg font-semibold ${language === 'bn' ? 'font-bangla' : ''}`}
                    style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  >
                    {t('আবেদন শুরু করুন', 'Start Application')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1736240624842-c13db7ba4275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNjYSUyMGthYWJhJTIwaGFqaiUyMHBpbGdyaW1hZ2V8ZW58MXx8fHwxNzcwNzY0ODQ1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Kaaba Mecca"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-t from-amber-900 to-transparent opacity-40"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Journey Type Selection */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className={`text-3xl sm:text-4xl text-center mb-8 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আপনি কোন যাত্রার জন্য প্রস্তুতি নিচ্ছেন?', 'Which journey are you preparing for?')}
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {journeyTypes.map((journey) => (
                <motion.button
                  key={journey.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedJourney(journey.id)}
                  className={`p-8 rounded-2xl border-3 transition-all ${
                    selectedJourney === journey.id
                      ? 'bg-linear-to-br from-amber-500 to-orange-500 text-white border-amber-600'
                      : 'bg-white border-gray-200 hover:border-amber-300'
                  }`}
                  style={{ boxShadow: selectedJourney === journey.id ? 'var(--shadow-xl)' : 'var(--shadow-md)' }}
                >
                  <Heart className={`w-12 h-12 mx-auto mb-4 ${selectedJourney === journey.id ? 'text-white' : 'text-amber-600'}`} />
                  <h3 className={`text-2xl sm:text-3xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(journey.titleBn, journey.titleEn)}
                  </h3>
                  <p className={`text-sm sm:text-base ${selectedJourney === journey.id ? 'text-white/90' : 'text-[rgb(var(--color-text-secondary))]'} ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(journey.descBn, journey.descEn)}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Steps */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('প্রস্তুতির ধাপসমূহ', 'Preparation Steps')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('এক এক করে সব ধাপ সম্পন্ন করুন', 'Complete each step one by one')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preparationSteps.map((step, index) => {
              const StatusIcon = getStatusIcon(step.status);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-amber-300 transition-all"
                  style={{ boxShadow: 'var(--shadow-md)' }}
                >
                  <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${getStatusColor(step.status)} flex items-center justify-center mb-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(step.titleBn, step.titleEn)}
                  </h3>
                  <p className={`text-[rgb(var(--color-text-secondary))] mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(step.descBn, step.descEn)}
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-linear-to-r ${getStatusColor(step.status)} text-white ${language === 'bn' ? 'font-bangla' : ''}`}>
                    <StatusIcon className="w-4 h-4" />
                    {t(step.statusBn, step.statusEn)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Document Checklist */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আপনার কাগজপত্র চেকলিস্ট', 'Your Document Checklist')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('কোন কাগজ প্রস্তুত এবং কোনটা বাকি আছে', 'Which documents are ready and which are pending')}
            </p>
          </motion.div>

          <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border-2 border-amber-100"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            <div className="space-y-4">
              {documents.map((doc, index) => {
                const StatusIcon = getStatusIcon(doc.status);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-6 rounded-2xl bg-white"
                    style={{ boxShadow: 'var(--shadow-sm)' }}
                  >
                    <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${getStatusColor(doc.status)} flex items-center justify-center shrink-0`}>
                      <StatusIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xl font-semibold mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(doc.nameBn, doc.nameEn)}
                      </h4>
                      <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(doc.validityBn, doc.validityEn)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('সহায়তা পান', 'Get Support')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('প্রয়োজনে আমরা আছি পাশে', 'We are here when you need us')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border-2 border-gray-100 hover:border-amber-300 transition-all"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                <div className="w-16 h-16 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(option.titleBn, option.titleEn)}
                </h3>
                <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(option.descBn, option.descEn)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reassuring Message */}
      <div className="py-20 bg-linear-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className={`text-3xl sm:text-4xl text-white mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('নিশ্চিন্তে প্রস্তুতি নিন', 'Prepare with Peace of Mind')}
            </h2>
            <p className={`text-xl text-white/90 mb-8 leading-relaxed ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t(
                'আমরা বুঝি এই যাত্রা আপনার জীবনের একটি গুরুত্বপূর্ণ অধ্যায়। প্রতিটি ধাপে আমরা আপনার পাশে আছি। কোনো কিছু বুঝতে সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।',
                'We understand this journey is an important chapter of your life. We are with you at every step. If you have any difficulty understanding anything, please contact us.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white text-lg">
              <div className={`flex items-center gap-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                <Phone className="w-6 h-6" />
                <span>হেল্পলাইন: ১৬৩৩৩</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/30"></div>
              <div className={`flex items-center gap-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                <Clock className="w-6 h-6" />
                <span>{t('সকাল ৯টা - রাত ৯টা', '9 AM - 9 PM')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
