/**
 * Application Routes
 *
 * Architecture:
 * - All page components are LAZY LOADED (code splitting per route).
 *   This reduces initial bundle by ~70%+ for a multi-page app like this.
 * - Authenticated routes are protected by ProtectedRoute.
 * - React.Suspense provides loading fallback during chunk fetch.
 * - ErrorBoundary at route level isolates page-level errors.
 *
 * Route security classification:
 *   PUBLIC     — No auth required (Landing, About, FAQ, Login)
 *   PROTECTED  — Requires isAuthenticated (Dashboard, Services, etc.)
 */

import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AdminLayout } from "./components/AdminLayout";

// ── Public pages ──────────────────────────────────────────────────────────────
const Landing         = lazy(() => import("./pages/Landing").then(m => ({ default: m.Landing })));
const Login           = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const AdminLogin      = lazy(() => import("./pages/AdminLogin").then(m => ({ default: m.AdminLogin })));
const About           = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const HowItWorks      = lazy(() => import("./pages/HowItWorks").then(m => ({ default: m.HowItWorks })));
const FAQ             = lazy(() => import("./pages/FAQ").then(m => ({ default: m.FAQ })));
const GoingAbroad     = lazy(() => import("./pages/GoingAbroad").then(m => ({ default: m.GoingAbroad })));
const HajjUmrah       = lazy(() => import("./pages/HajjUmrah").then(m => ({ default: m.HajjUmrah })));
const Portals         = lazy(() => import("./pages/Portals").then(m => ({ default: m.Portals })));

// ── Citizen Protected pages ───────────────────────────────────────────────────
const Dashboard       = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Services        = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const ApplicationForm = lazy(() => import("./pages/ApplicationForm").then(m => ({ default: m.ApplicationForm })));
const Tracking        = lazy(() => import("./pages/Tracking").then(m => ({ default: m.Tracking })));

// ── Admin Protected pages ─────────────────────────────────────────────────────
const AdminDashboard  = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminUsers      = lazy(() => import("./pages/AdminUsers").then(m => ({ default: m.AdminUsers })));
const AdminApplications = lazy(() => import("./pages/AdminApplications").then(m => ({ default: m.AdminApplications })));
const AdminAudit      = lazy(() => import("./pages/AdminAudit").then(m => ({ default: m.AdminAudit })));

/** Shared loading fallback — shown while route chunks are fetched. */
function PageLoader(): React.ReactElement {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

function NotFoundPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <a href="/" className="px-6 py-3 bg-[rgb(var(--color-primary))] text-white rounded-lg hover:opacity-90">
          Go Home
        </a>
      </div>
    </div>
  );
}

function withSuspense(Component: React.ComponentType): React.ReactElement {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

function withProtectedSuspense(Component: React.ComponentType, requiredRole?: 'citizen' | 'admin'): React.ReactElement {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute role={requiredRole}>
          <Component />
        </ProtectedRoute>
      </Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  // ────────────────────────────────────────────────────────────────────────────
  // PUBLIC ROUTES (citizen layout)
  // ────────────────────────────────────────────────────────────────────────────
  {
    path: "/",
    Component: Layout,
    children: [
      // Public routes
      { index: true,                    element: withSuspense(Landing) },
      { path: "about",                  element: withSuspense(About) },
      { path: "how-it-works",           element: withSuspense(HowItWorks) },
      { path: "faq",                    element: withSuspense(FAQ) },
      { path: "going-abroad",           element: withSuspense(GoingAbroad) },
      { path: "hajj-umrah",             element: withSuspense(HajjUmrah) },
      { path: "portals",                element: withSuspense(Portals) },
      { path: "login",                  element: withSuspense(Login) },

      // Citizen Protected routes — require authentication
      { path: "dashboard",              element: withProtectedSuspense(Dashboard, 'citizen') },
      { path: "services",               element: withProtectedSuspense(Services, 'citizen') },
      { path: "apply/:serviceId",       element: withProtectedSuspense(ApplicationForm, 'citizen') },
      { path: "tracking",               element: withProtectedSuspense(Tracking, 'citizen') },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ADMIN ROUTES (separated admin layout)
  // ────────────────────────────────────────────────────────────────────────────
  {
    path: "/admin",
    children: [
      // Unprotected admin login
      { path: "login", element: withSuspense(AdminLogin) },

      // Protected admin routes with admin-only layout
      {
        path: "",
        Component: AdminLayout,
        children: [
          { path: "dashboard",    element: withProtectedSuspense(AdminDashboard, 'admin') },
          { path: "users",        element: withProtectedSuspense(AdminUsers, 'admin') },
          { path: "applications", element: withProtectedSuspense(AdminApplications, 'admin') },
          { path: "audit",        element: withProtectedSuspense(AdminAudit, 'admin') },
        ],
      },
    ],
  },

  // 404 fallback
  { path: "*", element: withSuspense(() => <NotFoundPage />) },
]);