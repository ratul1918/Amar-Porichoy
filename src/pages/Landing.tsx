import { Link } from 'react-router';
import { Shield, CheckCircle2, FileText, Clock, Users, ArrowRight, Sparkles, Lock, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export function Landing() {
  const { t, language } = useLanguage();

  const benefits = [
    {
      icon: CheckCircle2,
      titleBn: 'একবার নিবন্ধন',
      titleEn: 'Register Once',
      descBn: 'জন্ম নিবন্ধন বা এনআইডি দিয়ে একবার তথ্য দিন',
      descEn: 'Provide information once with Birth Registration or NID'
    },
    {
      icon: Sparkles,
      titleBn: 'স্বয়ংক্রিয় ফর্ম',
      titleEn: 'Auto-Filled Forms',
      descBn: 'প্রতিবার একই তথ্য লেখার ঝামেলা নেই',
      descEn: 'No more re-entering the same information'
    },
    {
      icon: Lock,
      titleBn: 'নিরাপদ তথ্য',
      titleEn: 'Secure Data',
      descBn: 'আপনার তথ্য সম্পূর্ণ সুরক্ষিত',
      descEn: 'Your information is completely secure'
    },
    {
      icon: Zap,
      titleBn: 'দ্রুত সেবা',
      titleEn: 'Fast Service',
      descBn: 'ঘরে বসেই আবেদন করুন ও ট্র্যাক করুন',
      descEn: 'Apply and track from home'
    }
  ];

  const services = [
    { nameBn: 'পাসপোর্ট', nameEn: 'Passport' },
    { nameBn: 'জাতীয় পরিচয়পত্র', nameEn: 'National ID' },
    { nameBn: 'জন্ম নিবন্ধন সনদ', nameEn: 'Birth Certificate' },
    { nameBn: 'পুলিশ ক্লিয়ারেন্স', nameEn: 'Police Clearance' },
    { nameBn: 'চারিত্রিক সনদপত্র', nameEn: 'Character Certificate' },
    { nameBn: 'ড্রাইভিং লাইসেন্স', nameEn: 'Driving License' },
    { nameBn: 'ভূমি সেবা', nameEn: 'Land Services' },
    { nameBn: 'ব্যবসা নিবন্ধন', nameEn: 'Business Registration' }
  ];

  const stats = [
    { numberBn: '১ কোটি+', numberEn: '10M+', labelBn: 'যাচাইকৃত নাগরিক', labelEn: 'Verified Citizens' },
    { numberBn: '৫০+', numberEn: '50+', labelBn: 'সরকারি সেবা', labelEn: 'Government Services' },
    { numberBn: '২৪/৭', numberEn: '24/7', labelBn: 'উপলব্ধ', labelEn: 'Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-[rgb(var(--color-primary))] via-slate-700 to-slate-600 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[rgb(var(--color-secondary))] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            {/* Government Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm mb-8"
            >
              <Shield className="w-4 h-4" />
              <span className={language === 'bn' ? 'font-bangla' : ''}>
                {t('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', 'Government of Bangladesh')}
              </span>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/30"
              style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
            >
              <Shield className="w-14 h-14 text-white" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 ${language === 'bn' ? 'font-bangla' : 'font-english'}`}
              style={{ fontWeight: 600, lineHeight: 1.2 }}
            >
              {t('এক পরিচয়েই সব সরকারি সেবা', 'One Identity. Every Government Service.')}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 ${language === 'bn' ? 'font-bangla' : ''}`}
              style={{ lineHeight: 1.6 }}
            >
              {t(
                'একবার নিবন্ধন করুন। আর কখনও একই তথ্য লিখতে হবে না।',
                'Register once. Never re-enter your information again.'
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-xl bg-white text-[rgb(var(--color-primary))] text-lg font-semibold min-w-[200px] ${language === 'bn' ? 'font-bangla' : ''}`}
                  style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
                >
                  {t('শুরু করুন', 'Get Started')}
                </motion.button>
              </Link>
              <Link to="/how-it-works">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-xl bg-transparent border-2 border-white/50 text-white text-lg font-semibold min-w-[200px] backdrop-blur-sm hover:bg-white/10 ${language === 'bn' ? 'font-bangla' : ''}`}
                >
                  {t('কীভাবে কাজ করে', 'How It Works')}
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl sm:text-4xl font-bold text-white mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(stat.numberBn, stat.numberEn)}
                  </div>
                  <div className={`text-sm text-white/80 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(stat.labelBn, stat.labelEn)}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Subtle wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(var(--color-bg))"/>
          </svg>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-[rgb(var(--color-bg))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('কেন পরিচয় ব্যবহার করবেন?', 'Why Use Porichoy?')}
            </h2>
            <p className={`text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আপনার জীবনকে সহজ করার জন্য তৈরি', 'Built to make your life easier')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(benefit.titleBn, benefit.titleEn)}
                </h3>
                <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(benefit.descBn, benefit.descEn)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('সব সরকারি সেবা এক জায়গায়', 'All Government Services in One Place')}
            </h2>
            <p className={`text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('৫০+ সরকারি সেবা, একটি পরিচয়ে', '50+ government services with one identity')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-linear-to-br from-gray-50 to-white rounded-xl p-6 text-center border border-gray-100 hover:border-[rgb(var(--color-accent))] transition-all"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className={`text-sm font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(service.nameBn, service.nameEn)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-xl bg-linear-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white font-semibold inline-flex items-center gap-2 ${language === 'bn' ? 'font-bangla' : ''}`}
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                {t('সব সেবা দেখুন', 'View All Services')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Preview */}
      <div className="py-20 bg-linear-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('মাত্র ৩টি ধাপে শুরু করুন', 'Get Started in Just 3 Steps')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, titleBn: 'নিবন্ধন করুন', titleEn: 'Register', descBn: 'মোবাইল নম্বর দিয়ে অ্যাকাউন্ট খুলুন', descEn: 'Create account with mobile number' },
              { icon: Shield, titleBn: 'পরিচয় যাচাই', titleEn: 'Verify Identity', descBn: 'NID বা জন্ম নিবন্ধন দিয়ে যাচাই করুন', descEn: 'Verify with NID or Birth Registration' },
              { icon: CheckCircle2, titleBn: 'সেবা নিন', titleEn: 'Get Services', descBn: 'যেকোনো সরকারি সেবার জন্য আবেদন করুন', descEn: 'Apply for any government service' }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: 'var(--shadow-lg)' }}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-linear-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center text-white text-xl font-bold">
                    {language === 'bn' ? ['১', '২', '৩'][index] : index + 1}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-teal-100 flex items-center justify-center mx-auto mb-4 mt-4">
                    <step.icon className="w-8 h-8 text-[rgb(var(--color-primary))]" />
                  </div>
                  <h3 className={`text-xl mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(step.titleBn, step.titleEn)}
                  </h3>
                  <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(step.descBn, step.descEn)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-linear-to-r from-[rgb(var(--color-primary))] to-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl text-white mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আজই যোগ দিন লাখো বাংলাদেশীর সাথে', 'Join Millions of Bangladeshis Today')}
            </h2>
            <p className={`text-xl text-white/90 mb-8 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('বিনামূল্যে নিবন্ধন করুন এবং সব সেবা এক জায়গায় পান', 'Register for free and access all services in one place')}
            </p>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-10 py-5 rounded-xl bg-white text-[rgb(var(--color-primary))] text-lg font-semibold ${language === 'bn' ? 'font-bangla' : ''}`}
                style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
              >
                {t('এখনই শুরু করুন', 'Start Now')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
