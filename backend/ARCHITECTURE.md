# Porichoy Backend — Architecture Documentation

## Table of Contents

1. [Architecture Decision](#architecture-decision)
2. [Technology Stack](#technology-stack)
3. [System Architecture Diagram](#system-architecture-diagram)
4. [Database Design](#database-design)
5. [Authentication & Session Model](#authentication--session-model)
6. [Security Hardening](#security-hardening)
7. [API Reference](#api-reference)
8. [Module Breakdown](#module-breakdown)
9. [Infrastructure & Deployment](#infrastructure--deployment)
10. [Environment Variables](#environment-variables)
11. [Development Setup](#development-setup)

---

## Architecture Decision

### Modular Monolith (chosen) vs Microservices

| Concern | Modular Monolith ✅ | Microservices |
|---|---|---|
| **Operational complexity** | Single process, single deploy | N services, N deployments |
| **Network latency** | In-process function calls | HTTP/gRPC across services |
| **Transaction safety** | Single DB transaction | Distributed saga/2PC required |
| **Team size** | Appropriate for ≤ 20 engineers | Beneficial at ≥ 50 engineers |
| **Migration path** | Extract modules later when needed | Much harder to consolidate |
| **Data consistency** | ACID guaranteed | Eventual consistency by default |

**Decision**: A **modular monolith** is the correct starting architecture for a government platform. The codebase is structured so that any module (`auth`, `citizen`, `application`, `document`, `audit`) can be extracted into an independent service later — all inter-module calls are via service classes, never direct DB joins across module boundaries.

---

## Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| **Runtime** | Node.js 20 LTS | Active LTS, ESM, excellent TypeScript support |
| **Framework** | Express.js 4.x | Mature, minimal, extensive middleware ecosystem |
| **Language** | TypeScript 5.x | Type safety, IDE support, safer refactoring |
| **ORM** | Prisma 5.x | Type-safe queries, migration engine, schema-as-code |
| **Database** | PostgreSQL 16 | ACID, JSONB, GIN indexes, full-text search, widely understood in BD gov |
| **Cache** | Redis 7 | Token blocklist TTL, rate-limit counters, OTP storage, session cache |
| **Object Storage** | MinIO (S3-compatible) | Self-hosted option; zero code change → AWS S3 in cloud |
| **Validation** | Zod | Runtime schema validation + TypeScript inference |
| **Logging** | Pino | Structured JSON, lowest-overhead logging library in Node.js |
| **Auth** | JWT (HS256) | Stateless access tokens + stateful refresh token rotation |
| **Password hashing** | bcrypt (cost 12) | Industry standard, resistant to GPU attacks |
| **Field encryption** | AES-256-GCM | Authenticated encryption for PII at rest |

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│                                                                      │
│   React SPA (Vite)          Mobile App            Gov Portal        │
│   localhost:5173            iOS / Android          External          │
└────────────────────────────┬────────────────────────────────────────┘
                             │  HTTPS  (TLS 1.3)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         REVERSE PROXY                                │
│                     Nginx / AWS ALB / Traefik                        │
│    • TLS termination    • Static asset serving    • Load balancing   │
└────────────────────────────┬────────────────────────────────────────┘
                             │  HTTP/1.1  (internal)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       EXPRESS.JS SERVER  :3001                       │
│                                                                      │
│  ┌──────────────────── Middleware Stack ───────────────────────┐    │
│  │  requestId │ Helmet │ CORS │ CSRF │ morgan │ bodyParser     │    │
│  │  globalRateLimit │ compress │ cookieParser                  │    │
│  └──────────────────────────────────────────────────────────────┘   │
│                             │                                        │
│  ┌──────────────────── Route Modules ─────────────────────────┐    │
│  │                                                              │    │
│  │  /api/v1/auth        authRateLimit → authRouter             │    │
│  │  /api/v1/citizens    authenticate  → citizenRouter          │    │
│  │  /api/v1/applications authenticate → applicationRouter      │    │
│  │  /api/v1/documents   authenticate  → documentRouter         │    │
│  │  /api/v1/audit       authenticate  → auditRouter            │    │
│  │  GET /health         (public)                               │    │
│  └──────────────────────────────────────────────────────────────┘   │
│                             │                                        │
│  ┌──────────────────── Service Layer ─────────────────────────┐    │
│  │  AuthService │ CitizenService │ ApplicationService          │    │
│  │  DocumentService │ AuditService                             │    │
│  └──────────────────────────────────────────────────────────────┘   │
│                             │                                        │
│  ┌──────────────────── Utility Layer ─────────────────────────┐    │
│  │  JwtUtils │ CryptoUtils │ Validators │ ResponseUtils        │    │
│  │  Logger   │ AppError    │ RedisKeys  │ PrismaClient         │    │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────┬────────────────────┬────────────────────────────────┘
                │                    │
        ┌───────▼──────┐    ┌───────▼──────┐    ┌───────────────────┐
        │  PostgreSQL  │    │    Redis 7   │    │   MinIO / S3      │
        │  16          │    │              │    │                   │
        │  ─────────── │    │  ─────────── │    │  ─────────────── │
        │  users       │    │  token BL    │    │  documents/       │
        │  citizens    │    │  rate limit  │    │  photos/          │
        │  sessions    │    │  login tries │    │                   │
        │  refresh_ttk │    │  OTP codes   │    │  SSE-AES256       │
        │  applications│    │  session map │    │  pre-signed URLs  │
        │  documents   │    │              │    │  5-min TTL        │
        │  audit_logs  │    └──────────────┘    └───────────────────┘
        └──────────────┘
```

---

## Database Design

### Entity-Relationship Overview

```
┌──────────┐       ┌──────────┐       ┌──────────────┐
│   Role   │◄──────│ UserRole │───────►│     User     │
│          │       │ (pivot)  │       │              │
│ name     │       │          │       │ email        │
│ perms[]  │       └──────────┘       │ phone        │
└──────────┘                          │ passwordHash │
                                      │ status       │
                                      │ failedAttempts│
                                      │ lockedUntil  │
                                      └──────┬───────┘
                                             │ 1
                                    ┌────────┴────────┐
                                    │                 │
                                    ▼ 1           ▼ n
                              ┌──────────┐   ┌──────────────┐
                              │ Citizen  │   │   Session    │
                              │          │   │              │
                              │ nameEn   │   │ ipAddress    │
                              │ nameBn   │   │ userAgent    │
                              │ dob      │   │ expiresAt    │
                              │ nid      │   └──────┬───────┘
                              │ gender   │          │ 1:n
                              │ verif.   │          ▼
                              │ address  │   ┌──────────────┐
                              └────┬─────┘   │ RefreshToken │
                                   │ 1:n     │              │
                                   │         │ tokenHash    │
                              ┌────▼──────┐  │ family (UUID)│
                              │Application│  │ replacedBy   │
                              │           │  │ revokedAt    │
                              │ trackingNo│  └──────────────┘
                              │ status    │
                              │ formData  │
                              │ slaDate   │
                              └─────┬─────┘
                                    │ 1:n
                      ┌─────────────┴───────────┐
                      │                         │
                      ▼ 1:n                     ▼ 1:n
               ┌────────────┐          ┌──────────────────────┐
               │  Document  │          │ AppStatusHistory     │
               │            │          │                      │
               │ type       │          │ oldStatus            │
               │ storageKey │          │ newStatus            │
               │ checksum   │          │ changedById          │
               │ scanStatus │          │ comment              │
               └────────────┘          └──────────────────────┘

── Standalone append-only tables ────────────────────────────────────────

  AuditLog          VerificationCode    Notification    ServiceCatalog
  ──────────        ────────────────    ────────────    ──────────────
  userId            userId              userId          code
  action            code (hashed)       channel         name
  entityType        purpose             title           fee
  entityId          expiresAt           body            processingDays
  oldData (JSONB)   usedAt              readAt          formSchema(JSON)
  newData (JSONB)   attempts            metadata        requiredDocs[]
  ipAddress         ────────────────    isRead          requiresVerif
  userAgent         (TOTP/OTP/email)    ────────────────────────────────
  ──────────
  (immutable — no UPDATE/DELETE)
```

### Key Index Strategy

| Table | Index Type | Columns | Purpose |
|---|---|---|---|
| `users` | B-tree | `email`, `phone` | Unique login identifiers |
| `citizens` | GIN | `name_en`, `name_bn` | Trigram full-text search |
| `citizens` | B-tree | `nid_number`, `birth_reg_number` | NID lookup |
| `applications` | B-tree | `tracking_number` | Tracking lookup |
| `applications` | B-tree | `citizen_id`, `status`, `created_at` | Officer queue queries |
| `audit_logs` | B-tree | `user_id`, `entity_type`, `entity_id` | Compliance queries |
| `refresh_tokens` | B-tree | `token_hash` | Token rotation O(log n) |
| `refresh_tokens` | B-tree | `family` | Family revocation |

### Partitioning Strategy (production scale)

`audit_logs` should be partitioned by month using `pg_partman`:

```sql
-- Example: monthly range partitioning on created_at
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## Authentication & Session Model

### Token Architecture

```
Login Request
     │
     ▼
┌─────────────────────────────────────────┐
│  1. Verify email/phone + password        │
│  2. Verify date-of-birth (2nd factor)    │
│  3. Check progressive lockout (Redis)    │
│  4. Create Session record in DB          │
│  5. Generate refresh token family UUID   │
│  6. Store RefreshToken(hash, family)     │
│  7. Sign JWT access token (15m)          │
│  8. Sign JWT refresh token (7d)          │
│  9. Set httpOnly cookie for refresh      │
│ 10. Return { accessToken } in body       │
└─────────────────────────────────────────┘

Access Token Payload (JWT, 15m):
  { sub, citizenId, roles[], permissions[], sessionId, iat, exp }

Refresh Token Payload (JWT, 7d):
  { sub, sessionId, family, iat, exp }
```

### Refresh Token Rotation + Reuse Detection

```
Client sends refresh token (via httpOnly cookie)
         │
         ▼
    Hash token → look up in DB
         │
    ┌────┴──────────────────────────────┐
    │ Found + not revoked?              │ Revoked / missing?
    ▼                                  ▼
 Rotate:                          REUSE DETECTED:
 1. Mark old token revokedAt      Revoke entire family
 2. Create new RefreshToken        (all sessions sharing
 3. Issue new TokenPair            this family UUID)
 4. Update replacedBy chain       → Force full re-login
```

### Progressive Account Lockout

```
Failed login attempt
  → Increment Redis key: login_attempts:{identifier}   TTL=15min
  → attempts >= MAX_LOGIN_ATTEMPTS (5)?
      YES → Set user.lockedUntil = now + 15min in DB
             Return 429 Too Many Requests
      NO  → Return 401 Invalid Credentials (timing-safe)
```

Even when account not found, `bcrypt.compare(password, DUMMY_HASH)` is called to prevent timing attacks that reveal account existence.

---

## Security Hardening

### HTTP Headers (Helmet)

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Content-Security-Policy` | Default restrictive; nonces for inline scripts |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera=(), microphone=(), geolocation=() |

### CSRF Protection

Double-submit cookie pattern:
1. Server sets `__Host-csrf` cookie (httpOnly=false, sameSite=strict, secure)
2. Client reads cookie and mirrors value in `X-CSRF-Token` request header
3. Server rejects any state-changing request where header ≠ cookie value

### Encryption at Rest

| Data | Method |
|---|---|
| Passwords | bcrypt (cost 12) — irreversible |
| NID Registrar API responses | AES-256-GCM (authenticated encryption, random IV per value) |
| Documents in storage | MinIO SSE-AES256 (server-side) |
| Refresh tokens in DB | SHA-256 hash only — raw token never stored |

### Rate Limiting (Redis-backed)

| Endpoint Group | Limit |
|---|---|
| Global (all routes) | 100 req / 15 min per IP |
| Auth (login, register) | 5 req / 15 min per IP |
| Sensitive (OTP, password reset) | 10 req / 15 min per IP |
| Document upload | 20 uploads / 15 min per user |

---

## API Reference

### Auth  `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Create account |
| POST | `/login` | Public | Authenticate, receive tokens |
| POST | `/refresh` | Cookie | Rotate refresh token |
| POST | `/logout` | Bearer | Revoke current session |
| POST | `/logout-all` | Bearer | Revoke all user sessions |
| PATCH | `/change-password` | Bearer | Change password |

### Citizens  `/api/v1/citizens`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | OFFICER+ | Create citizen profile |
| GET | `/me` | CITIZEN | Get own profile |
| PUT | `/me` | CITIZEN | Update own profile (non-sensitive fields) |
| GET | `/` | OFFICER+ | Search + list citizens |
| GET | `/:id` | OFFICER+ | Get citizen by ID |
| PATCH | `/:id/verification` | SUPERVISOR+ | Update verification status |

### Applications  `/api/v1/applications`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | CITIZEN | Create DRAFT application |
| POST | `/:id/submit` | CITIZEN | Submit DRAFT → SUBMITTED |
| GET | `/me` | CITIZEN | List own applications |
| GET | `/track/:trackingNumber` | Public | Public tracking |
| GET | `/` | OFFICER+ | List all applications (filterable) |
| GET | `/:id` | OFFICER+ or owner | Get application details |
| PATCH | `/:id/status` | OFFICER+ | Update status with history entry |

### Documents  `/api/v1/documents`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/upload` | CITIZEN | Upload document (multipart) |
| GET | `/` | CITIZEN | List own documents |
| GET | `/:id/download` | Owner or OFFICER+ | Get 5-min pre-signed URL |
| DELETE | `/:id` | Owner or ADMIN | Soft-delete document |

### Audit Logs  `/api/v1/audit`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | ADMIN, SUPER_ADMIN | Query audit log with filters |

---

## Module Breakdown

```
backend/
├── prisma/
│   ├── schema.prisma          # Single source of truth for DB schema
│   ├── seed.ts                # Initial data (roles, service catalog)
│   └── init-extensions.sql   # PostgreSQL extensions (runs on first boot)
│
├── src/
│   ├── config/
│   │   └── index.ts           # Zod-validated env config (fail-fast)
│   │
│   ├── types/
│   │   └── index.ts           # Shared TypeScript types, DTOs, constants
│   │
│   ├── database/
│   │   ├── client.ts          # Prisma singleton + soft-delete middleware
│   │   └── redis.ts           # Redis singleton + key namespacing helpers
│   │
│   ├── utils/
│   │   ├── logger.ts          # Pino structured logger + redaction
│   │   ├── jwt.utils.ts       # JWT sign/verify, token hashing
│   │   ├── crypto.utils.ts    # AES-256-GCM, bcrypt, OTP, SHA-256
│   │   ├── errors.ts          # AppError class with factory methods
│   │   ├── validators.ts      # Zod schemas + BD-specific validators
│   │   └── response.utils.ts  # Typed API response builders
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT authenticate, token blocklist
│   │   ├── rbac.middleware.ts      # requireRole, requirePermission
│   │   ├── rate-limit.middleware.ts # Redis-backed rate limiters
│   │   ├── security.middleware.ts   # Helmet, CORS, CSRF, error handler
│   │   └── audit.middleware.ts      # Auto-audit trail on HTTP requests
│   │
│   └── modules/
│       ├── auth/
│       │   ├── auth.service.ts      # Business logic
│       │   ├── auth.controller.ts   # HTTP layer
│       │   └── auth.routes.ts       # Express router
│       ├── citizen/              (same structure)
│       ├── application/          (same structure)
│       ├── document/             (same structure)
│       └── audit/
│           └── audit.routes.ts   # Query-only; writes via middleware
│
├── Dockerfile                 # Multi-stage build (builder + runtime)
├── docker-compose.yml         # Orchestrates api, postgres, redis, minio
├── .env.example               # Template — copy to .env
└── ARCHITECTURE.md            # This file
```

---

## Infrastructure & Deployment

### Docker Compose (local/staging)

```bash
# Start all services
cp backend/.env.example backend/.env
# Edit .env with real secrets, then:
docker compose -f backend/docker-compose.yml up -d

# Run DB migrations
docker compose -f backend/docker-compose.yml run --rm migrate

# Seed initial data
docker compose -f backend/docker-compose.yml exec api \
  npx ts-node prisma/seed.ts

# View logs
docker compose -f backend/docker-compose.yml logs -f api

# pgAdmin (dev only)
docker compose -f backend/docker-compose.yml --profile dev up -d pgadmin
```

### Production Deployment Path

```
Phase 1 (now):      Docker Compose on a single VM
                                │
Phase 2 (growth):   Docker Compose → docker swarm  (multi-VM)
                                │
Phase 3 (scale):    Kubernetes (GKE / AKS / on-prem)
                    - Horizontal pod autoscaling for api
                    - RDS PostgreSQL (managed)
                    - ElastiCache Redis (managed)
                    - S3 / Azure Blob Storage
                    - Secrets via Vault / AWS Secrets Manager
```

### Database Connection Pooling

For Kubernetes deployments, run **PgBouncer** as a sidecar or shared service:

```
api pods (N replicas)
     │ max 10 conns each
     ▼
 PgBouncer (pool_mode=transaction)
     │ max 50 server conns
     ▼
 PostgreSQL (max_connections=100)
```

Prisma's built-in connection pooling (`connection_limit` in DATABASE_URL) handles single-node deployments without PgBouncer.

---

## Environment Variables

See [.env.example](.env.example) for the complete annotated list of all environment variables with descriptions and generation commands.

**Critical secrets to generate before first run:**

```bash
# JWT secrets (must be ≥ 64 hex chars)
openssl rand -hex 64   # JWT_ACCESS_SECRET
openssl rand -hex 64   # JWT_REFRESH_SECRET

# AES-256 encryption keys (must be exactly 64 hex chars = 32 bytes)
openssl rand -hex 32   # ENCRYPTION_KEY
openssl rand -hex 32   # FIELD_ENCRYPTION_KEY

# Passwords
openssl rand -base64 32   # POSTGRES_PASSWORD
openssl rand -base64 24   # REDIS_PASSWORD
openssl rand -base64 24   # S3_SECRET_ACCESS_KEY
```

---

## Development Setup

```bash
# 1. Clone and install
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Fill in .env values (see above for secret generation)

# 3. Start infrastructure (Postgres + Redis + MinIO only)
docker compose up -d postgres redis minio minio-init

# 4. Run DB migrations
npm run db:migrate

# 5. Seed initial data
npm run db:seed

# 6. Start dev server (hot-reload)
npm run dev

# 7. (Optional) Open pgAdmin
docker compose --profile dev up -d pgadmin
# Browser: http://localhost:5050
```

### Useful Commands

```bash
npm run dev              # ts-node-dev with hot-reload
npm run build            # Compile TypeScript → dist/
npm run start            # Run compiled dist/server.js
npm run db:generate      # Re-generate Prisma client after schema changes
npm run db:migrate       # Apply pending migrations (dev)
npm run db:seed          # Seed roles + service catalog

npx prisma studio        # Browser-based DB explorer
npx prisma migrate dev --name <desc>   # Create new migration
```

---

*Generated for the Porichoy National Digital Identity Platform.*
*Architecture decisions reflect the operational and regulatory requirements of Bangladesh e-government services.*
