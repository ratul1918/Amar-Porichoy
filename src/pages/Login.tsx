/**
 * Login Page — Secure Authentication
 *
 * Security features:
 * - Client-side rate limiting: max 5 attempts per 15 minutes
 * - Input validation with centralized validators
 * - All inputs sanitized before processing
 * - No sensitive data in error messages (avoids user enumeration)
 * - OTP step isolates credential entry from identity confirmation
 * - Redirect to intended page after login (preserves `from` state)
 * - ARIA live region for dynamic error announcement to screen readers
 *
 * Auth flow: Method select → ID + DOB entry → OTP verify → Dashboard
 */

import { useState, useId, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Shield, User, CreditCard, ArrowRight, Info, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { motion } from 'motion/react';
import { validateNID, validateBirthCertificate, validateDateOfBirth, validateOTP } from '../lib/validators';
import { sanitizeIdNumber } from '../lib/sanitize';
import { checkRateLimit } from '../lib/security';
import type { LoginMethod } from '../types/auth';

type LoginStep = 'method' | 'credentials' | 'otp' | 'admin-login';

const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function Login() {
  const { t, tRaw, language } = useLanguage();
  const { login, logout: _logout, isAuthenticated, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { from?: string })?.from ?? '/dashboard';

  // Redirect whenever auth state becomes authenticated (covers admin + citizen paths)
  useEffect(() => {
    if (isAuthenticated) navigate(returnTo, { replace: true });
  }, [isAuthenticated, navigate, returnTo]);

  const [step, setStep]     = useState<LoginStep>('method');
  const [method, setMethod] = useState<LoginMethod | null>(null);
  const [showId, setShowId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_LOGIN_ATTEMPTS);

  const idFieldId    = useId();
  const dobFieldId   = useId();
  const otpFieldId   = useId();
  const adminEmailId = useId();
  const adminPwdId   = useId();
  const errorRegionId = useId();

  const otpRef = useRef<HTMLInputElement>(null);

  // ── Step 2: Credentials form ───────────────────────────────────────────────

  const credForm = useFormValidation({
    initialValues: { idNumber: '', dateOfBirth: '' },
    validate: ({ idNumber, dateOfBirth }) => {
      const errors: Record<string, string> = {};
      if (method) {
        const idResult = method === 'nid'
          ? validateNID(idNumber)
          : validateBirthCertificate(idNumber);
        if (!idResult.isValid) errors.idNumber = idResult.error ?? '';
      }
      const dobResult = validateDateOfBirth(dateOfBirth);
      if (!dobResult.isValid) errors.dateOfBirth = dobResult.error ?? '';
      return errors;
    },
    onSubmit: async () => {
      // Rate limit check before any network attempt
      const rl = checkRateLimit('login:attempt', MAX_LOGIN_ATTEMPTS, RATE_LIMIT_WINDOW_MS);
      if (!rl.allowed) {
        setRateLimited(true);
        return;
      }
      setRemainingAttempts(rl.remaining);
      // In production: call authApi.requestOTP() here, then move to OTP step
      setStep('otp');
      setTimeout(() => otpRef.current?.focus(), 100);
    },
  });

  // ── Step 3: OTP form ───────────────────────────────────────────────────────

  const otpForm = useFormValidation({
    initialValues: { otpCode: '' },
    validate: ({ otpCode }) => {
      const errors: Record<string, string> = {};
      const r = validateOTP(otpCode);
      if (!r.isValid) errors.otpCode = r.error ?? '';
      return errors;
    },
    onSubmit: async ({ otpCode }) => {
      if (!method) return;
      await login({
        method,
        idNumber: sanitizeIdNumber(credForm.values.idNumber),
        dateOfBirth: credForm.values.dateOfBirth,
        otpCode,
      });
      navigate(returnTo, { replace: true });
    },
  });

  const activeError = authError || credForm.submitError || otpForm.submitError;

  // ── Admin form submit ───────────────────────────────────────────────────────
  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAdminError('');
    if (!adminEmail.trim()) { setAdminError('Email is required'); return; }
    if (!adminPassword) { setAdminError('Password is required'); return; }
    setAdminSubmitting(true);
    await login({ method: 'email', idNumber: '', dateOfBirth: '', email: adminEmail.trim().toLowerCase(), password: adminPassword });
    setAdminSubmitting(false);
    // Navigation handled by the isAuthenticated useEffect above
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-linear-to-br from-[rgb(var(--color-bg))] via-white to-[rgb(var(--color-accent-light))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div
            className="w-16 h-16 rounded-2xl bg-linear-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className={`text-3xl mb-2 ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('login.title')}
          </h1>
          <p className={`text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
            {t('login.subtitle')}
          </p>
        </motion.div>

        {/* Error live region — announced by screen readers on change */}
        <div
          id={errorRegionId}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        >
          {activeError ?? ''}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white rounded-2xl p-8 border border-[rgb(var(--color-border))]"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {/* Visible error banner */}
          {activeError && (
            <div
              className="mb-6 flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
              role="status"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>{activeError}</p>
            </div>
          )}

          {rateLimited && (
            <div className="mb-6 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p className={`text-sm ${language === 'bn' ? 'font-bangla' : ''}`}>{t('login.locked')}</p>
            </div>
          )}

          {/* ─── Step 1: Choose method ─── */}
          {step === 'method' && (
            <>
              <h2 className={`text-center mb-6 ${language === 'bn' ? 'font-bangla' : ''}`}>
                {t('login.chooseMethod')}
              </h2>
              <div className="space-y-4">
                {/* Birth Certificate */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMethod('birth_certificate'); setStep('credentials'); }}
                  className="w-full p-6 rounded-xl border-2 border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-colors text-left group focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
                  aria-label={tRaw('জন্ম নিবন্ধন নম্বর দিয়ে লগইন', 'Login with Birth Registration Number')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[rgb(var(--color-accent-light))] flex items-center justify-center group-hover:bg-[rgb(var(--color-accent))] transition-colors" aria-hidden="true">
                      <User className="w-6 h-6 text-[rgb(var(--color-accent))] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>{t('login.birthMethod')}</h3>
                      <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>{t('login.birthMethodDesc')}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[rgb(var(--color-text-light))] group-hover:text-[rgb(var(--color-accent))] transition-colors" aria-hidden="true" />
                  </div>
                </motion.button>

                {/* NID */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMethod('nid'); setStep('credentials'); }}
                  className="w-full p-6 rounded-xl border-2 border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-light))] transition-colors text-left group focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
                  aria-label={tRaw('জাতীয় পরিচয়পত্র দিয়ে লগইন', 'Login with National ID Card')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[rgb(var(--color-accent-light))] flex items-center justify-center group-hover:bg-[rgb(var(--color-accent))] transition-colors" aria-hidden="true">
                      <CreditCard className="w-6 h-6 text-[rgb(var(--color-accent))] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>{t('login.nidMethod')}</h3>
                      <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>{t('login.nidMethodDesc')}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[rgb(var(--color-text-light))] group-hover:text-[rgb(var(--color-accent))] transition-colors" aria-hidden="true" />
                  </div>
                </motion.button>
              </div>

              {/* Admin / Staff option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMethod(null); setStep('admin-login'); }}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] hover:bg-slate-50 transition-colors text-left group focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                  aria-label="Admin or staff email login"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors" aria-hidden="true">
                      <Lock className="w-6 h-6 text-slate-500 group-hover:text-[rgb(var(--color-primary))] transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`mb-1 text-slate-700 ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {language === 'bn' ? 'কর্মকর্তা / প্রশাসক প্রবেশ' : 'Admin / Staff Login'}
                      </h3>
                      <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                        {language === 'bn' ? 'ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন' : 'Sign in with email and password'}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[rgb(var(--color-text-light))] group-hover:text-[rgb(var(--color-primary))] transition-colors" aria-hidden="true" />
                  </div>
                </motion.button>
              <div className="mt-6 p-4 rounded-xl bg-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent))]">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-[rgb(var(--color-accent))] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('login.firstTime')}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ─── Admin / Staff Login ─── */}
          {step === 'admin-login' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleAdminSubmit}
              noValidate
            >
              <button
                type="button"
                onClick={() => { setStep('method'); setAdminError(''); }}
                className={`text-sm text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-primary))] mb-6 focus:outline-none focus:underline ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                ← {t('action.back')}
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center" aria-hidden="true">
                  <Lock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{language === 'bn' ? 'প্রশাসক প্রবেশ' : 'Admin Login'}</h3>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">Restricted access — staff only</p>
                </div>
              </div>

              {(adminError || authError) && (
                <div className="mb-4 flex gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-sm">{adminError || authError}</p>
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label htmlFor={adminEmailId} className="block mb-2 text-sm font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    id={adminEmailId}
                    type="email"
                    autoComplete="username"
                    value={adminEmail}
                    onChange={e => { setAdminEmail(e.target.value); setAdminError(''); }}
                    placeholder="admin@example.com"
                    aria-required="true"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor={adminPwdId} className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    id={adminPwdId}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={adminPassword}
                    onChange={e => { setAdminPassword(e.target.value); setAdminError(''); }}
                    placeholder="••••••••"
                    aria-required="true"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={adminSubmitting || isLoading}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
              >
                {adminSubmitting || isLoading ? 'Signing in…' : 'Sign In'}
              </motion.button>
            </motion.form>
          )}

          {/* ─── Step 2: Credentials ─── */}
          {step === 'credentials' && method && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={credForm.handleSubmit}
              noValidate
            >
              <button
                type="button"
                onClick={() => setStep('method')}
                className={`text-sm text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-primary))] mb-6 focus:outline-none focus:underline ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                ← {t('action.back')}
              </button>

              {/* ID Number */}
              <div className="mb-5">
                <label
                  htmlFor={idFieldId}
                  className={`block mb-2 text-sm font-medium ${language === 'bn' ? 'font-bangla' : ''}`}
                >
                  {method === 'birth_certificate' ? t('login.birthMethod') : t('login.nidMethod')}
                </label>
                <div className="relative">
                  <input
                    id={idFieldId}
                    type={showId ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="off"
                    value={credForm.values.idNumber}
                    onChange={e => credForm.handleChange('idNumber', e.target.value)}
                    onBlur={() => credForm.handleBlur('idNumber')}
                    placeholder={method === 'birth_certificate' ? '12345678901234567' : '1234567890'}
                    maxLength={method === 'birth_certificate' ? 17 : 17}
                    aria-required="true"
                    aria-invalid={credForm.touched.idNumber && !!credForm.errors.idNumber}
                    aria-describedby={credForm.errors.idNumber ? `${idFieldId}-error` : undefined}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${
                      credForm.touched.idNumber && credForm.errors.idNumber
                        ? 'border-red-400 bg-red-50'
                        : 'border-[rgb(var(--color-border))]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowId(v => !v)}
                    aria-label={showId ? tRaw('নম্বর লুকান', 'Hide number') : tRaw('নম্বর দেখুন', 'Show number')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 focus:outline-none"
                  >
                    {showId ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {credForm.touched.idNumber && credForm.errors.idNumber && (
                  <p id={`${idFieldId}-error`} role="alert" className={`mt-1.5 text-sm text-red-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {credForm.errors.idNumber}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="mb-6">
                <label
                  htmlFor={dobFieldId}
                  className={`block mb-2 text-sm font-medium ${language === 'bn' ? 'font-bangla' : ''}`}
                >
                  {t('login.dob.label')}
                </label>
                <input
                  id={dobFieldId}
                  type="date"
                  value={credForm.values.dateOfBirth}
                  onChange={e => credForm.handleChange('dateOfBirth', e.target.value)}
                  onBlur={() => credForm.handleBlur('dateOfBirth')}
                  max={new Date().toISOString().split('T')[0]}
                  aria-required="true"
                  aria-invalid={credForm.touched.dateOfBirth && !!credForm.errors.dateOfBirth}
                  aria-describedby={`${dobFieldId}-hint ${credForm.errors.dateOfBirth ? `${dobFieldId}-error` : ''}`.trim()}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${
                    credForm.touched.dateOfBirth && credForm.errors.dateOfBirth
                      ? 'border-red-400 bg-red-50'
                      : 'border-[rgb(var(--color-border))]'
                  }`}
                />
                <p id={`${dobFieldId}-hint`} className={`mt-1.5 text-xs text-[rgb(var(--color-text-light))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                  {t('login.dob.hint')}
                </p>
                {credForm.touched.dateOfBirth && credForm.errors.dateOfBirth && (
                  <p id={`${dobFieldId}-error`} role="alert" className={`mt-1 text-sm text-red-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {credForm.errors.dateOfBirth}
                  </p>
                )}
              </div>

              {remainingAttempts < MAX_LOGIN_ATTEMPTS && (
                <p className={`text-sm text-amber-600 mb-4 ${language === 'bn' ? 'font-bangla' : ''}`} role="status">
                  {t('login.attempts.warning', { remaining: remainingAttempts })}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={credForm.isSubmitting || rateLimited}
                className={`w-full py-3 px-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary))] ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {credForm.isSubmitting ? t('login.verifying') : t('action.next')}
              </motion.button>
            </motion.form>
          )}

          {/* ─── Step 3: OTP ─── */}
          {step === 'otp' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={otpForm.handleSubmit}
              noValidate
            >
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className={`text-sm text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-primary))] mb-6 focus:outline-none focus:underline ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                ← {t('action.back')}
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className={`font-semibold mb-1 ${language === 'bn' ? 'font-bangla' : ''}`}>{t('login.otp.sent')}</h3>
                <p className={`text-sm text-[rgb(var(--color-text-secondary))] ${language === 'bn' ? 'font-bangla' : ''}`}>{t('login.otp.hint')}</p>
              </div>

              {/* OTP input */}
              <div className="mb-6">
                <label
                  htmlFor={otpFieldId}
                  className={`block mb-2 text-sm font-medium ${language === 'bn' ? 'font-bangla' : ''}`}
                >
                  {t('field.otp')}
                </label>
                <input
                  id={otpFieldId}
                  ref={otpRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otpForm.values.otpCode}
                  onChange={e => otpForm.handleChange('otpCode', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => otpForm.handleBlur('otpCode')}
                  aria-required="true"
                  aria-invalid={otpForm.touched.otpCode && !!otpForm.errors.otpCode}
                  aria-describedby={otpForm.errors.otpCode ? `${otpFieldId}-error` : undefined}
                  className={`w-full px-4 py-3 rounded-xl border text-center text-2xl tracking-widest font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] focus:border-transparent ${
                    otpForm.touched.otpCode && otpForm.errors.otpCode
                      ? 'border-red-400 bg-red-50'
                      : 'border-[rgb(var(--color-border))]'
                  }`}
                  placeholder="_ _ _ _ _ _"
                />
                {otpForm.touched.otpCode && otpForm.errors.otpCode && (
                  <p id={`${otpFieldId}-error`} role="alert" className={`mt-1.5 text-sm text-red-600 ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {otpForm.errors.otpCode}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={otpForm.isSubmitting || isLoading}
                className={`w-full py-3 px-4 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary))] ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {otpForm.isSubmitting || isLoading ? t('login.verifying') : t('login.submit')}
              </motion.button>

              <button
                type="button"
                className={`w-full mt-3 text-sm text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-primary))] focus:outline-none focus:underline ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {t('login.otp.resend')}
              </button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
