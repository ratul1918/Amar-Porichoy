import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { ShieldOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Permission, UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Require a specific permission (fine-grained) */
  permission?: Permission;
  /** Require a specific role or any of several roles (coarse-grained) */
  role?: UserRole | UserRole[] | 'citizen' | 'admin';
  /** Custom redirect target for unauthenticated users. Defaults to /login */
  loginPath?: string;
}

export function ProtectedRoute({
  children,
  permission,
  role,
  loginPath = '/login',
}: ProtectedRouteProps): React.ReactElement {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  // Still booting — show nothing to prevent flash
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="min-h-screen flex items-center justify-center"
      >
        <div className="w-8 h-8 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to login, preserve intended destination
  if (!isAuthenticated) {
    // Route to appropriate login based on location
    const redirectPath = location.pathname.startsWith('/admin') ? '/admin/login' : loginPath;
    return (
      <Navigate
        to={redirectPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Permission check
  if (permission && !hasPermission(permission)) {
    return <ForbiddenPage />;
  }

  // Role check
  if (role) {
    const rolesToCheck = Array.isArray(role) ? role : [role];
    if (!hasRole(rolesToCheck as UserRole[])) {
      return <ForbiddenPage />;
    }
  }

  return <>{children}</>;
}

function ForbiddenPage(): React.ReactElement {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center p-6 bg-gray-50"
    >
      <div className="max-w-md w-full bg-white rounded-2xl border border-amber-100 p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-8 h-8 text-amber-500" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-6">
          You do not have permission to view this page.
          If you believe this is an error, please contact support.
        </p>
        <a
          href="/dashboard"
          className="block w-full py-3 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white font-semibold text-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary))]"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
