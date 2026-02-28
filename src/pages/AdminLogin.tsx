import { useState, useId, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, AlertCircle, Eye, EyeOff, Lock, Mail, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error: authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const emailFieldId = useId();
  const pwdFieldId = useId();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const activeError = authError || submitError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');

    // Validation
    if (!email.trim()) {
      setSubmitError('Email is required');
      return;
    }
    if (!password) {
      setSubmitError('Password is required');
      return;
    }

    await login({
      method: 'email',
      idNumber: '',
      dateOfBirth: '',
      email: email.trim().toLowerCase(),
      password,
    });
  }

  function fillDemoCredentials() {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setShowCredentials(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--color-primary))]/5 via-white to-[rgb(var(--color-accent))]/5 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[rgb(var(--color-primary))] hover:opacity-70 transition mb-4 font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Go Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center mx-auto mb-3">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Admin Login</h1>
          <p className="text-sm text-gray-500">Restricted access — staff only</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white rounded-xl p-4 border border-[rgb(var(--color-border))]"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {/* Error Banner */}
          {activeError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 flex-shrink-0" />
              <p className="text-xs">{activeError}</p>
            </motion.div>
          )}

          {/* Show Credentials Info */}
          {showCredentials && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-xs font-semibold text-blue-900 mb-1.5">Demo Credentials:</p>
              <div className="space-y-1">
                <p className="text-xs text-blue-800">
                  Email: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono">admin@gmail.com</code>
                </p>
                <p className="text-xs text-blue-800">
                  Password: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono">admin123</code>
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Email Field */}
            <div>
              <label htmlFor={emailFieldId} className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id={emailFieldId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-3 py-2 text-sm bg-gray-50 border border-[rgb(var(--color-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent focus:bg-white transition"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor={pwdFieldId} className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id={pwdFieldId}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-10 py-2 text-sm bg-gray-50 border border-[rgb(var(--color-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent focus:bg-white transition"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo Credentials Button */}
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-xs text-[rgb(var(--color-primary))] hover:underline font-medium mt-1"
            >
              {showCredentials ? 'Hide' : 'Show'} demo credentials
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Quick Fill Button */}
            <button
              type="button"
              onClick={fillDemoCredentials}
              disabled={isLoading}
              className="w-full py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Use Demo Credentials
            </button>
          </form>
        </motion.div>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-600 mt-4">
          Citizen login?{' '}
          <a href="/login" className="text-[rgb(var(--color-primary))] hover:underline font-semibold">
            Go to citizen portal
          </a>
        </p>
      </div>
    </div>
  );
}
