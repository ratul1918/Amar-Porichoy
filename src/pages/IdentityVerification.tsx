import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  FileText, 
  Smartphone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Upload,
  Scan,
  Shield,
  AlertCircle,
  Eye,
  Loader2
} from 'lucide-react';

type VerificationStep = 'nid-scan' | 'selfie' | 'liveness' | 'phone' | 'email' | 'address' | 'complete';

export function IdentityVerification() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<VerificationStep>('nid-scan');
  const [completedSteps, setCompletedSteps] = useState<VerificationStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [nidData, setNidData] = useState<any>(null);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');

  const steps = [
    { id: 'nid-scan', icon: Scan, titleBn: 'NID স্ক্যান', titleEn: 'NID Scan', descBn: 'আপনার জাতীয় পরিচয়পত্র স্ক্যান করুন', descEn: 'Scan your National ID card' },
    { id: 'selfie', icon: Camera, titleBn: 'সেলফি', titleEn: 'Selfie', descBn: 'একটি সেলফি তুলুন', descEn: 'Take a selfie' },
    { id: 'liveness', icon: Eye, titleBn: 'লাইভনেস চেক', titleEn: 'Liveness Check', descBn: 'মুখ যাচাইকরণ', descEn: 'Face verification' },
    { id: 'phone', icon: Smartphone, titleBn: 'ফোন যাচাই', titleEn: 'Phone Verification', descBn: 'ফোন নম্বর নিশ্চিত করুন', descEn: 'Verify phone number' },
    { id: 'email', icon: Mail, titleBn: 'ইমেইল যাচাই', titleEn: 'Email Verification', descBn: 'ইমেইল নিশ্চিত করুন', descEn: 'Verify email' },
    { id: 'address', icon: MapPin, titleBn: 'ঠিকানা যাচাই', titleEn: 'Address Verification', descBn: 'ঠিকানা নিশ্চিত করুন', descEn: 'Verify address' },
  ];

  const handleNidScan = async (file: File) => {
    setLoading(true);
    // Simulate OCR processing
    setTimeout(() => {
      setNidData({
        nid: '1234567890',
        name: 'John Doe',
        nameBn: 'জন ডো',
        dob: '1990-01-01',
        address: 'Dhaka, Bangladesh'
      });
      setCompletedSteps([...completedSteps, 'nid-scan']);
      setCurrentStep('selfie');
      setLoading(false);
    }, 2000);
  };

  const handleSelfieCaptured = () => {
    setLoading(true);
    setTimeout(() => {
      setCompletedSteps([...completedSteps, 'selfie']);
      setCurrentStep('liveness');
      setLoading(false);
    }, 1500);
  };

  const handleLivenessCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setCompletedSteps([...completedSteps, 'liveness']);
      setCurrentStep('phone');
      setLoading(false);
    }, 2000);
  };

  const handlePhoneVerify = () => {
    if (phoneOtp.length === 6) {
      setLoading(true);
      setTimeout(() => {
        setCompletedSteps([...completedSteps, 'phone']);
        setCurrentStep('email');
        setLoading(false);
      }, 1000);
    }
  };

  const handleEmailVerify = () => {
    if (emailOtp.length === 6) {
      setLoading(true);
      setTimeout(() => {
        setCompletedSteps([...completedSteps, 'email']);
        setCurrentStep('address');
        setLoading(false);
      }, 1000);
    }
  };

  const handleAddressConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setCompletedSteps([...completedSteps, 'address']);
      setCurrentStep('complete');
      setLoading(false);
    }, 1000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'nid-scan':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Scan className="w-10 h-10 text-white" />
              </div>
              <h3 className={`text-2xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('আপনার NID স্ক্যান করুন', 'Scan Your NID')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('আপনার জাতীয় পরিচয়পত্রের ছবি আপলোড করুন', 'Upload a photo of your National ID card')}
              </p>
            </div>

            <div className="border-2 border-dashed border-[rgb(var(--color-border))] rounded-2xl p-12 text-center hover:border-[rgb(var(--color-accent))] transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="nid-upload"
                onChange={(e) => e.target.files && handleNidScan(e.target.files[0])}
              />
              <label htmlFor="nid-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--color-text-light))]" />
                <p className={`text-lg mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ফাইল নির্বাচন করুন বা টেনে আনুন', 'Select file or drag and drop')}
                </p>
                <p className={`text-sm text-[rgb(var(--color-text-light))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('JPG, PNG বা PDF (সর্বোচ্চ 5MB)', 'JPG, PNG or PDF (max 5MB)')}
                </p>
              </label>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm text-blue-900 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('নিশ্চিত করুন যে ছবিটি পরিষ্কার এবং সকল তথ্য পাঠযোগ্য।', 'Make sure the image is clear and all information is readable.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'selfie':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h3 className={`text-2xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('একটি সেলফি তুলুন', 'Take a Selfie')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('আপনার মুখ স্পষ্টভাবে দেখা যায় এমন একটি ছবি তুলুন', 'Take a clear photo showing your face')}
              </p>
            </div>

            <div className="aspect-square max-w-md mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
              <Camera className="w-24 h-24 text-gray-400" />
            </div>

            <button
              onClick={handleSelfieCaptured}
              className={`w-full py-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t('ছবি তুলুন', 'Capture Photo')}
            </button>
          </div>
        );

      case 'liveness':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className={`text-2xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('লাইভনেস চেক', 'Liveness Check')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('স্ক্রিনে নির্দেশনা অনুসরণ করুন', 'Follow the instructions on screen')}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <span className={language === 'bn' ? 'font-bangla' : ''}>
                    {t('ডানে মাথা ঘুরান', 'Turn head right')}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <span className={language === 'bn' ? 'font-bangla' : ''}>
                    {t('বামে মাথা ঘুরান', 'Turn head left')}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <span className={language === 'bn' ? 'font-bangla' : ''}>
                    {t('চোখ পিটপিট করুন', 'Blink eyes')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLivenessCheck}
              className={`w-full py-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t('যাচাইকরণ শুরু করুন', 'Start Verification')}
            </button>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className={`text-2xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('ফোন নম্বর যাচাই করুন', 'Verify Phone Number')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('আপনার ফোনে পাঠানো OTP কোড লিখুন', 'Enter the OTP code sent to your phone')}
              </p>
            </div>

            <div>
              <label className={`block mb-2 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('OTP কোড', 'OTP Code')}
              </label>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <button
              onClick={handlePhoneVerify}
              disabled={phoneOtp.length !== 6}
              className={`w-full py-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t('যাচাই করুন', 'Verify')}
            </button>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className={`text-2xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('ইমেইল যাচাই করুন', 'Verify Email')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('আপনার ইমেইলে পাঠানো OTP কোড লিখুন', 'Enter the OTP code sent to your email')}
              </p>
            </div>

            <div>
              <label className={`block mb-2 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('OTP কোড', 'OTP Code')}
              </label>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleEmailVerify}
              disabled={emailOtp.length !== 6}
              className={`w-full py-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t('যাচাই করুন', 'Verify')}
            </button>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className={`text-2xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('ঠিকানা নিশ্চিত করুন', 'Confirm Address')}
              </h3>
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('আপনার NID থেকে পাওয়া ঠিকানা নিশ্চিত করুন', 'Confirm the address from your NID')}
              </p>
            </div>

            {nidData && (
              <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                <p className={`text-sm text-gray-600 mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('ঠিকানা', 'Address')}
                </p>
                <p className={`text-lg ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {nidData.address}
                </p>
              </div>
            )}

            <button
              onClick={handleAddressConfirm}
              className={`w-full py-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t('নিশ্চিত করুন', 'Confirm')}
            </button>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <h3 className={`text-3xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('যাচাইকরণ সম্পন্ন!', 'Verification Complete!')}
            </h3>
            <p className={`text-lg text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
              {t('আপনার পরিচয় সফলভাবে যাচাই করা হয়েছে', 'Your identity has been successfully verified')}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {steps.map((step) => (
                <div key={step.id} className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(step.titleBn, step.titleEn)}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className={`w-full py-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
            >
              {t('ড্যাশবোর্ডে যান', 'Go to Dashboard')}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-[rgb(var(--color-bg))] to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id as VerificationStep);
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent
                        ? 'bg-[rgb(var(--color-primary))] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs mt-2 hidden sm:block ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t(step.titleBn, step.titleEn)}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-8 border border-[rgb(var(--color-border))]"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-[rgb(var(--color-primary))] animate-spin mx-auto mb-4" />
              <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('প্রক্রিয়াকরণ হচ্ছে...', 'Processing...')}
              </p>
            </div>
          ) : (
            renderStepContent()
          )}
        </motion.div>
      </div>
    </div>
  );
}
