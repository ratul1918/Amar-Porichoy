# পরিচয় (Porichoy) — Digital Identity Platform

<div align="center">

![Porichoy Logo](https://img.shields.io/badge/পরিচয়-National%20Digital%20ID-006A4E?style=for-the-badge&logo=shield&logoColor=white)

**🇧🇩 Bangladesh's National Digital Identity Platform**

*One Identity. Every Government Service.*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-005A9C?style=flat-square&logo=w3c&logoColor=white)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](./LICENSE)

[বাংলা](#-বাংলায়-বর্ণনা) · [English](#-overview)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [বাংলায় বর্ণনা](#-বাংলায়-বর্ণনা)
3. [Key Features](#-key-features)
4. [Tech Stack](#-tech-stack)
5. [Architecture](#-architecture)
6. [Project Structure](#-project-structure)
7. [Getting Started](#-getting-started)
8. [Environment Variables](#-environment-variables)
9. [Available Scripts](#-available-scripts)
10. [Pages & Routes](#-pages--routes)
11. [Authentication & Security](#-authentication--security)
12. [Internationalization](#-internationalization-i18n)
13. [Custom Hooks](#-custom-hooks)
14. [Type System](#-type-system)
15. [Accessibility](#-accessibility-wcag-21)
16. [UI Components](#-ui-components)
17. [Design System](#-design-system)
18. [Build Output](#-build-output)
19. [Contributing](#-contributing)
20. [License](#-license)

---

## 🌟 Overview

**Porichoy (পরিচয়)** is Bangladesh's unified national digital identity platform — a production-grade React SPA that centralizes citizen data and government service delivery into one secure, accessible interface.

The platform is engineered to government standards:

- **Single registration** — citizens register once with NID or Birth Certificate; verified data auto-fills every subsequent service form
- **50+ integrated government services** — passport, national ID, birth certificate, driving licence, voter registration, tax, land, and more
- **Enterprise security architecture** — CSRF protection, client-side rate limiting, XSS sanitization, in-memory token storage (never localStorage), RBAC, and inactivity session management
- **WCAG 2.1 AA accessibility** — skip-to-content links, keyboard navigation, `aria-current`, `aria-live` regions, alertdialog pattern for session management
- **Full bilingual support** — Bangla (বাংলা) and English with a structured, typed translation key system
- **Code-split performance** — 30+ lazy-loaded async page chunks; ~129 kB gzipped main bundle; SWC transpilation (no Babel overhead)

---

## 🇧🇩 বাংলায় বর্ণনা

**পরিচয়** হলো বাংলাদেশের জাতীয় ডিজিটাল পরিচয় প্ল্যাটফর্ম। এই প্ল্যাটফর্মে নাগরিকগণ একবার নিবন্ধন করলে ৫০টিরও বেশি সরকারি সেবা সহজে গ্রহণ করতে পারবেন।

সেবাসমূহের মধ্যে রয়েছে: পাসপোর্ট, জাতীয় পরিচয়পত্র, জন্ম নিবন্ধন, ড্রাইভিং লাইসেন্স, ভোটার নিবন্ধন, কর সার্টিফিকেট, ভূমি সেবা এবং আরও অনেক কিছু। প্রতিটি সেবার ফর্মে নাগরিকের যাচাইকৃত তথ্য স্বয়ংক্রিয়ভাবে পূরণ হয় — একই তথ্য বারবার দেওয়ার ঝামেলা নেই।

---

## ✨ Key Features

### Core Platform

| Feature | Details |
|---------|---------|
| 🔐 **Single Sign-On** | One account unlocks all government services |
| 📝 **Auto-fill** | Verified citizen data pre-populates every service form |
| 🛡️ **Enterprise Security** | CSRF · rate limiting · XSS sanitization · in-memory token storage |
| ⏱️ **Session Management** | 15-min inactivity timeout with 60-second countdown dialog |
| 👥 **RBAC** | Role-based access: `citizen` · `agent` · `admin` |
| 🌐 **Bilingual** | Full Bangla & English — structured typed i18n key system |
| ♿ **WCAG 2.1 AA** | Skip links · keyboard nav · `aria-live` · alertdialog pattern |
| ⚡ **Performance** | 30+ lazy chunks · ~129 kB gzip · SWC (no Babel) |

### Government Services

| Category | Services |
|----------|---------|
| 🪪 **Identity** | National ID Card, Birth Certificate, Family Certificate |
| 📕 **Travel** | Passport / e-Passport (new & renewal) |
| 👮 **Legal** | Police Clearance Certificate |
| 🚗 **Transport** | Driving Licence (new & renewal) |
| 🏠 **Land** | Land registration & documentation |
| 📋 **Civil** | Voter Registration / Electoral roll management |
| 💼 **Business** | Trade Licence, business registration |
| 💰 **Tax** | TIN registration, Tax Certificate |

### Specialized Portals

| Portal | Description |
|--------|-------------|
| ✈️ **Going Abroad** | End-to-end travel preparation — Visa, Passport, Manpower Clearance |
| 🕋 **Hajj & Umrah** | Sacred journey preparation, quota registration, pre-departure guidance |

---

## 🛠 Tech Stack

### Core

| Technology | Version | Role |
|-----------|---------|------|
| React | 18.3.1 | UI library — concurrent mode, hooks |
| TypeScript | 5.x | Strict type safety (transpiled via Vite/SWC) |
| Vite + SWC | 6.3.5 | Build tooling + SWC transpilation (no Babel) |
| React Router | latest | Client-side routing with lazy code splitting |

### Styling

| Technology | Version | Role |
|-----------|---------|------|
| Tailwind CSS | 4.x | Utility-first styling (v4 renamed classes — see migration notes) |
| shadcn/ui | — | Prebuilt accessible component library |
| Radix UI | various | Unstyled, accessible component primitives |
| clsx + tailwind-merge | latest | Conditional class name merging |
| class-variance-authority | 0.7.x | Component variant management |

### Animation & Icons

| Technology | Role |
|-----------|------|
| motion (`motion/react`) | Production animations — replaces old `framer-motion` import path |
| Lucide React 0.487 | 500+ consistent open-source icons |

### Forms & Data

| Technology | Role |
|-----------|------|
| React Hook Form 7.55 | Performant forms with minimal re-renders |
| Recharts 2.15 | Composable SVG charts for dashboards |
| React Day Picker 8.10 | Accessible date selection calendar |
| input-otp 1.4 | One-time password segmented input |

### UI Utilities

| Technology | Role |
|-----------|------|
| Sonner 2.0 | Modern toast notifications |
| Vaul 1.1 | Drawer / bottom-sheet component |
| Embla Carousel 8.6 | Lightweight touch-friendly carousel |
| CMDK 1.1 | Command palette interface |
| react-resizable-panels 2.1 | Drag-to-resize layout panels |
| next-themes 0.4 | Theme management (light/dark/system) |

---

## 🏗 Architecture

The platform follows a strict layered architecture. Each layer has a single responsibility and communicates only with adjacent layers.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / User                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│         src/pages/*   (12 lazy-loaded page components)      │
│  Landing · Login · Dashboard · Services · ApplicationForm   │
│  Tracking · About · HowItWorks · FAQ · Portals              │
│  GoingAbroad · HajjUmrah                                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│         src/components/  (infrastructure layer)             │
│  ProtectedRoute  ← RBAC gate (role + auth check)           │
│  SessionManager  ← Inactivity timer + countdown AlertDialog │
│  ErrorBoundary   ← React error boundary + bilingual fallback│
│  Header          ← Accessible nav (aria-current, skip-nav) │
│  Layout          ← skip-to-content target (#main-content)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│         src/contexts/  (global state via Context API)       │
│  AuthContext     ← useReducer state machine                 │
│                    token stored in SecureMemoryStore (RAM)  │
│  LanguageContext ← BN / EN language toggle + t() helper    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│         src/hooks/   (reusable React logic)                 │
│  useAsync         ← loading / error / data state machine   │
│  useFormValidation← per-field validation + bilingual errors │
│  useSessionGuard  ← SESSION_EXPIRED event subscriber       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│         src/lib/     (pure utilities — no React)            │
│  api.ts       ← typed fetch client, CSRF header, timeout   │
│  security.ts  ← generateCSRFToken, RateLimiter, SecureStore│
│  sanitize.ts  ← XSS HTML entity encoding helpers           │
│  validators.ts← NID / BirthReg / phone / email validators  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                        Backend REST API
                      (VITE_API_BASE_URL)
```

---

## 📁 Project Structure

```
porichoy-digital-identity-platform/
├── index.html                       # Entry HTML — skip link, preconnect, fonts
├── package.json                     # Dependencies & npm scripts
├── vite.config.ts                   # Vite + SWC plugin + path aliases
├── tsconfig.json                    # TypeScript config (includes vite.config.ts)
├── .env                             # Local environment variables (git-ignored)
├── .env.example                     # Template — copy to .env to get started
│
└── src/
    ├── main.tsx                     # React 18 createRoot entry point
    ├── App.tsx                      # BrowserRouter + all context providers
    ├── routes.tsx                   # Route tree: lazy imports + ProtectedRoute
    ├── index.css                    # Tailwind @import + global CSS custom props
    ├── vite-env.d.ts                # ImportMetaEnv typings for import.meta.env
    │
    ├── types/                       # Global TypeScript type definitions
    │   ├── index.ts                 # Barrel — re-exports everything
    │   ├── auth.ts                  # User · UserRole · AuthState · LoginCredentials · Permission
    │   ├── citizen.ts               # CitizenProfile · Address · ServiceApplication · Document
    │   └── api.ts                   # ApiResponse<T> · PaginatedResponse<T> · ApiError
    │
    ├── lib/                         # Pure utility modules (no React dependencies)
    │   ├── api.ts                   # Typed HTTP client — headers, CSRF, timeout, error normalisation
    │   ├── security.ts              # generateCSRFToken · RateLimiter · SecureMemoryStore
    │   ├── sanitize.ts              # sanitizeInput() · sanitizeHTML() — XSS prevention
    │   └── validators.ts            # validateNID() · validateBirthReg() · validatePhone() · validateEmail()
    │
    ├── i18n/
    │   └── translations.ts          # Typed BN + EN translation map (nav, auth, pages, errors)
    │
    ├── hooks/
    │   ├── useAsync.ts              # Generic async state machine: idle → loading → success/error
    │   ├── useFormValidation.ts     # Per-field validation with bilingual error messages
    │   └── useSessionGuard.ts       # Subscribes to SESSION_EXPIRED custom DOM event
    │
    ├── contexts/
    │   ├── AuthContext.tsx          # Auth useReducer · login · logout · hasRole · hasPermission
    │   └── LanguageContext.tsx      # language · setLanguage · t(key) translation helper
    │
    ├── components/
    │   ├── ErrorBoundary.tsx        # Class-based error boundary with bilingual fallback UI
    │   ├── ProtectedRoute.tsx       # Redirects unauthenticated; enforces requiredRole prop
    │   ├── SessionManager.tsx       # Inactivity detection → AlertDialog → auto logout
    │   ├── Header.tsx               # Responsive nav · aria-current · LanguageToggle
    │   ├── Layout.tsx               # <main id="main-content"> + <Outlet /> wrapper
    │   ├── LanguageToggle.tsx       # BN ↔ EN button with accessible label
    │   ├── common/
    │   │   └── ImageWithFallback.tsx  # <img> with onError fallback src
    │   └── ui/                      # 40 shadcn/ui components (Radix UI based)
    │       ├── accordion.tsx · alert.tsx · alert-dialog.tsx · aspect-ratio.tsx
    │       ├── avatar.tsx · badge.tsx · breadcrumb.tsx · button.tsx · calendar.tsx
    │       ├── card.tsx · carousel.tsx · chart.tsx · checkbox.tsx · collapsible.tsx
    │       ├── command.tsx · context-menu.tsx · dialog.tsx · drawer.tsx
    │       ├── dropdown-menu.tsx · form.tsx · hover-card.tsx · input.tsx · input-otp.tsx
    │       ├── label.tsx · menubar.tsx · navigation-menu.tsx · pagination.tsx
    │       ├── popover.tsx · progress.tsx · radio-group.tsx · resizable.tsx
    │       ├── scroll-area.tsx · select.tsx · separator.tsx · sheet.tsx · sidebar.tsx
    │       ├── skeleton.tsx · slider.tsx · sonner.tsx · switch.tsx · table.tsx
    │       ├── tabs.tsx · textarea.tsx · toggle.tsx · toggle-group.tsx · tooltip.tsx
    │       └── use-mobile.ts        # useIsMobile() — consumed by sidebar.tsx
    │
    └── pages/                       # 12 lazy-loaded page components
        ├── Landing.tsx              # Hero · benefits grid · stats · CTAs
        ├── Login.tsx                # NID / Birth Reg auth form · rate-limit feedback
        ├── Dashboard.tsx            # Citizen digital ID card · quick actions · recent apps
        ├── Services.tsx             # Searchable + filterable catalog of 50+ services
        ├── ApplicationForm.tsx      # Dynamic form for any service (route param :id)
        ├── Tracking.tsx             # Real-time application status timeline
        ├── About.tsx                # Mission · vision · leadership · platform statistics
        ├── HowItWorks.tsx           # 4-step visual onboarding guide
        ├── FAQ.tsx                  # Categorized FAQ accordion (12+ categories)
        ├── Portals.tsx              # Portal directory cards
        ├── GoingAbroad.tsx          # Visa · Passport · Manpower Clearance guide
        └── HajjUmrah.tsx            # Hajj quota · registration · pre-departure portal
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# 1  Clone the repository
git clone https://github.com/your-org/porichoy-digital-identity.git
cd porichoy-digital-identity

# 2  Install all dependencies
npm install

# 3  Set up environment variables
cp .env.example .env
# The defaults work out-of-the-box for local development

# 4  Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

> **No backend needed for development.**
> The default `.env` has `VITE_USE_MOCK_API=true` — the app runs fully offline using mock data. Set it to `false` and configure `VITE_API_BASE_URL` when connecting to a real backend.

---

## ⚙️ Environment Variables

All Vite env vars are prefixed `VITE_` and statically inlined at build time. They are **never sent to a server at runtime**.

```bash
# .env.example

VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT_MS=15000
VITE_SESSION_MAX_MS=28800000
VITE_INACTIVITY_TIMEOUT_MS=900000
VITE_VERBOSE_LOGGING=true
VITE_USE_MOCK_API=true
VITE_ANALYTICS_URL=
```

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_BASE_URL` | `string` | `http://localhost:8080` | Backend REST API base URL |
| `VITE_API_TIMEOUT_MS` | `number` | `15000` | HTTP request timeout (ms) |
| `VITE_SESSION_MAX_MS` | `number` | `28800000` | Maximum session lifetime — 8 hours (ms) |
| `VITE_INACTIVITY_TIMEOUT_MS` | `number` | `900000` | Inactivity warning threshold — 15 minutes (ms) |
| `VITE_VERBOSE_LOGGING` | `boolean` | `true` | Enable verbose console logging |
| `VITE_USE_MOCK_API` | `boolean` | `true` | Use mock responses (no backend required) |
| `VITE_ANALYTICS_URL` | `string` | *(empty)* | Analytics endpoint URL (disabled if empty) |

> ⚠️ **Never commit `.env` to version control.** `.env` is listed in `.gitignore`.
> In production, inject these values via CI/CD secrets, Docker `--env-file`, or your hosting platform's environment configuration.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with Hot Module Replacement |
| `npm run build` | Type-check + production build → outputs to `build/` |

To preview the production build locally:

```bash
npx vite preview
# Opens http://localhost:4173
```

---

## 🗺 Pages & Routes

Every page component is **dynamically imported** (`React.lazy` + `import()`), creating a separate JS chunk per page. The initial page load is minimal.

| Route | Component | Auth | Role | Description |
|-------|-----------|:----:|:----:|-------------|
| `/` | `Landing` | — | — | Hero section, benefits, statistics, CTAs |
| `/login` | `Login` | — | — | NID or Birth Registration Number authentication |
| `/dashboard` | `Dashboard` | ✅ | citizen+ | Digital ID card, quick service actions, recent applications |
| `/services` | `Services` | ✅ | citizen+ | Searchable / filterable catalog of 50+ government services |
| `/apply/:id` | `ApplicationForm` | ✅ | citizen+ | Dynamic application form for any service |
| `/tracking` | `Tracking` | ✅ | citizen+ | Real-time application status and timeline |
| `/about` | `About` | — | — | Platform mission, leadership, and statistics |
| `/how-it-works` | `HowItWorks` | — | — | 4-step visual registration guide |
| `/faq` | `FAQ` | — | — | Categorized accordion of frequently asked questions |
| `/portals` | `Portals` | — | — | Directory of specialised service portals |
| `/going-abroad` | `GoingAbroad` | — | — | Travel preparation — Visa, Passport, Manpower Clearance |
| `/hajj-umrah` | `HajjUmrah` | — | — | Hajj & Umrah quota, registration, pre-departure |

`ProtectedRoute` in `routes.tsx` handles authentication gating. Unauthenticated users are redirected to `/login` with the original path preserved for post-login redirect. An optional `requiredRole` prop allows admin-only routes.

---

## 🔐 Authentication & Security

### Login Flow

```
User submits login form (/login)
   │
   ├─ sanitizeInput(identifier)       ← strip XSS from user input
   ├─ validateNID() / validateBirthReg()  ← format + length validation
   ├─ checkRateLimit(identifier)      ← block after 5 failures / 15 min
   │
   └─ api.post('/auth/login', { ... })   ← via src/lib/api.ts
         ├─ X-CSRF-Token header attached automatically
         ├─ AbortController enforces VITE_API_TIMEOUT_MS
         │
         └─ on 200 OK
               └─ AuthContext.login(user, token)
                     ├─ token → SecureMemoryStore (in-memory Map, never localStorage)
                     ├─ AuthState update via useReducer dispatch
                     └─ navigate('/dashboard')  or saved returnPath
```

### Security Layer Reference

| Layer | File | Mechanism |
|-------|------|-----------|
| **CSRF Protection** | `src/lib/security.ts` | `generateCSRFToken()` uses `crypto.getRandomValues` (32-byte hex). Attached as `X-CSRF-Token` on every mutation. Token rotated after each request. |
| **Rate Limiting** | `src/lib/security.ts` | `RateLimiter` class tracks attempts per identifier. Locks out after 5 failures in a 15-minute sliding window. |
| **XSS Prevention** | `src/lib/sanitize.ts` | `sanitizeInput()` HTML-encodes `& < > " ' /` before any user-supplied value is rendered or transmitted. Zero uses of `dangerouslySetInnerHTML`. |
| **Secure Token Storage** | `src/lib/security.ts` | `SecureMemoryStore` — a `Map` inside a closure. Access tokens live only in RAM; cleared automatically when the tab closes. |
| **Inactivity Session** | `src/components/SessionManager.tsx` | Listens to `mousemove`, `keydown`, `click`, `scroll`. After `VITE_INACTIVITY_TIMEOUT_MS` idle time, displays a 60-second countdown `AlertDialog`. Auto-logs out on expiry. |
| **RBAC Route Guard** | `src/components/ProtectedRoute.tsx` | Checks `isAuthenticated` and optional `requiredRole` against `user.role`. Redirects appropriately. |

### AuthContext API

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const {
    user,              // AuthUser | null
    isAuthenticated,   // boolean
    isLoading,         // boolean — true during initial session restore
    login,             // (credentials: LoginCredentials) => Promise<void>
    logout,            // () => void — clears token + state
    hasRole,           // (role: UserRole) => boolean
    hasPermission,     // (permission: Permission) => boolean
  } = useAuth();

  if (isLoading) return <Skeleton />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div>
      <p>স্বাগতম, {user?.nameBn}</p>
      {hasRole('admin') && <AdminPanel />}
      {hasPermission('process:applications') && <AgentQueue />}
      <button onClick={logout}>লগ আউট</button>
    </div>
  );
}
```

### User Roles

| Role | Description |
|------|-------------|
| `citizen` | Standard — own profile, service applications, tracking |
| `agent` | All citizen views + agent processing dashboard |
| `admin` | Full platform access + user management + system settings |

---

## 🌐 Internationalization (i18n)

### How It Works

All user-visible strings live in `src/i18n/translations.ts` as a deeply nested typed object with `bn` and `en` top-level keys. The `LanguageContext` exposes a `t(key)` function using dot notation to look up the correct string for the active language.

### Translation File Structure

```ts
// src/i18n/translations.ts
export const translations = {
  bn: {
    nav: {
      home: 'হোম',
      login: 'প্রবেশ করুন',
      dashboard: 'ড্যাশবোর্ড',
      services: 'সেবাসমূহ',
      about: 'আমাদের সম্পর্কে',
      logout: 'লগ আউট',
    },
    auth: {
      loginTitle: 'পরিচয়ে প্রবেশ করুন',
      nidLabel: 'জাতীয় পরিচয়পত্র নম্বর',
      birthRegLabel: 'জন্ম নিবন্ধন নম্বর',
      loginButton: 'প্রবেশ করুন',
    },
    errors: {
      invalidNID: 'সঠিক জাতীয় পরিচয়পত্র নম্বর দিন',
      rateLimited: 'অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      networkError: 'সংযোগ সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।',
    },
    // ... (dashboard, services, tracking, faq, about, etc.)
  },
  en: {
    // mirrors bn structure exactly
    nav: { home: 'Home', login: 'Login', ... },
    ...
  },
} as const;
```

### Usage in Components

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function LoginPage() {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <form>
      <h1>{t('auth.loginTitle')}</h1>
      <label htmlFor="nid">{t('auth.nidLabel')}</label>
      <button type="button" onClick={toggleLanguage}>
        {language === 'bn' ? 'English' : 'বাংলা'}
      </button>
    </form>
  );
}
```

### Typography

| Script | Font | Loading |
|--------|------|---------|
| বাংলা (Bangla) | Hind Siliguri | `<link rel="preconnect">` in `index.html` |
| English | Manrope | `<link rel="preconnect">` in `index.html` |

Both fonts use `font-display: swap` to prevent Flash of Invisible Text (FOIT).

---

## 🪝 Custom Hooks

### `useAsync<T>` — `src/hooks/useAsync.ts`

Generic async state machine. Wraps any async function with `loading`, `data`, and `error` states.

```tsx
const { data, isLoading, error, execute } = useAsync(fetchCitizenProfile);

useEffect(() => { execute(citizenId); }, [citizenId]);

if (isLoading) return <Skeleton className="h-48" />;
if (error) return <Alert variant="destructive">{error.message}</Alert>;
return <ProfileCard profile={data} />;
```

### `useFormValidation` — `src/hooks/useFormValidation.ts`

Per-field validation that produces bilingual error messages in the currently active language.

```tsx
const { errors, validate, clearError, clearAll } = useFormValidation();

const handleBlur = (field: string, value: string) => {
  validate(field, value); // sets errors[field] if invalid
};

return (
  <div>
    <Input onBlur={(e) => handleBlur('nid', e.target.value)} />
    {errors.nid && <p className="text-red-500 text-sm">{errors.nid}</p>}
  </div>
);
```

### `useSessionGuard` — `src/hooks/useSessionGuard.ts`

Subscribes to the `SESSION_EXPIRED` custom DOM event dispatched by `SessionManager`. Use this in any component that holds sensitive in-memory state to clean up on session expiry.

```tsx
useSessionGuard(() => {
  clearDraftApplication();
  clearUploadedDocuments();
});
```

---

## 📐 Type System

All shared types live in `src/types/` and are barrel-exported from `src/types/index.ts`.

### `src/types/auth.ts`

```ts
type UserRole = 'citizen' | 'agent' | 'admin';

type Permission =
  | 'view:reports'
  | 'manage:users'
  | 'process:applications'
  | 'view:admin-dashboard';

interface AuthUser {
  id: string;
  nid?: string;
  birthRegNumber?: string;
  name: string;               // English name
  nameBn: string;             // Bangla name
  email?: string;
  phone: string;
  role: UserRole;
  permissions: Permission[];
  isVerified: boolean;
  photo?: string;
}

interface LoginCredentials {
  identifier: string;         // NID or birth registration number
  identifierType: 'nid' | 'birth_reg';
  dateOfBirth: string;        // ISO format: YYYY-MM-DD
}
```

### `src/types/citizen.ts`

```ts
interface CitizenProfile {
  id: string;
  nid: string;
  name: string;
  nameBn: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  address: Address;
  photo?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

interface ServiceApplication {
  id: string;
  serviceId: string;
  serviceName: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  trackingNumber: string;
  documents: Document[];
}
```

### `src/types/api.ts`

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiError {
  code: string;           // e.g. 'INVALID_NID', 'RATE_LIMITED'
  message: string;        // human-readable
  field?: string;         // set for field-level validation errors
  status: number;         // HTTP status code
}
```

---

## ♿ Accessibility (WCAG 2.1)

Target level: **WCAG 2.1 AA**

| Criterion | Implementation |
|-----------|---------------|
| **1.1.1 Non-text content** | Meaningful `alt` on all images; `alt=""` on decorative images |
| **1.3.1 Info and relationships** | Semantic HTML: `<nav>`, `<main>`, `<header>`, `<section>`, `<form>`, `<fieldset>` |
| **1.4.3 Contrast ratio** | Bangladesh Green `#006A4E` on white = 7.2:1 (exceeds AA 4.5:1) |
| **2.1.1 Keyboard accessible** | Every interactive element reachable and operable via keyboard alone |
| **2.4.1 Bypass blocks** | `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>` in `index.html`; `id="main-content"` in `Layout.tsx` |
| **2.4.4 Link purpose** | Nav links have `aria-label` with full bilingual descriptions |
| **2.4.7 Focus visible** | `focus-visible:ring-2 focus-visible:ring-primary` on all interactive elements |
| **3.1.1 Language of page** | `<html lang="bn">` / `<html lang="en">` toggled dynamically by `LanguageContext` |
| **4.1.2 Name, role, value** | `aria-current="page"` on active nav; all inputs have associated `<label>` |
| **4.1.3 Status messages** | `aria-live="polite"` on error/success message containers |
| **Session timeout dialog** | `role="alertdialog"` + `aria-labelledby` + `aria-describedby` — focus trapped inside |

---

## 🎨 UI Components

The project uses **shadcn/ui** components built on **Radix UI** primitives. All are accessible by default.

<details>
<summary>Click to expand — all 40+ components</summary>

| Component | File | Description |
|-----------|------|-------------|
| Accordion | `accordion.tsx` | Collapsible Q&A / FAQ sections |
| Alert | `alert.tsx` | Inline status messages (info, warning, error) |
| Alert Dialog | `alert-dialog.tsx` | Blocking confirmation modal (`role="alertdialog"`) |
| Aspect Ratio | `aspect-ratio.tsx` | Responsive fixed-ratio containers |
| Avatar | `avatar.tsx` | User photo + initials fallback |
| Badge | `badge.tsx` | Status chips, category tags |
| Breadcrumb | `breadcrumb.tsx` | Page-hierarchy navigation trail |
| Button | `button.tsx` | Primary · secondary · outline · ghost · destructive variants |
| Calendar | `calendar.tsx` | Accessible month calendar (React Day Picker) |
| Card | `card.tsx` | Content container with header / body / footer slots |
| Carousel | `carousel.tsx` | Embla-powered touch carousel |
| Chart | `chart.tsx` | Recharts wrapper with consistent theming |
| Checkbox | `checkbox.tsx` | Accessible labelled checkbox |
| Collapsible | `collapsible.tsx` | Simple show/hide panel |
| Command | `command.tsx` | CMDK command palette / search |
| Context Menu | `context-menu.tsx` | Right-click / long-press contextual menu |
| Dialog | `dialog.tsx` | Accessible modal window |
| Drawer | `drawer.tsx` | Bottom-sheet / slide-in panel (Vaul) |
| Dropdown Menu | `dropdown-menu.tsx` | Trigger + floating action menu |
| Form | `form.tsx` | React Hook Form + Radix integration with error display |
| Hover Card | `hover-card.tsx` | Hover-triggered floating info card |
| Input | `input.tsx` | Styled text input |
| Input OTP | `input-otp.tsx` | 6-digit segmented OTP input |
| Label | `label.tsx` | Accessible form label (associates with control) |
| Menubar | `menubar.tsx` | Horizontal application menubar |
| Navigation Menu | `navigation-menu.tsx` | Multi-level navigation with keyboard support |
| Pagination | `pagination.tsx` | Page navigation controls |
| Popover | `popover.tsx` | Floating content anchored to a trigger |
| Progress | `progress.tsx` | Linear progress bar |
| Radio Group | `radio-group.tsx` | Mutually exclusive option set |
| Resizable | `resizable.tsx` | Drag-to-resize split panels |
| Scroll Area | `scroll-area.tsx` | Custom-styled scrollable container |
| Select | `select.tsx` | Accessible dropdown select |
| Separator | `separator.tsx` | Horizontal or vertical visual divider |
| Sheet | `sheet.tsx` | Slide-in side panel (top/right/bottom/left) |
| Sidebar | `sidebar.tsx` | Collapsible application sidebar |
| Skeleton | `skeleton.tsx` | Animated loading placeholder |
| Slider | `slider.tsx` | Accessible range input |
| Sonner | `sonner.tsx` | Styled Sonner toast notifications |
| Switch | `switch.tsx` | Toggle on/off switch |
| Table | `table.tsx` | Semantic `<table>` with styled header/body/footer |
| Tabs | `tabs.tsx` | Accessible tabbed content panels |
| Textarea | `textarea.tsx` | Multi-line text input |
| Toggle | `toggle.tsx` | Stateful press/release button |
| Toggle Group | `toggle-group.tsx` | Group of mutually exclusive toggles |
| Tooltip | `tooltip.tsx` | Hover / focus information bubble |

</details>

---

## 🎯 Design System

### Color Palette

| Token | CSS Variable | Hex | Ratio on white | Usage |
|-------|-------------|-----|:--------------:|-------|
| **Primary** | `--color-primary` | `#006A4E` | 7.2:1 ✅ | Bangladesh Green — brand, CTAs, links |
| **Secondary** | `--color-secondary` | `#F42A41` | 4.6:1 ✅ | Bangladesh Red — alerts, error states |
| **Accent** | `--color-accent` | `#10B981` | 2.7:1 | Emerald — success indicators |
| **Background** | `--color-bg` | `#F9FAFB` | — | Page background |
| **Surface** | `--color-surface` | `#FFFFFF` | — | Cards, dialogs, panels |
| **Text** | `--color-text` | `#0F172A` | 18.1:1 ✅ | Primary body text |
| **Muted** | `--color-muted` | `#64748B` | 5.9:1 ✅ | Secondary text, placeholders |

### Tailwind v4 Migration Notes

Tailwind CSS v4 renamed several utility classes. All occurrences have been updated across the codebase:

| v3 class (deprecated) | v4 class (current) |
|-----------------------|-------------------|
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-gradient-to-l` | `bg-linear-to-l` |
| `bg-gradient-to-b` | `bg-linear-to-b` |
| `bg-gradient-to-t` | `bg-linear-to-t` |
| `bg-gradient-to-br` | `bg-linear-to-br` |
| `bg-gradient-to-tr` | `bg-linear-to-tr` |
| `flex-shrink-0` | `shrink-0` |
| `flex-grow` | `grow` |
| `z-[9999]` | `z-9999` |
| `w-[600px]` | `w-150` |

### Design Principles

1. **Accessibility First** — every component meets WCAG 2.1 AA before it ships
2. **Mobile-first responsive** — base styles at 375 px, tested to 1920 px
3. **Bilingual typography** — Hind Siliguri (Bangla) and Manrope (English) coexist without layout conflict
4. **Government aesthetic** — high contrast, professional, no dark UI patterns
5. **Progressive disclosure** — complex flows broken into clear labeled steps
6. **Purposeful animation** — `motion/react` used only for meaningful state transitions, never decoration

---

## 📊 Build Output

Latest production build (`npm run build`):

| Metric | Value |
|--------|-------|
| Main bundle (gzip) | ~129 kB |
| Page chunks | 30+ async JS files |
| Total modules bundled | ~2,034 |
| Build time | ~1.3 s |
| Build tool | Vite 6.3.5 + SWC |
| Output directory | `build/` |

---

## 📊 Platform Statistics

| Metric | Value |
|--------|-------|
| Active Citizens | 10M+ (১ কোটি+) |
| Integrated Services | 50+ |
| System Uptime | 99.9% |
| Transactions Processed | 50M+ |

---

## 🤝 Contributing

### Workflow

```bash
# Fork and clone
git checkout -b feature/your-feature-name

# Make changes, then verify:
npm run build          # must pass with zero errors

# Commit using Conventional Commits
git commit -m "feat: add police clearance tracking page"
git commit -m "fix: correct aria-label on language toggle"
git commit -m "refactor: extract useServiceForm hook"

git push origin feature/your-feature-name
# Open a Pull Request → base: main
```

### Code Standards

| Area | Rule |
|------|------|
| **TypeScript** | No `any`, no non-null assertion (`!`) without justification |
| **i18n** | Every user-visible string needs both `bn` and `en` entries in `translations.ts` |
| **Security** | Never bypass `sanitize.ts`, `ProtectedRoute`, or `SecureMemoryStore` |
| **Accessibility** | Test with keyboard only before submitting; add `aria-*` attributes where needed |
| **Components** | Use existing shadcn/ui components; do not add new UI libraries without team discussion |
| **Build** | `npm run build` must produce zero errors and zero Vite warnings before opening a PR |
| **Commits** | Use Conventional Commits format: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:` |

---

## 📄 License

This project is **private** and proprietary to the Government of Bangladesh.
All rights reserved. Unauthorized use, reproduction, or distribution is strictly prohibited.

---

## 🙏 Acknowledgments

| Project | License | Usage in Porichoy |
|---------|---------|-------------------|
| [shadcn/ui](https://ui.shadcn.com/) | MIT | UI component library |
| [Radix UI](https://www.radix-ui.com/) | MIT | Accessible component primitives |
| [Lucide](https://lucide.dev/) | ISC | Icon library |
| [motion](https://motion.dev/) | MIT | Animation library |
| [Vite](https://vitejs.dev/) | MIT | Build tool |
| [Tailwind CSS](https://tailwindcss.com/) | MIT | Utility-first CSS |
| [React Hook Form](https://react-hook-form.com/) | MIT | Form state management |
| [Recharts](https://recharts.org/) | MIT | Dashboard charts |
| [Unsplash](https://unsplash.com) | Unsplash License | Photography |

---

<div align="center">

**গণপ্রজাতন্ত্রী বাংলাদেশ সরকার**

*Government of the People's Republic of Bangladesh*

*Ministry of Information and Communication Technology*

---

Made with ❤️ for 170 million citizens of Bangladesh

</div>
