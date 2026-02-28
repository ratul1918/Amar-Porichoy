import { UserPlus, Shield, FileCheck, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export function HowItWorks() {
  const { t, language } = useLanguage();

  const steps = [
    {
      step: 1,
      icon: UserPlus,
      titleBn: 'নিবন্ধন করুন',
      titleEn: 'Register',
      descBn: 'আপনার মোবাইল নম্বর দিয়ে সহজে অ্যাকাউন্ট তৈরি করুন। আমরা OTP পাঠিয়ে আপনার নম্বর যাচাই করব।',
      descEn: 'Create an account easily with your mobile number. We will verify your number with OTP.',
      gradient: 'from-blue-500 to-cyan-500',
      details: [
        { bn: 'মোবাইল নম্বর প্রদান করুন', en: 'Provide mobile number' },
        { bn: 'OTP কোড যাচাই করুন', en: 'Verify OTP code' },
        { bn: 'পাসওয়ার্ড সেট করুন', en: 'Set password' }
      ]
    },
    {
      step: 2,
      icon: Shield,
      titleBn: 'পরিচয় যাচাই',
      titleEn: 'Identity Verification',
      descBn: 'আপনার জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন নম্বর দিয়ে পরিচয় যাচাই করুন। এটি একবারই করতে হবে।',
      descEn: 'Verify your identity with National ID or Birth Certificate number. This only needs to be done once.',
      gradient: 'from-green-500 to-emerald-500',
      details: [
        { bn: 'NID বা জন্ম সনদ নম্বর দিন', en: 'Enter NID or Birth Certificate number' },
        { bn: 'বায়োমেট্রিক যাচাই (ঐচ্ছিক)', en: 'Biometric verification (optional)' },
        { bn: 'সরকারি তথ্যভান্ডারে যাচাই', en: 'Verification with government database' }
      ]
    },
    {
      step: 3,
      icon: FileCheck,
      titleBn: 'সেবা নির্বাচন',
      titleEn: 'Select Service',
      descBn: '৫০+ সরকারি সেবা থেকে আপনার প্রয়োজনীয় সেবা বেছে নিন এবং স্বয়ংক্রিয় ফর্ম পূরণ করুন।',
      descEn: 'Choose from 50+ government services and fill auto-populated forms.',
      gradient: 'from-purple-500 to-pink-500',
      details: [
        { bn: 'সেবা তালিকা থেকে নির্বাচন করুন', en: 'Choose from service list' },
        { bn: 'স্বয়ংক্রিয় পূরণকৃত ফর্ম দেখুন', en: 'View auto-filled form' },
        { bn: 'প্রয়োজনীয় নথি আপলোড করুন', en: 'Upload required documents' }
      ]
    },
    {
      step: 4,
      icon: Bell,
      titleBn: 'ট্র্যাক করুন',
      titleEn: 'Track Progress',
      descBn: 'আবেদন জমা দিন এবং রিয়েল-টাইমে অগ্রগতি দেখুন। প্রতিটি ধাপে নোটিফিকেশন পাবেন।',
      descEn: 'Submit application and track progress in real-time. Get notifications at every step.',
      gradient: 'from-orange-500 to-red-500',
      details: [
        { bn: 'আবেদন জমা দিন', en: 'Submit application' },
        { bn: 'রিয়েল-টাইম স্ট্যাটাস দেখুন', en: 'View real-time status' },
        { bn: 'SMS ও অ্যাপ নোটিফিকেশন পান', en: 'Receive SMS and app notifications' }
      ]
    }
  ];

  const benefits = [
    {
      titleBn: 'একবার নিবন্ধন, সব সেবা',
      titleEn: 'Register Once, Access All',
      descBn: 'একবার পরিচয় নিবন্ধন করলে সব সরকারি সেবায় প্রবেশাধিকার পাবেন',
      descEn: 'Register your identity once to access all government services',
      icon: CheckCircle2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      titleBn: 'স্বয়ংক্রিয় ফর্ম পূরণ',
      titleEn: 'Auto-filled Forms',
      descBn: 'আপনার যাচাইকৃত তথ্য দিয়ে ফর্ম স্বয়ংক্রিয়ভাবে পূরণ হয়',
      descEn: 'Forms are automatically filled with your verified information',
      icon: FileCheck,
      color: 'from-green-500 to-emerald-500'
    },
    {
      titleBn: 'দ্রুত প্রসেসিং',
      titleEn: 'Fast Processing',
      descBn: 'ডিজিটাল যাচাইকরণের মাধ্যমে দ্রুত সেবা প্রাপ্তি',
      descEn: 'Faster service delivery through digital verification',
      icon: CheckCircle2,
      color: 'from-purple-500 to-pink-500'
    },
    {
      titleBn: '২৪/৭ প্রবেশাধিকার',
      titleEn: '24/7 Access',
      descBn: 'যেকোনো সময়, যেকোনো জায়গা থেকে সেবা পান',
      descEn: 'Access services anytime, from anywhere',
      icon: CheckCircle2,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-[rgb(var(--color-primary))] via-emerald-700 to-teal-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[rgb(var(--color-secondary))] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl sm:text-5xl md:text-6xl text-white mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t('কীভাবে কাজ করে?', 'How It Works?')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xl text-white/90 max-w-3xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t(
              'মাত্র ৪টি সহজ ধাপে পরিচয় ব্যবহার করে সকল সরকারি সেবা পান',
              'Get all government services using Porichoy in just 4 easy steps'
            )}
          </motion.p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Icon Side */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className={`w-48 h-48 rounded-3xl bg-linear-to-br ${step.gradient} flex items-center justify-center`}
                      style={{ boxShadow: 'var(--shadow-xl)' }}
                    >
                      <step.icon className="w-24 h-24 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white flex items-center justify-center"
                      style={{ boxShadow: 'var(--shadow-lg)' }}
                    >
                      <span className={`text-3xl font-bold text-[rgb(var(--color-primary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {language === 'bn' ? ['১', '২', '৩', '৪'][index] : step.step}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1">
                  <h2 className={`text-3xl sm:text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(step.titleBn, step.titleEn)}
                  </h2>
                  <p className={`text-lg text-[rgb(var(--color-text-secondary))] mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(step.descBn, step.descEn)}
                  </p>
                  <div className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full bg-linear-to-br ${step.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-[rgb(var(--color-text))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t(detail.bn, detail.en)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-linear-to-br from-gray-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('মূল সুবিধাসমূহ', 'Key Benefits')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('পরিচয় ব্যবহারে আপনি যে সুবিধা পাবেন', 'Benefits you get using Porichoy')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${benefit.color} flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
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

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('শুরু করতে প্রস্তুত?', 'Ready to Get Started?')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] mb-8 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আজই নিবন্ধন করুন এবং সহজ সরকারি সেবা উপভোগ করুন', 'Register today and enjoy easy government services')}
            </p>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-10 py-5 rounded-xl bg-linear-to-r from-[rgb(var(--color-primary))] to-emerald-600 text-white text-lg font-semibold inline-flex items-center gap-3 ${language === 'bn' ? 'font-bangla' : ''}`}
                style={{ boxShadow: 'var(--shadow-xl)' }}
              >
                {t('এখনই শুরু করুন', 'Get Started Now')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
