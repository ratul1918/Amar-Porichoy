import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Services } from "./pages/Services";
import { ApplicationForm } from "./pages/ApplicationForm";
import { Tracking } from "./pages/Tracking";
import { About } from "./pages/About";
import { HowItWorks } from "./pages/HowItWorks";
import { FAQ } from "./pages/FAQ";
import { GoingAbroad } from "./pages/GoingAbroad";
import { HajjUmrah } from "./pages/HajjUmrah";
import { IdentityVerification } from "./pages/IdentityVerification";
import { DocumentWallet } from "./pages/DocumentWallet";
import { DigitalIDCard } from "./pages/DigitalIDCard";
import { Notifications } from "./pages/Notifications";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Analytics } from "./pages/admin/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "how-it-works",
        Component: HowItWorks,
      },
      {
        path: "faq",
        Component: FAQ,
      },
      {
        path: "going-abroad",
        Component: GoingAbroad,
      },
      {
        path: "hajj-umrah",
        Component: HajjUmrah,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "verify-identity",
        element: (
          <ProtectedRoute>
            <IdentityVerification />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "document-wallet",
        element: (
          <ProtectedRoute>
            <DocumentWallet />
          </ProtectedRoute>
        ),
      },
      {
        path: "digital-id",
        element: (
          <ProtectedRoute>
            <DigitalIDCard />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "services",
        Component: Services,
      },
      {
        path: "apply/:serviceId",
        element: (
          <ProtectedRoute>
            <ApplicationForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "tracking",
        Component: Tracking,
      },
      {
        path: "admin",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "analytics",
            element: (
              <ProtectedRoute requireAdmin>
                <Analytics />
              </ProtectedRoute>
            ),
          }
        ]
      },
    ],
  },
]);