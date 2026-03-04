import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, User, CreditCard, ArrowRight, Info, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Login() {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<'birth' | 'nid' | 'admin' | null>(null);
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (idNumber.trim()) {
        // Generate user data based on ID number for demo
        // In production, this would fetch from backend
        const idHash = idNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const firstNames = ['Karim', 'Rahman', 'Hossain', 'Ahmed', 'Ali', 'Rashid', 'Farhan', 'Imran'];
        const lastNames = ['Khan', 'Uddin', 'Mia', 'Chowdhury', 'Islam', 'Haque', 'Sheikh', 'Alam'];
        const firstNamesBn = ['করিম', 'রহমান', 'হোসেন', 'আহমেদ', 'আলী', 'রশিদ', 'ফারহান', 'ইমরান'];
        const lastNamesBn = ['খান', 'উদ্দিন', 'মিয়া', 'চৌধুরী', 'ইসলাম', 'হক', 'শেখ', 'আলম'];
        
        const firstName = firstNames[idHash % firstNames.length];
        const lastName = lastNames[(idHash + 1) % lastNames.length];
        const firstNameBn = firstNamesBn[idHash % firstNamesBn.length];
        const lastNameBn = lastNamesBn[(idHash + 1) % lastNamesBn.length];
        
        const mockUser = {
          id: 'citizen-' + idNumber.slice(0, 6),
          name: `${firstName} ${lastName}`,
          nameBn: `${firstNameBn} ${lastNameBn}`,
          role: 'citizen' as const,
          isVerified: true,
          nid: method === 'nid' ? idNumber : undefined,
          birthRegNumber: method === 'birth' ? idNumber : undefined,
          phone: '+880 17' + idNumber.slice(0, 8),
          permissions: []
        };
        login(mockUser, 'mock-token-' + Date.now());
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Client-side admin authentication (demo mode)
      // In production, this should validate against the backend
      if (email === 'admin@gmail.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin-001',
          email: 'admin@gmail.com',
          name: 'System Administrator',
          nameBn: 'সিস্টেম প্রশাসক',
          role: 'admin' as const,
          isVerified: true,
          permissions: ['all']
        };
        
        login(adminUser, 'admin-demo-token');
        navigate('/admin');
      } else {
        setError(t('ভুল ইমেইল বা পাসওয়ার্ড', 'Invalid email or password'));
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(t('লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--color-bg))] via-white to-[rgb(var(--color-accent-light))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className={`text-3xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('পরিচয়ে স্বাগতম', 'Welcome to Porichoy')}
          </h1>
          <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('আপনার পরিচয় দিয়ে প্রবেশ করুন', 'Sign in with your identity')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl p-8 border border-[rgb(var(--color-border))]"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {!method ? (
            <>
              <h2 className={`text-center mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('লগইন পদ্ধতি নির্বাচন করুন', 'Choose Login Method')}
              </h2>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMethod('birth')}
                  className="w-full p-6 rounded-xl border-2 border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-colors text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[rgb(var(--color-accent-light))] flex items-center justify-center group-hover:bg-[rgb(var(--color-accent))] transition-colors">
                      <User className="w-6 h-6 text-[rgb(var(--color-accent))] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t('জন্ম নিবন্ধন নম্বর', 'Birth Registration Number')}
                      </h3>
                      <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t('১৭ সংখ্যার জন্ম নিবন্ধন নম্বর দিয়ে', 'Use your 17-digit birth registration number')}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[rgb(var(--color-text-light))] group-hover:text-[rgb(var(--color-accent))] transition-colors" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMethod('nid')}
                  className="w-full p-6 rounded-xl border-2 border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-colors text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[rgb(var(--color-accent-light))] flex items-center justify-center group-hover:bg-[rgb(var(--color-accent))] transition-colors">
                      <CreditCard className="w-6 h-6 text-[rgb(var(--color-accent))] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t('জাতীয় পরিচয়পত্র (NID)', 'National ID Card (NID)')}
                      </h3>
                      <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t('১০ বা ১৭ সংখ্যার NID নম্বর দিয়ে', 'Use your 10 or 17-digit NID number')}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[rgb(var(--color-text-light))] group-hover:text-[rgb(var(--color-accent))] transition-colors" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMethod('admin')}
                  className="w-full p-6 rounded-xl border-2 border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-colors text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[rgb(var(--color-accent-light))] flex items-center justify-center group-hover:bg-[rgb(var(--color-accent))] transition-colors">
                      <Lock className="w-6 h-6 text-[rgb(var(--color-accent))] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t('অ্যাডমিন লগইন', 'Admin Login')}
                      </h3>
                      <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {t('অ্যাডমিন একাউন্ট দিয়ে প্রবেশ করুন', 'Sign in with admin account')}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[rgb(var(--color-text-light))] group-hover:text-[rgb(var(--color-accent))] transition-colors" />
                  </div>
                </motion.button>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent))]">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-[rgb(var(--color-accent))] flex-shrink-0 mt-0.5" />
                  <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(
                      'প্রথমবার? আপনার জন্ম নিবন্ধন বা NID নম্বর দিয়ে নিবন্ধন করুন। আমরা আপনার তথ্য যাচাই করব।',
                      'First time? Register with your Birth Registration or NID number. We will verify your information.'
                    )}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={method === 'admin' ? handleAdminLogin : handleLogin}
            >
              <button
                type="button"
                onClick={() => setMethod(null)}
                className={`text-sm text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-primary))] mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                ← {t('ফিরে যান', 'Go back')}
              </button>

              {method === 'admin' ? (
                <>
                  <div className="mb-6">
                    <label className={`block mb-2 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('ইমেইল', 'Email')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@example.com"
                      className={`w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${language === 'bn' ? 'font-bangla' : ''}`}
                    />
                  </div>

                  <div className="mb-6">
                    <label className={`block mb-2 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {t('পাসওয়ার্ড', 'Password')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className={`w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${language === 'bn' ? 'font-bangla' : ''}`}
                    />
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <label className={`block mb-2 text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {method === 'birth'
                      ? t('জন্ম নিবন্ধন নম্বর', 'Birth Registration Number')
                      : t('জাতীয় পরিচয়পত্র নম্বর', 'National ID Number')}
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder={method === 'birth' ? '12345678901234567' : '1234567890'}
                    className={`w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${language === 'bn' ? 'font-bangla' : ''}`}
                    maxLength={method === 'birth' ? 17 : 17}
                  />
                  <p className={`mt-2 text-xs text-[rgb(var(--color-text-light))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {method === 'birth'
                      ? t('১৭ সংখ্যার জন্ম নিবন্ধন নম্বর লিখুন', 'Enter your 17-digit birth registration number')
                      : t('১০ বা ১৭ সংখ্যার NID নম্বর লিখুন', 'Enter your 10 or 17-digit NID number')}
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full py-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white transition-colors ${language === 'bn' ? 'font-bangla' : ''}`}
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                {t('প্রবেশ করুন', 'Sign In')}
              </motion.button>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-[rgb(var(--color-error-bg))] border border-[rgb(var(--color-error))]">
                  <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {error}
                  </p>
                </div>
              )}

              {method !== 'admin' && (
                <div className="mt-6 p-4 rounded-xl bg-[rgb(var(--color-pending-bg))] border border-[rgb(var(--color-pending))]">
                  <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t(
                      'এটি একটি ডেমো। যেকোনো নম্বর লিখুন এবং প্রবেশ করুন।',
                      'This is a demo. Enter any number to sign in.'
                    )}
                  </p>
                </div>
              )}
            </motion.form>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-center mt-6 text-sm text-[rgb(var(--color-text-light))] ${language === 'bn' ? 'font-bangla' : ''}`}
        >
          {t(
            'সমস্যা হলে আপনার নিকটস্থ ইউনিয়ন ডিজিটাল সেন্টারে যোগাযোগ করুন',
            'For help, visit your nearest Union Digital Center'
          )}
        </motion.p>
      </div>
    </div>
  );
}