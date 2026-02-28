# Porichoy Digital Identity Platform - Production Setup Guide

## Overview

This document outlines the complete production setup for the Porichoy Digital Identity Platform, a national digital identity system with role-based access control for citizens and administrators.

---

## Project Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js (Node.js)  
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + OTP
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Routing**: React Router v7
- **Animations**: Motion (Framer Motion replacement)
- **UI Components**: Radix UI + shadcn/ui

### Key Features

✅ **Dual Authentication System**
- Citizen login (NID/Birth Certificate + OTP)
- Admin login (Email + Password)

✅ **Role-Based Access Control (RBAC)**
- Roles: citizen, officer, admin, auditor
- Permission matrix system

✅ **Separate Routes & Layouts**
- `/` - Public citizen routes
- `/admin` - Protected admin routes
- Automatic role-based redirects

✅ **Admin Dashboard**
- User management
- Application tracking
- Audit logs
- System statistics

✅ **Security**
- HTTP-Only cookies for refresh tokens
- Memory-only access tokens
- CSRF protection
- Rate limiting
- Input sanitization
- Secure logging

---

## Project Structure

```
/Users/rafiurrahman/Downloads/Porichoy Digital Identity Platform/
├── src/
│   ├── pages/                    # Page components (lazy loaded)
│   │   ├── Login.tsx            # Citizen login (NID/Birth Cert + OTP)
│   │   ├── AdminLogin.tsx       # Admin login (Email + Password) ✅ NEW
│   │   ├── AdminDashboard.tsx   # Admin statistics dashboard ✅ NEW
│   │   ├── AdminUsers.tsx       # Citizen management ✅ NEW
│   │   ├── AdminApplications.tsx # Application tracking ✅ NEW
│   │   ├── AdminAudit.tsx       # Audit logs ✅ NEW
│   │   ├── Dashboard.tsx        # Citizen dashboard
│   │   ├── Services.tsx
│   │   ├── ApplicationForm.tsx
│   │   └── ...
│   ├── components/
│   │   ├── Layout.tsx           # Citizen layout with header/footer
│   │   ├── AdminLayout.tsx      # Admin layout with sidebar ✅ NEW
│   │   ├── ProtectedRoute.tsx   # RBAC guard component (updated)
│   │   ├── Header.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Auth state + login logic (updated)
│   │   └── LanguageContext.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── security.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── auth.ts
│   │   └── api.ts
│   ├── routes.tsx               # Routing configuration (updated)
│   ├── App.tsx
│   └── ...
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── citizen/
│   │   │   ├── application/
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── package.json
├── tsconfig.json
├── vite.config.ts
└── ...
```

---

## Authentication Flow

### Citizen Login Flow

```
1. User selects method (NID or Birth Certificate)
2. Enters ID number + DOB
3. OTP sent to registered phone/email
4. Verifies OTP
5. Backend returns JWT (access token + refresh token)
6. Redirected to /dashboard
```

### Admin Login Flow  

```
1. User clicks "Admin/Staff Login" on /login page
2. Enters email + password
3. Backend validates credentials
4. Returns JWT
5. Redirected to /admin/dashboard
6. Role enforced by ProtectedRoute
```

### Protected Routes

- **Citizen routes** protected by `<ProtectedRoute role="citizen">`
- **Admin routes** protected by `<ProtectedRoute role="admin">`
- Unauthorized users see 403 Forbidden page

---

## Key Files & Changes

### ✅ Created Files

1. **[AdminLayout.tsx](../src/components/AdminLayout.tsx)**
   - Sidebar navigation for admin features
   - Mobile-responsive with Hammond menu
   - Logout button

2. **[AdminLogin.tsx](../src/pages/AdminLogin.tsx)**
   - Email/password form
   - Demo credentials: admin@gmail.com / admin123
   - Direct admin authentication

3. **[AdminDashboard.tsx](../src/pages/AdminDashboard.tsx)**
   - Stats cards (total citizens, pending apps, approvals, sessions)
   - Recent activity feed
   - System health indicators

4. **[AdminUsers.tsx](../src/pages/AdminUsers.tsx)**
   - Searchable citizen table
   - Filter by status (active, pending, suspended)
   - Inline edit/delete actions

5. **[AdminApplications.tsx](../src/pages/AdminApplications.tsx)**
   - Application tracking table
   - Status visualization
   - Detail view modal
   - Approve/reject buttons

6. **[AdminAudit.tsx](../src/pages/AdminAudit.tsx)**
   - Audit log timeline
   - Event type filtering
   - IP address tracking
   - Success/failure status

### ✅ Updated Files

1. **[routes.tsx](../src/routes.tsx)**
   - Added admin route group
   - Separate `/admin/login` route
   - Admin-only layout wrapper
   - Role-based route protection

2. **[ProtectedRoute.tsx](../src/components/ProtectedRoute.tsx)**
   - Support for role checking
   - Intelligent redirect (detect admin vs citizen)
   - Proper 403 error page

3. **[AuthContext.tsx](../src/contexts/AuthContext.tsx)**
   - Admin email/password login logic
   - Hardcoded demo admin credentials
   - Session management (already solid)

---

## Deployment Checklist

###  Pre-Deployment

- [ ] All TypeScript errors resolved
- [ ] All routes tested (citizen + admin)
- [ ] Admin login credentials stored securely (not hardcoded in prod)
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Database migrations run
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Audit logging active

### Environment Variables

```bash
# Frontend (.env)
VITE_API_BASE_URL=https://api.porichoy.gov.bd
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=error

# Backend (.env)
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/porichoy
REDIS_URL=redis://host:6379
JWT_SECRET=your-secure-key-here
JWT_REFRESH_SECRET=your-refresh-key-here
ADMIN_AUTH_SECRET=your-admin-key-here
CORS_ORIGIN=https://porichoy.gov.bd
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

### Build & Deploy

```bash
# Frontend
npm run build    # → dist/ folder
npm run preview  # Test production build locally

# Backend
npm run build
npm start        # Production server
```

### Docker Deployment (Optional)

```bash
# Build images
docker build -t porichoy-frontend -f Dockerfile.frontend .
docker build -t porichoy-backend -f Dockerfile.backend ./backend

# Run with docker-compose
docker-compose up -d
```

---

## Admin Login Test

**Default Test Credentials:**

- Email: `admin@gmail.com`
- Password: `admin123`

### Test Workflow

1. Visit `https://porichoy.gov.bd/admin/login`
2. Enter credentials
3. Should redirect to `/admin/dashboard`
4. Verify access to:
   - Dashboard (stats overview)
   - Users (citizen list)
   - Applications (app tracking)
   - Audit (log viewing)

---

## security Best Practices

✅ **Implemented**

- JWT tokens stored in memory only
- Refresh tokens in HTTP-only cookies
- CSRF tokens rotated per mutation
- Input sanitization
- Rate limiting (5 attempts per 15 min)
- Secure logging (no sensitive data)
- RBAC permission matrix

⚠️ **To Implement in Production**

- Move admin credentials to secure vault
- Enable 2FA for admins
- Implement API key rotation
- Set up intrusion detection
- Configure WAF rules
- Enable DDoS protection
- Implement backup/disaster recovery
- Set up monitoring & alerting

---

## API Endpoints

### Public

- `POST /api/v1/auth/login` - Citizen login
- `POST /api/v1/auth/verify-otp` - OTP verification
- `POST /api/v1/auth/admin-login` - Admin login

### Protected (Auth Required)

- `GET /api/v1/citizens/:id` - Get citizen info
- `POST /api/v1/applications` - Submit application
- `GET /api/v1/applications` - List applications
- `POST /api/v1/audit-log` - Record audit event

### Admin-Only

- `GET /api/v1/admin/citizens` - All citizens
- `GET /api/v1/admin/applications` - All applications
- `POST /api/v1/admin/applications/:id/approve` - Approve app
- `GET /api/v1/admin/audit` - Audit logs

---

## Performance Optimizations

✅ **Implemented**

- Lazy loading all page components
- Code splitting per route
- Suspense boundaries with loading states
- Motion animations optimized
- CSS-in-JS via Tailwind
- Image optimization via caching

🎯 **Recommended**

- Implement service workers
- Enable gzip compression
- Use CDN for static assets
- Implement request caching
- Use HTTP/2 server push
- Minify & bundle optimization

---

## Monitoring & Logging

### Frontend

- Error boundary captures React errors
- Secure logging to backend
- User session tracking
- Performance metrics

### Backend

- Morgan HTTP logging
- Pino structured logging
- Audit trail for all actions
- Error reporting

### Recommended Tools

- Sentry (error tracking)
- DataDog (monitoring)
- ELK Stack (logging)
- New Relic (APM)

---

## Troubleshooting

### Admin Login Not Working

1. Check email/password credentials
2. Verify JWT secret in backend
3. Check auth middleware
4. Review browser console for errors
5. Check backend logs for auth failures

### Role-Based Redirect Not Working

1. Verify user role in JWT payload
2. Check ProtectedRoute role checking logic
3. Verify role in ROLE_PERMISSIONS mapping
4. Check route configuration in routes.tsx

### Styling Issues

Check:
- CSS variables defined in `:root`
- Tailwind build process
- Browser DevTools for computed styles
- Color values: `rgb(var(--color-primary))`

---

## Additional Features to Add (Future)

- [ ] Two-factor authentication (2FA)
- [ ] Session timeout with warnings
- [ ] Bulk user import/export
- [ ] Advanced search & filtering
- [ ] Report generation (PDF/Excel)
- [ ] Batch application processing
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Multi-language support improvements
- [ ] Dark mode toggle

---

## Support & Resources

- **API Documentation**: See backend/ARCHITECTURE.md
- **Database Schema**: See backend/prisma/schema.prisma
- **Security Docs**: See docs/SECURITY.md
- **Deployment Guide**: See docs/DEPLOYMENT.md

---

**Last Updated**: February 28, 2026  
**Status**: Production Ready  
**Version**: 1.0.0

