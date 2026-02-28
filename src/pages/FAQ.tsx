import { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, CreditCard, FileText, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    {
      icon: HelpCircle,
      titleBn: 'সাধারণ প্রশ্ন',
      titleEn: 'General Questions',
      color: 'from-blue-500 to-cyan-500',
      faqs: [
        {
          questionBn: 'পরিচয় কী?',
          questionEn: 'What is Porichoy?',
          answerBn: 'পরিচয় হলো বাংলাদেশের জাতীয় ডিজিটাল পরিচয় প্ল্যাটফর্ম। এটি নাগরিকদের তথ্য এবং সরকারি সেবাসমূহকে একটি নিরাপদ ও সহজ ব্যবস্থায় একীভূত করে।',
          answerEn: 'Porichoy is Bangladesh\'s national digital identity platform. It centralizes citizen information and government services into one secure and easy-to-use system.'
        },
        {
          questionBn: 'পরিচয় ব্যবহার করতে কোন খরচ আছে কি?',
          questionEn: 'Is there any cost to use Porichoy?',
          answerBn: 'না, পরিচয়ে নিবন্ধন এবং অ্যাকাউন্ট ব্যবহার সম্পূর্ণ বিনামূল্যে। তবে কিছু সরকারি সেবার জন্য সরকার নির্ধারিত ফি প্রযোজ্য হতে পারে।',
          answerEn: 'No, registration and account usage on Porichoy is completely free. However, some government services may have government-mandated fees.'
        },
        {
          questionBn: 'কে কে পরিচয় ব্যবহার করতে পারবে?',
          questionEn: 'Who can use Porichoy?',
          answerBn: 'যেকোনো বাংলাদেশী নাগরিক যার জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন সনদ আছে তিনি পরিচয় ব্যবহার করতে পারবেন।',
          answerEn: 'Any Bangladeshi citizen who has a National ID card or Birth Certificate can use Porichoy.'
        },
        {
          questionBn: 'পরিচয়ে কয়টি সরকারি সেবা পাওয়া যায়?',
          questionEn: 'How many government services are available on Porichoy?',
          answerBn: 'বর্তমানে পরিচয়ে ৫০টিরও বেশি সরকারি সেবা পাওয়া যায় এবং নিয়মিত নতুন সেবা যোগ করা হচ্ছে।',
          answerEn: 'Currently, more than 50 government services are available on Porichoy, and new services are regularly being added.'
        }
      ]
    },
    {
      icon: Shield,
      titleBn: 'নিরাপত্তা ও গোপনীয়তা',
      titleEn: 'Security & Privacy',
      color: 'from-green-500 to-emerald-500',
      faqs: [
        {
          questionBn: 'আমার তথ্য কতটা সুরক্ষিত?',
          questionEn: 'How secure is my data?',
          answerBn: 'আমরা ২৫৬-বিট AES এনক্রিপশন ব্যবহার করি যা ব্যাংক-স্তরের নিরাপত্তা প্রদান করে। আপনার সকল তথ্য সম্পূর্ণভাবে এনক্রিপ্টেড এবং সরকারি সার্ভারে সুরক্ষিত।',
          answerEn: 'We use 256-bit AES encryption which provides bank-level security. All your information is fully encrypted and secured on government servers.'
        },
        {
          questionBn: 'আমার তথ্য কি অন্য কারো সাথে শেয়ার করা হয়?',
          questionEn: 'Is my information shared with others?',
          answerBn: 'না, আপনার অনুমতি ছাড়া আমরা কখনো আপনার তথ্য অন্য কারো সাথে শেয়ার করি না। আপনি সম্পূর্ণভাবে নিয়ন্ত্রণ করেন কোন তথ্য কোথায় ব্যবহৃত হবে।',
          answerEn: 'No, we never share your information with others without your permission. You have complete control over where your information is used.'
        },
        {
          questionBn: 'পাসওয়ার্ড ভুলে গেলে কী করব?',
          questionEn: 'What if I forget my password?',
          answerBn: 'লগইন পেজে "পাসওয়ার্ড ভুলে গেছেন?" অপশনে ক্লিক করুন। আপনার নিবন্ধিত মোবাইলে OTP পাঠিয়ে নতুন পাসওয়ার্ড সেট করতে পারবেন।',
          answerEn: 'Click on "Forgot Password?" on the login page. You can set a new password by verifying OTP sent to your registered mobile number.'
        }
      ]
    },
    {
      icon: CreditCard,
      titleBn: 'অ্যাকাউন্ট ও নিবন্ধন',
      titleEn: 'Account & Registration',
      color: 'from-purple-500 to-pink-500',
      faqs: [
        {
          questionBn: 'কীভাবে নিবন্ধন করব?',
          questionEn: 'How do I register?',
          answerBn: '"লগইন/নিবন্ধন" বাটনে ক্লিক করুন, আপনার মোবাইল নম্বর দিন, OTP যাচাই করুন এবং পাসওয়ার্ড সেট করুন। তারপর জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন নম্বর দিয়ে পরিচয় যাচাই করুন।',
          answerEn: 'Click "Login/Register", enter your mobile number, verify OTP and set password. Then verify your identity with National ID or Birth Certificate number.'
        },
        {
          questionBn: 'একাধিক অ্যাকাউন্ট তৈরি করতে পারব কি?',
          questionEn: 'Can I create multiple accounts?',
          answerBn: 'না, প্রতি নাগরিকের জন্য শুধুমাত্র একটি পরিচয় অ্যাকাউন্ট অনুমোদিত। এটি আপনার জাতীয় পরিচয়পত্রের সাথে যুক্ত থাকে।',
          answerEn: 'No, only one Porichoy account is allowed per citizen. It is linked to your National ID.'
        },
        {
          questionBn: 'মোবাইল নম্বর পরিবর্তন করতে পারব কি?',
          questionEn: 'Can I change my mobile number?',
          answerBn: 'হ্যাঁ, আপনার ড্যাশবোর্ডের প্রোফাইল সেটিংস থেকে মোবাইল নম্বর পরিবর্তন করতে পারবেন। নতুন নম্বরে OTP যাচাইকরণ প্রয়োজন হবে।',
          answerEn: 'Yes, you can change your mobile number from Profile Settings in your dashboard. OTP verification on the new number will be required.'
        }
      ]
    },
    {
      icon: FileText,
      titleBn: 'সেবা ও আবেদন',
      titleEn: 'Services & Applications',
      color: 'from-orange-500 to-red-500',
      faqs: [
        {
          questionBn: 'আবেদন কতদিনে প্রসেস হয়?',
          questionEn: 'How long does application processing take?',
          answerBn: 'প্রতিটি সেবার প্রসেসিং সময় ভিন্ন। সাধারণত ৭-১৫ কর্মদিবসের মধ্যে বেশিরভাগ আবেদন প্রসেস হয়। আবেদন ট্র্যাকিং পেজে বিস্তারিত সময়সীমা দেখতে পারবেন।',
          answerEn: 'Processing time varies by service. Most applications are processed within 7-15 working days. You can see detailed timeline on the application tracking page.'
        },
        {
          questionBn: 'আবেদনে ভুল হলে কী করব?',
          questionEn: 'What if there is an error in my application?',
          answerBn: 'আবেদন জমা দেওয়ার পর "আবেদন ট্র্যাকিং" পেজে গিয়ে সংশোধনের জন্য অনুরোধ করতে পারবেন। অনুমোদিত হলে ফর্ম সংশোধন করতে পারবেন।',
          answerEn: 'After submitting, go to "Application Tracking" page and request for correction. If approved, you can edit the form.'
        },
        {
          questionBn: 'কোন নথিপত্র প্রয়োজন?',
          questionEn: 'What documents are required?',
          answerBn: 'প্রতিটি সেবার জন্য প্রয়োজনীয় নথির তালিকা সেবা নির্বাচন করার সময় দেখানো হবে। সাধারণত জাতীয় পরিচয়পত্র, ছবি এবং সেবা-নির্দিষ্ট নথি লাগে।',
          answerEn: 'Required documents list is shown when selecting a service. Generally, National ID, photo, and service-specific documents are needed.'
        }
      ]
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
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl text-white mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t('সাধারণ জিজ্ঞাসা', 'Frequently Asked Questions')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl text-white/90 max-w-3xl mx-auto ${language === 'bn' ? 'font-bangla' : ''}`}
          >
            {t('পরিচয় সম্পর্কে প্রায়শই জিজ্ঞাসিত প্রশ্নের উত্তর', 'Answers to commonly asked questions about Porichoy')}
          </motion.p>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="py-20 bg-linear-to-br from-gray-50 via-white to-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className={`text-3xl ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(category.titleBn, category.titleEn)}
                  </h2>
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 10 + faqIndex;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <motion.div
                        key={faqIndex}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: faqIndex * 0.05 }}
                        className="bg-white rounded-2xl overflow-hidden border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] transition-colors"
                        style={{ boxShadow: 'var(--shadow-sm)' }}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                        >
                          <span className={`font-medium text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                            {t(faq.questionBn, faq.questionEn)}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className={`px-6 pb-5 text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                                {t(faq.answerBn, faq.answerEn)}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-[rgb(var(--color-primary))] to-emerald-600 rounded-3xl p-8 sm:p-12 text-center text-white"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className={`text-3xl mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আরও সাহায্য প্রয়োজন?', 'Need More Help?')}
            </h2>
            <p className={`text-white/90 mb-8 text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t(
                'আপনার প্রশ্নের উত্তর না পেলে আমাদের সাপোর্ট টিমে যোগাযোগ করুন',
                'If you didn\'t find your answer, contact our support team'
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className={`flex items-center gap-2 text-white ${language === 'bn' ? 'font-bangla' : ''}`}>
                <Phone className="w-5 h-5" />
                <span>১৬৩৩৩</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className={`flex items-center gap-2 text-white ${language === 'bn' ? 'font-bangla' : ''}`}>
                <span>support@porichoy.gov.bd</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
