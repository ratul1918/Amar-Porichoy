/**
 * Centralized Translation Strings
 *
 * Architecture: Flat key-value map per namespace.
 * This replaces inline `t('বাংলা', 'English')` calls scattered across components.
 *
 * Benefits:
 * - Single source of truth for all UI text
 * - Easier to audit for missing translations
 * - Enables external translation file loading in future
 * - Type-safe: typos in keys caught at compile time
 *
 * Usage:
 *   const { t } = useLanguage();
 *   t('nav.dashboard')  →  "ড্যাশবোর্ড" | "Dashboard"
 */

export type Language = 'bn' | 'en';

export type TranslationKey = keyof typeof translations.bn;

/** All translations live here. Add new keys to BOTH bn and en simultaneously. */
export const translations = {
  bn: {
    // ── Navigation
    'nav.portals':       'পোর্টাল',
    'nav.about':         'আমাদের সম্পর্কে',
    'nav.howItWorks':    'কীভাবে কাজ করে',
    'nav.faq':           'সাধারণ জিজ্ঞাসা',
    'nav.dashboard':     'ড্যাশবোর্ড',
    'nav.services':      'সেবাসমূহ',
    'nav.tracking':      'আবেদন ট্র্যাকিং',
    'nav.login':         'লগইন / নিবন্ধন',
    'nav.logout':        'লগআউট',
    'nav.skipToContent': 'মূল বিষয়বস্তুতে যান',
    'nav.brandName':     'পরিচয়',
    'nav.brandSubtitle': 'জাতীয় ডিজিটাল পরিচয়',

    // ── Common Actions
    'action.submit':     'জমা দিন',
    'action.cancel':     'বাতিল',
    'action.back':       'ফিরে যান',
    'action.next':       'পরবর্তী',
    'action.edit':       'সম্পাদনা করুন',
    'action.apply':      'আবেদন করুন',
    'action.track':      'ট্র্যাক করুন',
    'action.getStarted': 'শুরু করুন',
    'action.learnMore':  'আরও জানুন',
    'action.viewAll':    'সব দেখুন',
    'action.close':      'বন্ধ করুন',
    'action.confirm':    'নিশ্চিত করুন',
    'action.tryAgain':   'আবার চেষ্টা করুন',

    // ── Common Status
    'status.verified':   'যাচাইকৃত',
    'status.pending':    'অপেক্ষমাণ',
    'status.processing': 'প্রক্রিয়াধীন',
    'status.approved':   'অনুমোদিত',
    'status.completed':  'সম্পন্ন',
    'status.rejected':   'বাতিল',
    'status.ready':      'প্রস্তুত',

    // ── Common Fields
    'field.fullName':       'পুরো নাম',
    'field.fullNameBn':     'পুরো নাম (বাংলা)',
    'field.fullNameEn':     'পুরো নাম (ইংরেজি)',
    'field.nid':            'জাতীয় পরিচয়পত্র নম্বর',
    'field.birthCert':      'জন্ম নিবন্ধন নম্বর',
    'field.dateOfBirth':    'জন্ম তারিখ',
    'field.address':        'ঠিকানা',
    'field.phone':          'মোবাইল নম্বর',
    'field.email':          'ইমেইল',
    'field.fatherName':     'পিতার নাম',
    'field.motherName':     'মাতার নাম',
    'field.otp':            'OTP কোড',

    // ── Common Errors
    'error.required':        'এই তথ্যটি আবশ্যক',
    'error.invalidNID':      'NID নম্বর ১০ বা ১৭ সংখ্যার হতে হবে',
    'error.invalidBirthCert':'জন্ম নিবন্ধন নম্বর ঠিক ১৭ সংখ্যার হতে হবে',
    'error.invalidPhone':    'সঠিক বাংলাদেশী মোবাইল নম্বর লিখুন',
    'error.invalidEmail':    'সঠিক ইমেইল ঠিকানা লিখুন',
    'error.invalidOTP':      'OTP ঠিক ৬ সংখ্যার হতে হবে',
    'error.invalidDate':     'সঠিক তারিখ লিখুন',
    'error.network':         'সংযোগ ত্রুটি। আবার চেষ্টা করুন।',
    'error.rateLimited':     'অনেক চেষ্টা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।',
    'error.sessionExpired':  'সেশনের মেয়াদ শেষ হয়েছে। আবার লগইন করুন।',
    'error.unauthorized':    'আপনার এই পাতায় প্রবেশাধিকার নেই।',
    'error.pageNotFound':    'পাতাটি খুঁজে পাওয়া যায়নি।',
    'error.serverError':     'সিস্টেম সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।',

    // ── Landing
    'landing.badge':         'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
    'landing.headline':      'এক পরিচয়েই সব সরকারি সেবা',
    'landing.subheadline':   'একবার নিবন্ধন করুন। আর কখনও একই তথ্য লিখতে হবে না।',
    'landing.stat.citizens': 'যাচাইকৃত নাগরিক',
    'landing.stat.services': 'সরকারি সেবা',
    'landing.stat.available':'উপলব্ধ',
    'landing.benefit.title': 'কেন পরিচয় ব্যবহার করবেন?',
    'landing.benefit.sub':   'আপনার জীবনকে সহজ করার জন্য তৈরি',
    'landing.services.title':'আমাদের সেবাসমূহ',
    'landing.services.sub':  'সব সরকারি প্রক্রিয়া এক জায়গায়',

    // ── Login
    'login.title':           'পরিচয়ে স্বাগতম',
    'login.subtitle':        'আপনার পরিচয় দিয়ে প্রবেশ করুন',
    'login.chooseMethod':    'লগইন পদ্ধতি নির্বাচন করুন',
    'login.birthMethod':     'জন্ম নিবন্ধন নম্বর',
    'login.birthMethodDesc': '১৭ সংখ্যার জন্ম নিবন্ধন নম্বর দিয়ে',
    'login.nidMethod':       'জাতীয় পরিচয়পত্র (NID)',
    'login.nidMethodDesc':   '১০ বা ১৭ সংখ্যার NID নম্বর দিয়ে',
    'login.firstTime':       'প্রথমবার? আপনার জন্ম নিবন্ধন বা NID নম্বর দিয়ে নিবন্ধন করুন। আমরা আপনার তথ্য যাচাই করব।',
    'login.verifying':       'যাচাই করা হচ্ছে...',
    'login.dob.label':       'জন্ম তারিখ',
    'login.dob.hint':        'পরিচয়পত্রে উল্লিখিত তারিখ',
    'login.otp.sent':        'OTP পাঠানো হয়েছে',
    'login.otp.hint':        'আপনার মোবাইলে পাঠানো ৬ সংখ্যার কোড',
    'login.otp.resend':      'আবার পাঠান',
    'login.submit':          'প্রবেশ করুন',
    'login.attempts.warning':'আর {remaining} বার চেষ্টার সুযোগ আছে',
    'login.locked':          'অ্যাকাউন্ট সাময়িকভাবে লক হয়েছে। ১৫ মিনিট পর চেষ্টা করুন।',

    // ── Session
    'session.expiring.title':  'সেশন শেষ হতে চলেছে',
    'session.expiring.desc':   'নিষ্ক্রিয়তার কারণে ২ মিনিটের মধ্যে আপনাকে লগআউট করা হবে।',
    'session.expiring.extend': 'সক্রিয় থাকুন',
    'session.expiring.logout': 'এখনই লগআউট',

    // ── Dashboard
    'dashboard.welcome':         'স্বাগতম, {name}',
    'dashboard.subtitle':        'আপনার যাচাইকৃত পরিচয় তথ্য ও সেবার সারসংক্ষেপ',
    'dashboard.identity.title':  'আপনার পরিচয়',
    'dashboard.identity.badge':  'যাচাইকৃত পরিচয়',
    'dashboard.quickAction.apply': 'নতুন সেবার জন্য আবেদন',
    'dashboard.quickAction.track': 'আবেদন ট্র্যাক করুন',
    'dashboard.recentApps':      'সাম্প্রতিক আবেদন',

    // ── Services
    'services.title':   'সরকারি সেবাসমূহ',
    'services.subtitle':'আপনার প্রয়োজনীয় সেবা বেছে নিন',
    'services.autofill.title':'সহজ আবেদন প্রক্রিয়া',
    'services.autofill.desc': 'আপনার পরিচয় যাচাইকৃত থাকায়, ফর্মগুলো স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে।',

    // ── Tracking
    'tracking.title':   'আবেদন ট্র্যাকিং',
    'tracking.subtitle':'আপনার সকল আবেদনের অগ্রগতি দেখুন',
    'tracking.appId':   'আবেদন নম্বর:',
    'tracking.noApps':  'কোনো আবেদন পাওয়া যায়নি',

    // ── About
    'about.title':             'পরিচয় সম্পর্কে',
    'about.subtitle':          'বাংলাদেশের জাতীয় ডিজিটাল পরিচয় প্ল্যাটফর্ম',
    'about.mission.title':     'আমাদের লক্ষ্য',
    'about.vision.title':      'আমাদের দৃষ্টিভঙ্গি',
    'about.values.title':      'আমাদের মূল্যবোধ',
    'about.achievements.title':'আমাদের অর্জন',

    // ── HowItWorks
    'howItWorks.title':    'কীভাবে কাজ করে?',
    'howItWorks.subtitle': 'মাত্র ৪টি সহজ ধাপে সকল সরকারি সেবা পান',

    // ── FAQ
    'faq.title':    'সাধারণ জিজ্ঞাসা',
    'faq.subtitle': 'আপনার প্রশ্নের উত্তর খুঁজুন',

    // ── Portals
    'portals.title':    'সেবা পোর্টাল',
    'portals.subtitle': 'সব নির্দেশনা এক জায়গায়',

    // ── Form
    'form.verifiedInfo':     'যাচাইকৃত তথ্য',
    'form.verifiedInfo.desc':'এই তথ্যগুলো আপনার পরিচয় থেকে স্বয়ংক্রিয়ভাবে পূরণ হয়েছে',
    'form.editableInfo':     'অতিরিক্ত তথ্য',
    'form.submit':           'আবেদন জমা দিন',
    'form.submitting':       'জমা দেওয়া হচ্ছে...',
    'form.success.title':    'আবেদন সফল হয়েছে!',
    'form.success.desc':     'আপনার আবেদন গৃহীত হয়েছে। আবেদন নম্বর: {trackingNo}',
    'form.backToServices':   'সেবা তালিকায় ফিরুন',

    // ── Accessibility
    'a11y.loading':          'লোড হচ্ছে...',
    'a11y.closeMenu':        'মেনু বন্ধ করুন',
    'a11y.openMenu':         'মেনু খুলুন',
    'a11y.langToggle':       'ভাষা পরিবর্তন করুন',
    'a11y.verifiedBadge':    'এই তথ্য সরকারি রেকর্ড দ্বারা যাচাইকৃত',
    'a11y.maskedField':      'তথ্যটি সুরক্ষার জন্য আংশিক লুকানো',
  },

  en: {
    // ── Navigation
    'nav.portals':       'Portals',
    'nav.about':         'About',
    'nav.howItWorks':    'How It Works',
    'nav.faq':           'FAQ',
    'nav.dashboard':     'Dashboard',
    'nav.services':      'Services',
    'nav.tracking':      'Track Application',
    'nav.login':         'Login / Register',
    'nav.logout':        'Logout',
    'nav.skipToContent': 'Skip to main content',
    'nav.brandName':     'Porichoy',
    'nav.brandSubtitle': 'National Digital ID',

    // ── Common Actions
    'action.submit':     'Submit',
    'action.cancel':     'Cancel',
    'action.back':       'Go Back',
    'action.next':       'Next',
    'action.edit':       'Edit',
    'action.apply':      'Apply Now',
    'action.track':      'Track',
    'action.getStarted': 'Get Started',
    'action.learnMore':  'Learn More',
    'action.viewAll':    'View All',
    'action.close':      'Close',
    'action.confirm':    'Confirm',
    'action.tryAgain':   'Try Again',

    // ── Common Status
    'status.verified':   'Verified',
    'status.pending':    'Pending',
    'status.processing': 'Processing',
    'status.approved':   'Approved',
    'status.completed':  'Completed',
    'status.rejected':   'Rejected',
    'status.ready':      'Ready',

    // ── Common Fields
    'field.fullName':       'Full Name',
    'field.fullNameBn':     'Full Name (Bangla)',
    'field.fullNameEn':     'Full Name (English)',
    'field.nid':            'National ID Number',
    'field.birthCert':      'Birth Registration Number',
    'field.dateOfBirth':    'Date of Birth',
    'field.address':        'Address',
    'field.phone':          'Mobile Number',
    'field.email':          'Email',
    'field.fatherName':     "Father's Name",
    'field.motherName':     "Mother's Name",
    'field.otp':            'OTP Code',

    // ── Common Errors
    'error.required':        'This field is required',
    'error.invalidNID':      'NID must be 10 or 17 digits',
    'error.invalidBirthCert':'Birth registration number must be exactly 17 digits',
    'error.invalidPhone':    'Enter a valid Bangladesh mobile number',
    'error.invalidEmail':    'Enter a valid email address',
    'error.invalidOTP':      'OTP must be exactly 6 digits',
    'error.invalidDate':     'Enter a valid date',
    'error.network':         'Network error. Please try again.',
    'error.rateLimited':     'Too many attempts. Please wait and try again.',
    'error.sessionExpired':  'Your session has expired. Please log in again.',
    'error.unauthorized':    'You do not have access to this page.',
    'error.pageNotFound':    'Page not found.',
    'error.serverError':     'A system error occurred. Please try again.',

    // ── Landing
    'landing.badge':         'Government of Bangladesh',
    'landing.headline':      'One Identity. Every Government Service.',
    'landing.subheadline':   'Register once. Never re-enter your information again.',
    'landing.stat.citizens': 'Verified Citizens',
    'landing.stat.services': 'Government Services',
    'landing.stat.available':'Available',
    'landing.benefit.title': 'Why Use Porichoy?',
    'landing.benefit.sub':   'Built to make your life easier',
    'landing.services.title':'Our Services',
    'landing.services.sub':  'All government processes in one place',

    // ── Login
    'login.title':           'Welcome to Porichoy',
    'login.subtitle':        'Sign in with your identity',
    'login.chooseMethod':    'Choose Login Method',
    'login.birthMethod':     'Birth Registration Number',
    'login.birthMethodDesc': 'Use your 17-digit birth registration number',
    'login.nidMethod':       'National ID Card (NID)',
    'login.nidMethodDesc':   'Use your 10 or 17-digit NID number',
    'login.firstTime':       'First time? Register with your Birth Registration or NID number. We will verify your information.',
    'login.verifying':       'Verifying...',
    'login.dob.label':       'Date of Birth',
    'login.dob.hint':        'As it appears on your ID document',
    'login.otp.sent':        'OTP Sent',
    'login.otp.hint':        '6-digit code sent to your mobile',
    'login.otp.resend':      'Resend OTP',
    'login.submit':          'Sign In',
    'login.attempts.warning':'You have {remaining} attempts remaining',
    'login.locked':          'Account temporarily locked. Please try again in 15 minutes.',

    // ── Session
    'session.expiring.title':  'Session Expiring',
    'session.expiring.desc':   'You will be logged out in 2 minutes due to inactivity.',
    'session.expiring.extend': 'Stay Logged In',
    'session.expiring.logout': 'Log Out Now',

    // ── Dashboard
    'dashboard.welcome':         'Welcome, {name}',
    'dashboard.subtitle':        'Your verified identity and service summary',
    'dashboard.identity.title':  'Your Identity',
    'dashboard.identity.badge':  'Verified Identity',
    'dashboard.quickAction.apply': 'Apply for New Service',
    'dashboard.quickAction.track': 'Track Applications',
    'dashboard.recentApps':      'Recent Applications',

    // ── Services
    'services.title':   'Government Services',
    'services.subtitle':'Choose the service you need',
    'services.autofill.title':'Easy Application Process',
    'services.autofill.desc': 'Since your identity is verified, forms will be auto-filled.',

    // ── Tracking
    'tracking.title':   'Track Applications',
    'tracking.subtitle':'View the progress of all your applications',
    'tracking.appId':   'Application ID:',
    'tracking.noApps':  'No applications found',

    // ── About
    'about.title':             'About Porichoy',
    'about.subtitle':          "Bangladesh's National Digital Identity Platform",
    'about.mission.title':     'Our Mission',
    'about.vision.title':      'Our Vision',
    'about.values.title':      'Our Values',
    'about.achievements.title':'Our Achievements',

    // ── HowItWorks
    'howItWorks.title':    'How It Works?',
    'howItWorks.subtitle': 'Get all government services in just 4 easy steps',

    // ── FAQ
    'faq.title':    'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to your questions',

    // ── Portals
    'portals.title':    'Service Portals',
    'portals.subtitle': 'All instructions in one place',

    // ── Form
    'form.verifiedInfo':     'Verified Information',
    'form.verifiedInfo.desc':'This information was automatically filled from your profile',
    'form.editableInfo':     'Additional Information',
    'form.submit':           'Submit Application',
    'form.submitting':       'Submitting...',
    'form.success.title':    'Application Submitted!',
    'form.success.desc':     'Your application has been received. Application number: {trackingNo}',
    'form.backToServices':   'Back to Services',

    // ── Accessibility
    'a11y.loading':          'Loading...',
    'a11y.closeMenu':        'Close menu',
    'a11y.openMenu':         'Open menu',
    'a11y.langToggle':       'Toggle language',
    'a11y.verifiedBadge':    'This information is verified by government records',
    'a11y.maskedField':      'Information partially hidden for security',
  },
} as const;

/**
 * Resolves a translation key for the given language.
 * Supports interpolation: t('login.attempts.warning', {remaining: 3})
 * Falls back to English if Bangla key is missing (should never happen).
 */
export function resolveTranslation(
  lang: Language,
  key: TranslationKey,
  interpolations?: Record<string, string | number>
): string {
  const dict = translations[lang] as Record<string, string>;
  let text = dict[key] ?? (translations.en as Record<string, string>)[key] ?? key;

  if (interpolations) {
    for (const [k, v] of Object.entries(interpolations)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }

  return text;
}
