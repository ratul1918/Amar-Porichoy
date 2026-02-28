/**
 * useFormValidation — Type-safe, schema-driven form validation
 *
 * Validates fields on change/blur, submits only when all valid.
 * Uses the centralized validators from src/lib/validators.ts.
 *
 * @example
 * const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } =
 *   useFormValidation({
 *     initialValues: { idNumber: '', dateOfBirth: '' },
 *     validate: (v) => {
 *       const errors: Record<string, string> = {};
 *       if (!v.idNumber) errors.idNumber = 'Required';
 *       return errors;
 *     },
 *     onSubmit: async (values) => { ... },
 *   });
 */

import { useState, useCallback, useRef } from 'react';
import { sanitizeFormData } from '../lib/sanitize';

type ValidatorFn<T> = (values: T) => Partial<Record<keyof T, string>>;

interface UseFormValidationOptions<T extends Record<string, string>> {
  initialValues: T;
  validate: ValidatorFn<T>;
  onSubmit: (values: T) => Promise<void>;
  /** If true, validates on every keystroke. Default: false (validates on blur + submit). */
  validateOnChange?: boolean;
}

export interface FormUtils<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  submitError: string | null;
  handleChange: (field: keyof T, value: string) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFieldValue: (field: keyof T, value: string) => void;
  reset: () => void;
}

export function useFormValidation<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
  validateOnChange = false,
}: UseFormValidationOptions<T>): FormUtils<T> {
  const [values,      setValues]      = useState<T>(initialValues);
  const [errors,      setErrors]      = useState<Partial<Record<keyof T, string>>>({});
  const [touched,     setTouched]     = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateAll = useCallback(
    (v: T): Partial<Record<keyof T, string>> => validate(v),
    [validate]
  );

  const handleChange = useCallback(
    (field: keyof T, value: string) => {
      const updated = { ...values, [field]: value } as T;
      setValues(updated);
      if (validateOnChange) {
        const newErrors = validateAll(updated);
        setErrors(newErrors);
      }
    },
    [values, validateAll, validateOnChange]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const newErrors = validateAll(values);
      setErrors(newErrors);
    },
    [values, validateAll]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: string) => handleChange(field, value),
    [handleChange]
  );

  const isValid = Object.keys(validateAll(values)).length === 0;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      // Mark all fields as touched to show all validation errors
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      );
      setTouched(allTouched);

      const newErrors = validateAll(values);
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;

      setIsSubmitting(true);
      try {
        // Sanitize all string values before submission
        const sanitized = sanitizeFormData(values);
        await onSubmit(sanitized);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitError(null);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    reset,
  };
}
