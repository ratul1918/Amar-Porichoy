import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Shield, QrCode, Download, Share2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export function DigitalIDCard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Mock citizen data
  const citizenData = {
    name: user?.name || 'John Doe',
    nameBn: user?.nameBn || 'জন ডো',
    nid: '1234567890',
    dob: '01 Jan 1990',
    dobBn: '০১ জানুয়ারি ১৯৯০',
    bloodGroup: 'A+',
    phone: '+880 1712-345678',
    address: 'Dhaka, Bangladesh',
    addressBn: 'ঢাকা, বাংলাদেশ',
    photo: 'https://via.placeholder.com/150',
    issueDate: '15 Jan 2020',
    issueDateBn: '১৫ জানুয়ারি ২০২০'
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('ডিজিটাল পরিচয়পত্র', 'Digital Identity Card')}
          </h1>
          <p className={`text-lg text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আপনার ডিজিটাল জাতীয় পরিচয়পত্র', 'Your Digital National Identity Card')}
          </p>
        </motion.div>

        {/* ID Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative perspective-1000">
            <motion.div
              animate={{ rotateY: cardFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="relative preserve-3d"
              onClick={() => setCardFlipped(!cardFlipped)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <div 
                className={`${cardFlipped ? 'invisible' : 'visible'} aspect-[1.586/1] max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-8 text-white cursor-pointer`}
                style={{ 
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Bangladesh Flag Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="w-20 h-20 rounded-full bg-red-600 absolute top-6 left-6"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-5 h-5" />
                      <h2 className="text-xl font-bold font-bangla">গণপ্রজাতন্ত্রী বাংলাদেশ</h2>
                    </div>
                    <p className="text-xs text-white/70">People's Republic of Bangladesh</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Photo */}
                  <div className="col-span-1">
                    <div className="w-28 h-32 rounded-lg bg-gray-300 overflow-hidden border-4 border-white/20">
                      <img 
                        src="https://via.placeholder.com/150" 
                        alt="Citizen"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="col-span-2 space-y-3">
                    <div>
                      <p className="text-xs text-white/60 mb-1">{t('নাম', 'Name')}</p>
                      <p className={`text-lg font-semibold ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {language === 'bn' ? citizenData.nameBn : citizenData.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/60 mb-1">{t('NID নম্বর', 'NID Number')}</p>
                        <p className="text-sm font-mono">{citizenData.nid}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">{t('জন্ম তারিখ', 'Date of Birth')}</p>
                        <p className="text-sm">{language === 'bn' ? citizenData.dobBn : citizenData.dob}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/60 mb-1">{t('রক্তের গ্রুপ', 'Blood Group')}</p>
                        <p className="text-sm">{citizenData.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">{t('ইস্যু তারিখ', 'Issue Date')}</p>
                        <p className="text-sm">{language === 'bn' ? citizenData.issueDateBn : citizenData.issueDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-4 right-4 text-right">
                  <p className="text-xs text-white/50 mb-1">{t('ডিজিটাল স্বাক্ষর যাচাইকৃত', 'Digitally Signed & Verified')}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs text-green-400">{t('সক্রিয়', 'Active')}</span>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div 
                className={`${cardFlipped ? 'visible' : 'invisible'} absolute inset-0 aspect-[1.586/1] max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-8 text-white cursor-pointer`}
                style={{ 
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className={`text-lg mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('যোগাযোগ ও ঠিকানা', 'Contact & Address')}
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-white/60 mb-1">{t('মোবাইল', 'Mobile')}</p>
                        <p className="text-sm">{citizenData.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/60 mb-1">{t('ঠিকানা', 'Address')}</p>
                        <p className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {language === 'bn' ? citizenData.addressBn : citizenData.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className={`text-xs text-white/60 mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('QR কোড দিয়ে পরিচয় যাচাই করুন', 'Verify identity with QR code')}
                    </p>
                    <div className="w-32 h-32 bg-white rounded-xl p-2 mx-auto">
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <p className={`text-center mt-4 text-sm text-gray-500 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('কার্ড ঘুরাতে ক্লিক করুন', 'Click to flip card')}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <button className={`p-4 rounded-xl bg-white border border-gray-200 hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-all flex items-center justify-center gap-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
            <Download className="w-5 h-5" />
            {t('ডাউনলোড করুন', 'Download')}
          </button>
          
          <button 
            onClick={() => setShowQR(!showQR)}
            className={`p-4 rounded-xl bg-white border border-gray-200 hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-all flex items-center justify-center gap-3 ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            <QrCode className="w-5 h-5" />
            {t('QR কোড দেখুন', 'Show QR Code')}
          </button>
          
          <button className={`p-4 rounded-xl bg-white border border-gray-200 hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-all flex items-center justify-center gap-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
            <Share2 className="w-5 h-5" />
            {t('শেয়ার করুন', 'Share')}
          </button>
        </motion.div>

        {/* QR Code Section */}
        {showQR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 text-center"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <h3 className={`text-xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('পরিচয় যাচাইকরণ QR কোড', 'Identity Verification QR Code')}
            </h3>
            
            <div className="w-64 h-64 bg-white border-4 border-gray-200 rounded-2xl p-4 mx-auto mb-6">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center rounded-xl">
                <QrCode className="w-32 h-32 text-white" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 max-w-md mx-auto">
              <p className={`text-sm text-blue-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t(
                  'এই QR কোড স্ক্যান করে আপনার পরিচয় যাচাই করা যাবে। কোডটি ৫ মিনিটের জন্য বৈধ।',
                  'Scan this QR code to verify your identity. Code is valid for 5 minutes.'
                )}
              </p>
            </div>
          </motion.div>
        )}

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
        >
          <h3 className={`text-lg mb-4 flex items-center gap-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            <Shield className="w-5 h-5 text-green-600" />
            {t('নিরাপত্তা বৈশিষ্ট্য', 'Security Features')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-medium mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ডিজিটাল স্বাক্ষর', 'Digital Signature')}
                </p>
                <p className={`text-sm text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('সরকারি ডিজিটাল স্বাক্ষর দ্বারা যাচাইকৃত', 'Verified with government digital signature')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-medium mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('এনক্রিপ্টেড ডেটা', 'Encrypted Data')}
                </p>
                <p className={`text-sm text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('256-বিট এনক্রিপশন দিয়ে সুরক্ষিত', 'Protected with 256-bit encryption')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-medium mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('বায়োমেট্রিক যাচাই', 'Biometric Verification')}
                </p>
                <p className={`text-sm text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('মুখ ও আঙুলের ছাপ দিয়ে যাচাইকৃত', 'Verified with face and fingerprint')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-medium mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ব্লকচেইন সংরক্ষিত', 'Blockchain Secured')}
                </p>
                <p className={`text-sm text-gray-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ব্লকচেইনে সংরক্ষিত অপরিবর্তনীয় রেকর্ড', 'Immutable record stored on blockchain')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
