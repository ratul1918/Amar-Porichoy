import { CheckCircle2, Clock, AlertCircle, Package, Truck, FileCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export function Tracking() {
  const { t, language } = useLanguage();

  // Mock application data
  const applications = [
    {
      id: 'APP-2026-12345',
      titleBn: 'ই-পাসপোর্ট আবেদন',
      titleEn: 'e-Passport Application',
      submittedDate: '৫ ফেব্রুয়ারি ২০২৬',
      status: 'processing',
      currentStep: 2,
      steps: [
        { nameBn: 'আবেদন জমা', nameEn: 'Application Submitted', completed: true },
        { nameBn: 'যাচাইকরণ', nameEn: 'Verification', completed: true },
        { nameBn: 'প্রক্রিয়াধীন', nameEn: 'Processing', completed: false },
        { nameBn: 'সম্পন্ন', nameEn: 'Completed', completed: false }
      ]
    },
    {
      id: 'APP-2026-12344',
      titleBn: 'জন্ম নিবন্ধন সংশোধন',
      titleEn: 'Birth Certificate Correction',
      submittedDate: '২০ জানুয়ারি ২০২৬',
      status: 'completed',
      currentStep: 3,
      steps: [
        { nameBn: 'আবেদন জমা', nameEn: 'Application Submitted', completed: true },
        { nameBn: 'যাচাইকরণ', nameEn: 'Verification', completed: true },
        { nameBn: 'অনুমোদন', nameEn: 'Approval', completed: true },
        { nameBn: 'সম্পন্ন', nameEn: 'Completed', completed: true }
      ]
    },
    {
      id: 'APP-2026-12343',
      titleBn: 'ভোটার তালিকা নিবন্ধন',
      titleEn: 'Voter List Registration',
      submittedDate: '১০ জানুয়ারি ২০২৬',
      status: 'rejected',
      currentStep: 1,
      steps: [
        { nameBn: 'আবেদন জমা', nameEn: 'Application Submitted', completed: true },
        { nameBn: 'যাচাইকরণ ব্যর্থ', nameEn: 'Verification Failed', completed: false }
      ],
      rejectionReason: {
        bn: 'তথ্যে অসঙ্গতি পাওয়া গেছে। অনুগ্রহ করে সঠিক তথ্য দিয়ে পুনরায় আবেদন করুন।',
        en: 'Data inconsistency found. Please reapply with correct information.'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[rgb(var(--color-verified))] bg-[rgb(var(--color-verified-bg))]';
      case 'processing':
        return 'text-[rgb(var(--color-pending))] bg-[rgb(var(--color-pending-bg))]';
      case 'rejected':
        return 'text-[rgb(var(--color-error))] bg-[rgb(var(--color-error-bg))]';
      default:
        return 'text-[rgb(var(--color-text-light))] bg-[rgb(var(--color-bg))]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'processing':
        return Clock;
      case 'rejected':
        return AlertCircle;
      default:
        return Package;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return { bn: 'সম্পন্ন', en: 'Completed' };
      case 'processing':
        return { bn: 'প্রক্রিয়াধীন', en: 'Processing' };
      case 'rejected':
        return { bn: 'বাতিল', en: 'Rejected' };
      default:
        return { bn: 'অপেক্ষমাণ', en: 'Pending' };
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl sm:text-4xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আবেদন ট্র্যাকিং', 'Track Applications')}
          </h1>
          <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আপনার সকল আবেদনের অগ্রগতি দেখুন', 'View the progress of all your applications')}
          </p>
        </motion.div>

        {/* Applications List */}
        <div className="space-y-6">
          {applications.map((app, index) => {
            const StatusIcon = getStatusIcon(app.status);
            const statusText = getStatusText(app.status);
            const statusColor = getStatusColor(app.status);

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-[rgb(var(--color-border))]"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[rgb(var(--color-border))]">
                  <div>
                    <h3 className={`mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(app.titleBn, app.titleEn)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-secondary))]">
                      <span className={`${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t('আবেদন নম্বর:', 'Application ID:')} <span className="font-mono">{app.id}</span>
                      </span>
                      <span className={`${language === 'bn' ? 'font-bangla' : ''}`}>
                        {app.submittedDate}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColor}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(statusText.bn, statusText.en)}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="space-y-8">
                    {app.steps.map((step, stepIndex) => {
                      const isActive = stepIndex === app.currentStep;
                      const isCompleted = step.completed;
                      const isLast = stepIndex === app.steps.length - 1;

                      return (
                        <div key={stepIndex} className="relative flex gap-4">
                          {/* Timeline Line */}
                          {!isLast && (
                            <div
                              className={`absolute left-6 top-12 w-0.5 h-full -ml-px ${
                                isCompleted
                                  ? 'bg-[rgb(var(--color-verified))]'
                                  : 'bg-[rgb(var(--color-border))]'
                              }`}
                            />
                          )}

                          {/* Icon */}
                          <div className="relative z-10 shrink-0">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 + stepIndex * 0.1 }}
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-[rgb(var(--color-verified))]'
                                  : isActive
                                  ? 'bg-[rgb(var(--color-pending))] animate-pulse'
                                  : 'bg-[rgb(var(--color-bg))] border-2 border-[rgb(var(--color-border))]'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-white" />
                              ) : isActive ? (
                                <Clock className="w-6 h-6 text-white" />
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-[rgb(var(--color-border))]" />
                              )}
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-2">
                            <h4
                              className={`mb-1 ${
                                isCompleted || isActive
                                  ? 'text-[rgb(var(--color-text))]'
                                  : 'text-[rgb(var(--color-text-light))]'
                              } ${language === 'bn' ? 'font-bangla' : ''}`}
                            >
                              {t(step.nameBn, step.nameEn)}
                            </h4>
                            {isActive && (
                              <p className={`text-sm text-[rgb(var(--color-pending))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                                {t('বর্তমানে এই ধাপে আছে', 'Currently at this step')}
                              </p>
                            )}
                            {isCompleted && (
                              <p className={`text-sm text-[rgb(var(--color-verified))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                                {t('সম্পন্ন হয়েছে', 'Completed')}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rejection Reason */}
                {app.status === 'rejected' && app.rejectionReason && (
                  <div className="mt-6 p-4 rounded-xl bg-[rgb(var(--color-error-bg))] border border-[rgb(var(--color-error))]">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[rgb(var(--color-error))] shrink-0" />
                      <div>
                        <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t('বাতিলের কারণ', 'Rejection Reason')}
                        </h4>
                        <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t(app.rejectionReason.bn, app.rejectionReason.en)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Message */}
                {app.status === 'completed' && (
                  <div className="mt-6 p-4 rounded-xl bg-[rgb(var(--color-verified-bg))] border border-[rgb(var(--color-verified))]">
                    <div className="flex items-start gap-3">
                      <FileCheck className="w-5 h-5 text-[rgb(var(--color-verified))] shrink-0 mt-0.5" />
                      <div>
                        <h4 className={`text-sm mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t('আবেদন সফল', 'Application Successful')}
                        </h4>
                        <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                          {t(
                            'আপনার নথি প্রস্তুত। নিকটস্থ অফিস থেকে সংগ্রহ করুন।',
                            'Your document is ready. Collect from the nearest office.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 rounded-2xl bg-white border border-[rgb(var(--color-border))]"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <h3 className={`mb-3 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আবেদন সম্পর্কে প্রশ্ন?', 'Questions About Your Application?')}
          </h3>
          <p className={`text-sm text-[rgb(var(--color-text-secondary))] mb-4 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t(
              'যেকোনো সমস্যা বা প্রশ্নের জন্য হটলাইনে যোগাযোগ করুন: ৩৩৩',
              'For any issues or questions, contact the hotline: 333'
            )}
          </p>
          <div className="flex gap-3">
            <Truck className="w-5 h-5 text-[rgb(var(--color-accent))] shrink-0" />
            <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t(
                'সাধারণত আবেদন প্রক্রিয়া ৭-১৫ কার্যদিবস সময় নেয়',
                'Application processing usually takes 7-15 working days'
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
