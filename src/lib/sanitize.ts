/**
 * Input Sanitization
 *
 * Prevents XSS, injection, and data leakage.
 * This is the CLIENT-SIDE first line of defense.
 * All server responses must also be sanitized server-side.
 *
 * IMPORTANT: Never use dangerouslySetInnerHTML with unsanitized content.
 */

/**
 * Strips all HTML tags from a string to prevent XSS.
 * Use before rendering any user-supplied text.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * HTML-encodes special characters.
 * Prevents injection attacks when text is used in HTML context.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return input.replace(/[&<>"'`=/]/g, (char) => map[char] || char);
}

/**
 * Normalize and strip NID/birth-cert for safe storage & comparison.
 * Removes spaces, dashes, and non-digit characters.
 */
export function sanitizeIdNumber(input: string): string {
  return input.replace(/[^\d]/g, '').trim();
}

/**
 * Normalizes phone number to +880XXXXXXXXXX format.
 * Returns empty string if it cannot be normalized.
 */
export function normalizePhone(input: string): string {
  const stripped = input.replace(/[\s\-\(\)\+]/g, '');
  if (stripped.startsWith('880')) return '+' + stripped;
  if (stripped.startsWith('0')) return '+880' + stripped.slice(1);
  if (stripped.length === 10) return '+880' + stripped;
  return '';
}

/**
 * Masks sensitive values for display.
 * e.g. "1234567890" → "123***7890"
 */
export function maskSensitive(value: string, visibleStart = 3, visibleEnd = 4): string {
  if (value.length <= visibleStart + visibleEnd) return '***';
  const start = value.slice(0, visibleStart);
  const end = value.slice(-visibleEnd);
  const masked = '*'.repeat(Math.min(value.length - visibleStart - visibleEnd, 4));
  return `${start}${masked}${end}`;
}

/**
 * Masks phone number for display.
 * e.g. "+8801712345678" → "+880 17**-***678"
 */
export function maskPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!normalized || normalized.length < 13) return '***';
  return `${normalized.slice(0, 7)}**-***${normalized.slice(-3)}`;
}

/**
 * Masks email address for display.
 * e.g. "rahim@example.com" → "r***@example.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local.length > 1 ? local[0] + '***' : '***';
  return `${maskedLocal}@${domain}`;
}

/**
 * Trims and normalizes whitespace in text fields.
 * Safe to apply to all string form inputs.
 */
export function sanitizeText(input: string): string {
  return stripHtml(input).replace(/\s+/g, ' ').trim();
}

/**
 * Sanitizes an entire form data object.
 * Returns a new object with all string values stripped and trimmed.
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const key in result) {
    if (typeof result[key] === 'string') {
      (result[key] as string) = sanitizeText(result[key] as string);
    }
  }
  return result;
}
