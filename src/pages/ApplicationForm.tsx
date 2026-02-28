import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { Lock, CheckCircle2, Edit3, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export function ApplicationForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  // Mock verified data (locked fields)
  const verifiedData = {
    nameBn: 'রহিম আহমেদ',
    nameEn: 'Rahim Ahmed',
    fatherNameBn: 'করিম আহমেদ',
    motherNameBn: 'সালমা বেগম',
    dateOfBirth: '১৫/০১/১৯৯০',
    nid: '1234567890'
  };

  // Editable fields (example)
  const [formData, setFormData] = useState({
    phone: '+880 1712-345678',
    email: 'rahim.ahmed@example.com',
    addressBn: 'গ্রাম: রামপুর, ডাকঘর: মিরপুর',
    passportType: '',
    deliveryMethod: ''
  });

  const serviceTitles: Record<string, { bn: string; en: string }> = {
    'birth-certificate': { bn: 'জন্ম নিবন্ধন সংশোধন', en: 'Birth Certificate Correction' },
    'nid-registration': { bn: 'জাতীয় পরিচয়পত্র নিবন্ধন', en: 'National ID Registration' },
    'e-passport': { bn: 'ই-পাসপোর্ট আবেদন', en: 'e-Passport Application' },
    'voter-list': { bn: 'ভোটার তালিকা নিবন্ধন', en: 'Voter List Registration' },
    'family-certificate': { bn: 'পরিবার সনদপত্র', en: 'Family Certificate' },
    'tax-certificate': { bn: 'ট্যাক্স সনদপত্র', en: 'Tax Certificate' }
  };

  const currentService = serviceTitles[serviceId || ''] || { bn: 'সেবা', en: 'Service' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg))] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl p-8 text-center border border-[rgb(var(--color-border))]" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-[rgb(var(--color-verified-bg))] flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-[rgb(var(--color-verified))]" />
            </motion.div>
            <h2 className={`text-2xl mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আবেদন সফল হয়েছে!', 'Application Submitted!')}
            </h2>
            <p className={`text-[rgb(var(--color-text-secondary))] mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t(
                'আপনার আবেদন গৃহীত হয়েছে। আবেদন নম্বর: APP-2026-12345',
                'Your application has been received. Application number: APP-2026-12345'
              )}
            </p>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/tracking')}
                className={`w-full py-3 px-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {t('আবেদন ট্র্যাক করুন', 'Track Application')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className={`w-full py-3 px-4 rounded-xl border-2 border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {t('ড্যাশবোর্ডে ফিরুন', 'Back to Dashboard')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/services')}
            className={`flex items-center gap-2 text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-primary))] mb-4 transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('সেবা তালিকায় ফিরুন', 'Back to Services')}
          </button>
          <h1 className={`text-3xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t(currentService.bn, currentService.en)}
          </h1>
          <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আবেদন ফর্ম পূরণ করুন', 'Fill out the application form')}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verified Data Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-[rgb(var(--color-border))]"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-[rgb(var(--color-verified))]" />
              <h2 className={`${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('যাচাইকৃত তথ্য', 'Verified Information')}
              </h2>
            </div>
            <p className={`text-sm text-[rgb(var(--color-text-secondary))] mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('এই তথ্যগুলো আপনার পরিচয় থেকে স্বয়ংক্রিয়ভাবে পূরণ হয়েছে', 'This information was automatically filled from your profile')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('পুরো নাম (বাংলা)', 'Full Name (Bangla)')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verifiedData.nameBn}
                    disabled
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-verified-bg))] text-[rgb(var(--color-text))] font-bangla"
                  />
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-verified))]" />
                </div>
              </div>

              <div className="relative">
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('পুরো নাম (ইংরেজি)', 'Full Name (English)')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verifiedData.nameEn}
                    disabled
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-verified-bg))] text-[rgb(var(--color-text))]"
                  />
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-verified))]" />
                </div>
              </div>

              <div className="relative">
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('পিতার নাম', "Father's Name")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verifiedData.fatherNameBn}
                    disabled
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-verified-bg))] text-[rgb(var(--color-text))] font-bangla"
                  />
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-verified))]" />
                </div>
              </div>

              <div className="relative">
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('মাতার নাম', "Mother's Name")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verifiedData.motherNameBn}
                    disabled
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-verified-bg))] text-[rgb(var(--color-text))] font-bangla"
                  />
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-verified))]" />
                </div>
              </div>

              <div className="relative">
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('জন্ম তারিখ', 'Date of Birth')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verifiedData.dateOfBirth}
                    disabled
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-verified-bg))] text-[rgb(var(--color-text))] font-bangla"
                  />
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-verified))]" />
                </div>
              </div>

              <div className="relative">
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('জাতীয় পরিচয়পত্র', 'National ID')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verifiedData.nid}
                    disabled
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-verified-bg))] text-[rgb(var(--color-text))]"
                  />
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-verified))]" />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent))]">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[rgb(var(--color-accent))] shrink-0" />
                <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t(
                    'তথ্যে ভুল থাকলে ড্যাশবোর্ড থেকে সংশোধন করুন',
                    'If any information is incorrect, correct it from your dashboard'
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Editable Fields Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-[rgb(var(--color-border))]"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Edit3 className="w-5 h-5 text-[rgb(var(--color-accent))]" />
              <h2 className={`${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('অতিরিক্ত তথ্য', 'Additional Information')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('মোবাইল নম্বর', 'Mobile Number')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent"
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ইমেইল', 'Email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('বর্তমান ঠিকানা', 'Current Address')} *
                </label>
                <textarea
                  value={formData.addressBn}
                  onChange={(e) => setFormData({ ...formData, addressBn: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${language === 'bn' ? 'font-bangla' : ''}`}
                />
              </div>

              {serviceId === 'e-passport' && (
                <>
                  <div>
                    <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('পাসপোর্ট ধরন', 'Passport Type')} *
                    </label>
                    <select
                      value={formData.passportType}
                      onChange={(e) => setFormData({ ...formData, passportType: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${language === 'bn' ? 'font-bangla' : ''}`}
                    >
                      <option value="">{t('নির্বাচন করুন', 'Select')}</option>
                      <option value="regular">{t('সাধারণ', 'Regular')}</option>
                      <option value="official">{t('সরকারি', 'Official')}</option>
                      <option value="diplomatic">{t('কূটনৈতিক', 'Diplomatic')}</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('ডেলিভারি পদ্ধতি', 'Delivery Method')} *
                    </label>
                    <select
                      value={formData.deliveryMethod}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${language === 'bn' ? 'font-bangla' : ''}`}
                    >
                      <option value="">{t('নির্বাচন করুন', 'Select')}</option>
                      <option value="collect">{t('সংগ্রহ করব', 'Collect from office')}</option>
                      <option value="courier">{t('কুরিয়ার', 'Courier delivery')}</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`flex-1 py-4 px-6 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors flex items-center justify-center gap-2 ${language === 'bn' ? 'font-bangla' : ''}`}
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              {t('জমা দিন', 'Submit Application')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
