/**
 * ErrorBoundary — React class component error boundary.
 *
 * Class components are required by React for error boundaries.
 * Catches rendering errors, logs them, and shows a recovery UI.
 *
 * Placed at route level so one crashed page doesn't destroy the entire app.
 * In production, errors are forwarded to a monitoring service (e.g. Sentry).
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { secureLog, IS_PRODUCTION } from '../lib/security';

interface Props {
  children: ReactNode;
  /** Custom fallback UI. If omitted, uses the built-in error card. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Called when an error is caught — use to send to monitoring (Sentry, etc.) */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false, error: null, errorId: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    secureLog.error('ErrorBoundary caught', IS_PRODUCTION ? error.message : error);

    // In production: send to monitoring service
    // e.g. Sentry.captureException(error, { extra: info });
    this.props.onError?.(error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center p-6 bg-gray-50"
        >
          <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-500 text-sm mb-2">
              An unexpected error occurred. Your data is safe.
            </p>
            {this.state.errorId && (
              <p className="font-mono text-xs text-gray-400 mb-6">
                Reference: {this.state.errorId}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary))]"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
