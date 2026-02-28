import { Plane, Heart, ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export function Portals() {
  const { t, language } = useLanguage();

  const portals = [
    {
      id: 'hajj-umrah',
      titleBn: 'হজ ও উমরাহ',
      titleEn: 'Hajj & Umrah',
      descBn: 'পবিত্র যাত্রার সম্পূর্ণ প্রস্তুতি ও নির্দেশনা',
      descEn: 'Complete preparation and guidance for the sacred journey',
      icon: Heart,
      link: '/hajj-umrah',
      gradient: 'from-amber-500 to-orange-600',
      dotColor: '#f59e0b',
      btnColor: '#f97316',
      image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&q=80&w=1000",
      featuresBn: ['নিবন্ধন', 'ভিসা প্রসেসিং', 'স্বাস্থ্য নির্দেশিকা'],
      featuresEn: ['Registration', 'Visa Processing', 'Health Guidelines']
    },
    {
      id: 'going-abroad',
      titleBn: 'বিদেশে যাত্রা',
      titleEn: 'Going Abroad',
      descBn: 'ভিসা, পাসপোর্ট ও ভ্রমণের সব তথ্য',
      descEn: 'All information regarding visa, passport and travel',
      icon: Plane,
      link: '/going-abroad',
      gradient: 'from-blue-600 to-indigo-600',
      dotColor: '#3b82f6',
      btnColor: '#2563eb',
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
      featuresBn: ['পাসপোর্ট চেক', 'ভিসা গাইড', 'জনশক্তি ছাড়পত্র'],
      featuresEn: ['Passport Check', 'Visa Guide', 'Manpower Clearance']
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-[#006A4E] via-emerald-700 to-teal-800 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-teal-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6"
          >
            <Compass className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t('সেবা পোর্টাল', 'Service Portals')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl text-white/90 max-w-3xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t(
              'আপনার গন্তব্যের সঠিক দিশারী - সব নির্দেশনা এক জায়গায়',
              'Your guide to the right destination - all instructions in one place'
            )}
          </motion.p>
        </div>
      </div>

      {/* Portals Grid */}
      <div className="relative py-20">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="group"
            >
              <Link to={portal.link}>
                <div className="relative h-full bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-[#006A4E]/20 hover:-translate-y-3">
                  {/* Image Header */}
                  <div className="relative h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-linear-to-br ${portal.gradient} opacity-90 group-hover:opacity-80 transition-opacity z-10`} />
                    <img 
                      src={portal.image} 
                      alt={language === 'bn' ? portal.titleBn : portal.titleEn}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/35 transition-all duration-300 shadow-lg">
                        <portal.icon className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                      <h2 className={`text-3xl font-bold mb-2 drop-shadow-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t(portal.titleBn, portal.titleEn)}
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className={`text-gray-800 text-lg mb-8 font-medium ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(portal.descBn, portal.descEn)}
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      {(language === 'bn' ? portal.featuresBn : portal.featuresEn).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-900 transition-colors">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: portal.dotColor }} />
                          <span className={`font-semibold ${language === 'bn' ? 'font-bangla' : ''}`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      className={`w-full py-4 rounded-xl text-white transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg hover:opacity-90 ${language === 'bn' ? 'font-bangla' : ''}`}
                      style={{ backgroundColor: portal.btnColor }}
                    >
                      {t('বিস্তারিত দেখুন', 'Explore Details')}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
