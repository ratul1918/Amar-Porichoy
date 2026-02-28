import { FileText, CreditCard, BookOpen, Vote, Users, Building, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export function Services() {
  const { t, language } = useLanguage();

  const services = [
    {
      id: 'birth-certificate',
      icon: FileText,
      titleBn: 'জন্ম নিবন্ধন সংশোধন',
      titleEn: 'Birth Certificate Correction',
      descBn: 'জন্ম নিবন্ধনের তথ্য সংশোধন ও হালনাগাদ করুন',
      descEn: 'Correct and update birth registration information',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'nid-registration',
      icon: CreditCard,
      titleBn: 'জাতীয় পরিচয়পত্র নিবন্ধন',
      titleEn: 'National ID Registration',
      descBn: 'নতুন জাতীয় পরিচয়পত্রের জন্য আবেদন করুন',
      descEn: 'Apply for new National ID card',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'e-passport',
      icon: BookOpen,
      titleBn: 'ই-পাসপোর্ট',
      titleEn: 'e-Passport',
      descBn: 'নতুন ই-পাসপোর্টের জন্য আবেদন করুন',
      descEn: 'Apply for new e-Passport',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'voter-list',
      icon: Vote,
      titleBn: 'ভোটার তালিকা',
      titleEn: 'Voter List Registration',
      descBn: 'ভোটার তালিকায় নাম যুক্ত বা সংশোধন করুন',
      descEn: 'Add or correct name in voter list',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'family-certificate',
      icon: Users,
      titleBn: 'পরিবার সনদপত্র',
      titleEn: 'Family Certificate',
      descBn: 'পরিবারের সদস্যদের তথ্য সনদপত্র',
      descEn: 'Certificate of family members information',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'tax-certificate',
      icon: Building,
      titleBn: 'ট্যাক্স সনদপত্র',
      titleEn: 'Tax Certificate',
      descBn: 'করদাতা সনদপত্রের জন্য আবেদন',
      descEn: 'Apply for taxpayer certificate',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('সরকারি সেবাসমূহ', 'Government Services')}
          </h1>
          <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আপনার প্রয়োজনীয় সেবা বেছে নিন', 'Choose the service you need')}
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl bg-linear-to-r from-[rgb(var(--color-accent-light))] to-white border border-[rgb(var(--color-accent))]"
        >
          <h3 className={`mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('সহজ আবেদন প্রক্রিয়া', 'Easy Application Process')}
          </h3>
          <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t(
              'আপনার পরিচয় যাচাইকৃত থাকায়, ফর্মগুলো স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে। শুধু প্রয়োজনীয় তথ্য যোগ করুন।',
              'Since your identity is verified, forms will be auto-filled. Just add the required information.'
            )}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link to={`/apply/${service.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-white rounded-2xl p-6 border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] transition-colors cursor-pointer group"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className={`mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(service.titleBn, service.titleEn)}
                  </h3>
                  <p className={`text-sm text-[rgb(var(--color-text-secondary))] mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(service.descBn, service.descEn)}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-[rgb(var(--color-accent))] group-hover:gap-3 transition-all">
                    <span className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('আবেদন করুন', 'Apply Now')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl bg-white border border-[rgb(var(--color-border))]"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <h3 className={`mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('কীভাবে আবেদন করবেন?', 'How to Apply?')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[rgb(var(--color-accent))]">১</span>
              </div>
              <div>
                <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('সেবা নির্বাচন করুন', 'Select Service')}
                </h4>
                <p className={`text-xs text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('উপরের তালিকা থেকে বেছে নিন', 'Choose from the list above')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[rgb(var(--color-accent))]">২</span>
              </div>
              <div>
                <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ফর্ম পূরণ করুন', 'Fill the Form')}
                </h4>
                <p className={`text-xs text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('অধিকাংশ তথ্য স্বয়ংক্রিয় পূরণ হবে', 'Most info will be auto-filled')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-accent-light))] flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[rgb(var(--color-accent))]">৩</span>
              </div>
              <div>
                <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('জমা দিন ও ট্র্যাক করুন', 'Submit & Track')}
                </h4>
                <p className={`text-xs text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('রিয়েল-টাইমে অগ্রগতি দেখুন', 'Track progress in real-time')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}