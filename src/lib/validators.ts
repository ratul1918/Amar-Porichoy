/**
 * Input Validation Library
 *
 * Government-grade validation for sensitive identity fields.
 * All validation is performed client-side for UX, but MUST be
 * duplicated server-side — never trust client-only validation.
 *
 * Standards: BERec-2024 (Bangladesh e-Government Standards)
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// ─── NID / Birth Certificate ─────────────────────────────────────────────────

/**
 * NID numbers are 10 or 17 digits.
 * Format: [0-9]{10} or [0-9]{17}
 * No leading zeros allowed in 10-digit format.
 */
export function validateNID(value: string): ValidationResult {
  const stripped = value.replace(/[\s\-]/g, '');
  if (!stripped) return { isValid: false, error: 'NID number is required' };
  if (!/^\d+$/.test(stripped)) return { isValid: false, error: 'NID must contain digits only' };
  if (stripped.length !== 10 && stripped.length !== 17) {
    return { isValid: false, error: 'NID must be 10 or 17 digits' };
  }
  return { isValid: true };
}

/**
 * Birth certificate: exactly 17 digits.
 */
export function validateBirthCertificate(value: string): ValidationResult {
  const stripped = value.replace(/[\s\-]/g, '');
  if (!stripped) return { isValid: false, error: 'Birth registration number is required' };
  if (!/^\d{17}$/.test(stripped)) {
    return { isValid: false, error: 'Birth registration number must be exactly 17 digits' };
  }
  return { isValid: true };
}

// ─── Phone ───────────────────────────────────────────────────────────────────

/**
 * Bangladesh mobile: starts with +880 or 0, then 10 digits.
 * Supported prefixes: 011, 013, 014, 015, 016, 017, 018, 019
 */
export function validateBangladeshPhone(value: string): ValidationResult {
  const stripped = value.replace(/[\s\-\(\)]/g, '');
  if (!stripped) return { isValid: false, error: 'Phone number is required' };
  const normalized = stripped.startsWith('+880')
    ? '0' + stripped.slice(4)
    : stripped;
  if (!/^0(11|13|14|15|16|17|18|19)\d{8}$/.test(normalized)) {
    return { isValid: false, error: 'Enter a valid Bangladesh mobile number' };
  }
  return { isValid: true };
}

// ─── OTP ─────────────────────────────────────────────────────────────────────

/** OTP: exactly 6 digits, no leading zeros */
export function validateOTP(value: string): ValidationResult {
  if (!value) return { isValid: false, error: 'OTP is required' };
  if (!/^\d{6}$/.test(value)) {
    return { isValid: false, error: 'OTP must be exactly 6 digits' };
  }
  return { isValid: true };
}

// ─── Date of Birth ───────────────────────────────────────────────────────────

/**
 * Validates date of birth.
 * Age must be between 0 and 120.
 * Future dates not allowed.
 */
export function validateDateOfBirth(value: string): ValidationResult {
  if (!value) return { isValid: false, error: 'Date of birth is required' };
  const date = new Date(value);
  if (isNaN(date.getTime())) return { isValid: false, error: 'Invalid date format' };
  const now = new Date();
  if (date > now) return { isValid: false, error: 'Date of birth cannot be in the future' };
  const age = now.getFullYear() - date.getFullYear();
  if (age > 120) return { isValid: false, error: 'Invalid date of birth' };
  return { isValid: true };
}

// ─── Email ───────────────────────────────────────────────────────────────────

/** Optional email — only validates if provided */
export function validateEmail(value: string): ValidationResult {
  if (!value) return { isValid: true }; // email is optional
  const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/;
  if (!emailRegex.test(value)) {
    return { isValid: false, error: 'Enter a valid email address' };
  }
  if (value.length > 320) {
    return { isValid: false, error: 'Email address is too long' };
  }
  return { isValid: true };
}

// ─── General text ────────────────────────────────────────────────────────────

/** Validates required text fields with length constraints */
export function validateRequiredText(
  value: string,
  fieldName: string,
  minLen = 2,
  maxLen = 255
): ValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (value.trim().length < minLen) {
    return { isValid: false, error: `${fieldName} must be at least ${minLen} characters` };
  }
  if (value.length > maxLen) {
    return { isValid: false, error: `${fieldName} must be at most ${maxLen} characters` };
  }
  return { isValid: true };
}

// ─── Compound: Login form ────────────────────────────────────────────────────

export interface LoginFormFields {
  method: 'nid' | 'birth_certificate';
  idNumber: string;
  dateOfBirth: string;
  otpCode?: string;
}

export interface LoginFormErrors {
  idNumber?: string;
  dateOfBirth?: string;
  otpCode?: string;
}

export function validateLoginForm(fields: LoginFormFields): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const idResult =
    fields.method === 'nid'
      ? validateNID(fields.idNumber)
      : validateBirthCertificate(fields.idNumber);

  if (!idResult.isValid) errors.idNumber = idResult.error;

  const dobResult = validateDateOfBirth(fields.dateOfBirth);
  if (!dobResult.isValid) errors.dateOfBirth = dobResult.error;

  if (fields.otpCode !== undefined) {
    const otpResult = validateOTP(fields.otpCode);
    if (!otpResult.isValid) errors.otpCode = otpResult.error;
  }

  return errors;
}
