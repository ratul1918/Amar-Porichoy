import { Shield, Target, Eye, Heart, Users, Award, TrendingUp, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export function About() {
  const { t, language } = useLanguage();

  const mission = [
    {
      icon: Target,
      titleBn: 'আমাদের লক্ষ্য',
      titleEn: 'Our Mission',
      descBn: 'প্রতিটি বাংলাদেশীর জন্য একটি নিরাপদ, সহজ এবং একীভূত ডিজিটাল পরিচয় ব্যবস্থা তৈরি করা।',
      descEn: 'Create a secure, simple, and unified digital identity system for every Bangladeshi citizen.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Eye,
      titleBn: 'আমাদের দৃষ্টিভঙ্গি',
      titleEn: 'Our Vision',
      descBn: 'ডিজিটাল বাংলাদেশ গড়ে একটি অগ্রণী ভূমিকা পালন করা যেখানে প্রতিটি নাগরিক সহজেই সরকারি সেবা পাবে।',
      descEn: 'Play a pioneering role in building Digital Bangladesh where every citizen easily accesses government services.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      titleBn: 'আমাদের মূল্যবোধ',
      titleEn: 'Our Values',
      descBn: 'স্বচ্ছতা, নিরাপত্তা, সহজলভ্যতা এবং সবার জন্য সমান সুযোগ আমাদের মূল মূল্যবোধ।',
      descEn: 'Transparency, security, accessibility, and equal opportunities for all are our core values.',
      gradient: 'from-red-500 to-orange-500'
    }
  ];

  const achievements = [
    {
      icon: Users,
      numberBn: '১ কোটি+',
      numberEn: '10M+',
      labelBn: 'সক্রিয় ব্যবহারকারী',
      labelEn: 'Active Users',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      numberBn: '৫ কোটি+',
      numberEn: '50M+',
      labelBn: 'সম্পন্ন লেনদেন',
      labelEn: 'Completed Transactions',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Award,
      numberBn: '৫০+',
      numberEn: '50+',
      labelBn: 'একীভূত সেবা',
      labelEn: 'Integrated Services',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Lock,
      numberBn: '৯৯.৯%',
      numberEn: '99.9%',
      labelBn: 'সিস্টেম আপটাইম',
      labelEn: 'System Uptime',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-[rgb(var(--color-primary))] via-emerald-700 to-teal-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[rgb(var(--color-secondary))] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl text-white mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t('পরিচয় সম্পর্কে', 'About Porichoy')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl text-white/90 max-w-3xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t(
              'বাংলাদেশের জাতীয় ডিজিটাল পরিচয় প্ল্যাটফর্ম যা নাগরিকদের তথ্য এবং সরকারি সেবাসমূহকে একটি নিরাপদ ও সহজ ব্যবস্থায় একীভূত করে।',
              "Bangladesh's national digital identity platform that centralizes citizen information and government services into one secure and easy-to-use system."
            )}
          </motion.p>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${item.gradient} flex items-center justify-center mx-auto mb-6`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-2xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(item.titleBn, item.titleEn)}
                </h3>
                <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(item.descBn, item.descEn)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="py-20 bg-linear-to-br from-gray-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আমাদের অর্জন', 'Our Achievements')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('সংখ্যায় আমাদের প্রভাব', 'Our Impact in Numbers')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 text-center"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center mx-auto mb-6`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-4xl font-bold text-[rgb(var(--color-primary))] mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(item.numberBn, item.numberEn)}
                </div>
                <div className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(item.labelBn, item.labelEn)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl mb-8 text-center ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আমাদের গল্প', 'Our Story')}
            </h2>
            <div className={`space-y-6 text-lg text-[rgb(var(--color-text-secondary))] leading-relaxed ${language === 'bn' ? 'font-bangla' : ''}`}>
              <p>
                {t(
                  'পরিচয় ২০২০ সালে গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের ডিজিটাল বাংলাদেশ রূপকল্প ২০২১-এর অংশ হিসেবে যাত্রা শুরু করে। আমাদের উদ্দেশ্য ছিল নাগরিকদের জন্য সরকারি সেবা প্রাপ্তি সহজ এবং দ্রুততর করা।',
                  "Porichoy started its journey in 2020 as part of the Government of Bangladesh's Digital Bangladesh Vision 2021. Our goal was to make government services easier and faster for citizens."
                )}
              </p>
              <p>
                {t(
                  'প্রথম বছরেই আমরা ৫টি মূল সরকারি সেবা একীভূত করি এবং ১০ লক্ষ নাগরিক নিবন্ধিত হন। আজ, আমরা ৫০টিরও বেশি সরকারি সেবা প্রদান করি এবং ১ কোটিরও বেশি সক্রিয় ব্যবহারকারী রয়েছে।',
                  'In the first year, we integrated 5 core government services and registered 1 million citizens. Today, we provide over 50 government services and have more than 10 million active users.'
                )}
              </p>
              <p>
                {t(
                  'আমরা বিশ্বাস করি প্রযুক্তি সবার জন্য হওয়া উচিত। তাই আমরা বাংলা ভাষাকে প্রাধান্য দিয়ে এবং সহজ ব্যবহারযোগ্য ইন্টারফেস তৈরি করে গ্রাম ও শহরের সব মানুষের কাছে পৌঁছানোর চেষ্টা করছি।',
                  'We believe technology should be for everyone. That\'s why we prioritize the Bangla language and create easy-to-use interfaces to reach people in both rural and urban areas.'
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="py-20 bg-linear-to-br from-gray-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('নিরাপত্তা ও গোপনীয়তা', 'Security & Privacy')}
            </h2>
            <p className={`text-xl text-[rgb(var(--color-text-secondary))] max-w-3xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t(
                'আপনার তথ্যের নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। আমরা আন্তর্জাতিক মানের নিরাপত্তা ব্যবস্থা ব্যবহার করি।',
                'Your data security is our top priority. We use international standard security measures.'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('ডেটা এনক্রিপশন', 'Data Encryption')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t(
                  'আমরা ২৫৬-বিট AES এনক্রিপশন ব্যবহার করি যা ব্যাংক-স্তরের নিরাপত্তা প্রদান করে। আপনার সকল তথ্য সম্পূর্ণভাবে এনক্রিপ্টেড এবং সুরক্ষিত।',
                  'We use 256-bit AES encryption which provides bank-level security. All your information is fully encrypted and protected.'
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('গোপনীয়তা নিয়ন্ত্রণ', 'Privacy Control')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t(
                  'আপনার তথ্য শুধুমাত্র আপনার নিয়ন্ত্রণে। কোন তথ্য কোথায় ব্যবহৃত হবে তা আপনি নির্ধারণ করেন। আমরা আপনার অনুমতি ছাড়া কোনো তথ্য শেয়ার করি না।',
                  'Your information is only under your control. You decide where your data will be used. We never share your information without your permission.'
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
