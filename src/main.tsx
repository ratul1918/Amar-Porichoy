/**
 * Application Entry Point
 *
 * Security measures applied here:
 * 1. StrictMode — doubles renders in dev to surface side-effect bugs early.
 * 2. AuthProvider wraps everything so auth state is always available.
 * 3. LanguageProvider managed at root so language is app-wide.
 * 4. Meta CSP tag added programmatically as a defense-in-depth measure.
 *    NOTE: The authoritative CSP MUST be set as an HTTP header by the server.
 *
 * Provider nesting order (outer → inner):
 *   LanguageProvider → AuthProvider → RouterProvider
 *
 * NOTE: In production, add these HTTP headers via your CDN/reverse proxy:
 *   Content-Security-Policy: default-src 'self'; script-src 'self'; ...
 *   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
 *   X-Content-Type-Options: nosniff
 *   X-Frame-Options: DENY
 *   Referrer-Policy: strict-origin-when-cross-origin
 *   Permissions-Policy: geolocation=(), camera=(), microphone=()
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found in DOM");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);