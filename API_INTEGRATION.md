# API Integration & Backend Contract

This document defines the expected API contracts between the frontend and backend for the Porichoy platform.

---

## Base Configuration

```typescript
// Frontend: src/lib/api.ts
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_VERSION = 'v1';
const API_TIMEOUT_MS = 15_000;

// Construct endpoints as: ${API_BASE_URL}/api/${API_VERSION}${endpoint}
```

---

## Authentication Endpoints

### 1. Citizen Login Request OTP

**Endpoint**: `POST /api/v1/auth/request-otp`

**Request**:
```json
{
  "method": "nid" | "birth_certificate",
  "idNumber": "1234567890",
  "dateOfBirth": "1990-01-01"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "sess-abc123",
    "message": "OTP sent to registered phone number",
    "expiresIn": 300
  }
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ID_FORMAT",
    "message": "Invalid NID format",
    "requestId": "req-xyz789"
  }
}
```

---

### 2. Citizen Verify OTP & Login

**Endpoint**: `POST /api/v1/auth/verify-otp`

**Request**:
```json
{
  "sessionId": "sess-abc123",
  "method": "nid" | "birth_certificate",
  "idNumber": "1234567890",
  "dateOfBirth": "1990-01-01",
  "otpCode": "123456"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_secure_token_here",
    "expiresAt": 1708950000000,
    "user": {
      "id": "citizen-001",
      "citizenId": "nid-1234567890",
      "nameBn": "মোহাম্মদ রহিম উদ্দিন",
      "nameEn": "Mohammad Rahim Uddin",
      "phone": "01712XXXXXX",
      "role": "citizen",
      "isVerified": true,
      "sessionId": "sess-abc123",
      "iat": 1708863600,
      "exp": 1708950000
    }
  }
}
```

---

### 3. Admin Login

**Endpoint**: `POST /api/v1/auth/admin-login`

**Request**:
```json
{
  "email": "admin@example.com",
  "password": "secure_password_here"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_secure_token_here",
    "expiresAt": 1708950000000,
    "user": {
      "id": "admin-001",
      "citizenId": "admin-citizen-001",
      "nameBn": "প্রশাসক",
      "nameEn": "Administrator",
      "email": "admin@example.com",
      "phone": "+8801900000000",
      "role": "admin",
      "isVerified": true,
      "sessionId": "sess-admin-xyz",
      "permissions": [
        "applications:read",
        "applications:write",
        "applications:approve",
        "identity:read",
        "identity:verify",
        "users:manage",
        "audit:read"
      ],
      "iat": 1708863600,
      "exp": 1708950000
    }
  }
}
```

---

### 4. Refresh Token

**Endpoint**: `POST /api/v1/auth/refresh`

**Request Headers**:
```
Cookie: refreshToken=rt_secure_token_here
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": 1708950000000
  }
}
```

---

### 5. Logout

**Endpoint**: `POST /api/v1/auth/logout`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Admin Endpoints

### Get All Citizens

**Endpoint**: `GET /api/v1/admin/citizens`

**Query Parameters**:
```
?page=1&limit=20&search=name&status=active&sort=joinDate:desc
```

**Response**:
```json
{
  "success": true,
  "data": {
    "citizens": [
      {
        "id": "citizen-001",
        "name": "Mohammad Rahim Uddin",
        "email": "rahim@example.com",
        "phone": "+8801712345678",
        "nid": "1234567890",
        "verified": true,
        "status": "active" | "suspended" | "pending",
        "joinDate": "2024-01-15T10:30:00Z",
        "lastLogin": "2024-02-25T14:30:00Z",
        "totalApplications": 5
      }
    ],
    "pagination": {
      "total": 152,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

---

### Get All Applications

**Endpoint**: `GET /api/v1/admin/applications`

**Query Parameters**:
```
?page=1&limit=20&status=pending|reviewing|approved|rejected&sort=submittedDate:desc
```

**Response**:
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "APP001",
        "citizenId": "citizen-001",
        "citizenName": "Mohammad Rahim Uddin",
        "service": "Passport Renewal",
        "status": "reviewing",
        "nid": "1234567890",
        "submittedDate": "2024-02-20T10:30:00Z",
        "lastUpdated": "2024-02-25T14:30:00Z",
        "notes": "Documents verified",
        "assignedTo": "officer-001"
      }
    ],
    "pagination": {
      "total": 342,
      "page": 1,
      "limit": 20,
      "pages": 18
    }
  }
}
```

---

### Approve/Reject Application

**Endpoint**: `POST /api/v1/admin/applications/:id/approve` or `/reject`

**Request**:
```json
{
  "status": "approved" | "rejected",
  "notes": "Optional notes for the citizen",
  "approverNotes": "Internal notes for admins only"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "APP001",
    "status": "approved",
    "approvedDate": "2024-02-25T15:00:00Z",
    "approvedBy": "admin-001"
  }
}
```

---

### Get Audit Logs

**Endpoint**: `GET /api/v1/admin/audit`

**Query Parameters**:
```
?page=1&limit=50&event=login|logout|approval|rejection|verification|error
&fromDate=2024-02-20&toDate=2024-02-28&actor=user_id
```

**Response**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "AUD001",
        "eventType": "login" | "logout" | "approval" | "rejection" | "verification" | "error",
        "actor": "admin-001",
        "actorName": "Administrator",
        "action": "Admin login successful",
        "resourceType": "session",
        "resourceId": "sess-admin-001",
        "status": "success" | "failure",
        "timestamp": "2024-02-25T14:30:25Z",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0..."
      }
    ],
    "pagination": {
      "total": 5342,
      "page": 1,
      "limit": 50,
      "pages": 107
    }
  }
}
```

---

### Get Dashboard Statistics

**Endpoint**: `GET /api/v1/admin/dashboard/stats`

**Response**:
```json
{
  "success": true,
  "data": {
    "totalCitizens": 25847,
    "pendingApplications": 342,
    "approvalsToday": 156,
    "activeSessions": 1234,
    "recentStats": {
      "citizenGrowth": "+12.5%",
      "applicationIncrease": "+5.2%"
    },
    "applicationsByStatus": {
      "pending": 150,
      "reviewing": 192,
      "approved": 2500,
      "rejected": 120
    },
    "systemHealth": {
      "apiStatus": "operational",
      "databaseStatus": "healthy",
      "storageUsage": "45%",
      "uptime": "99.95%"
    }
  }
}
```

---

## Citizen Endpoints

### Get My Profile

**Endpoint**: `GET /api/v1/citizen/profile`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "citizen-001",
    "nameBn": "মোহাম্মদ রহিম উদ্দিন",
    "nameEn": "Mohammad Rahim Uddin",
    "nid": "1234567890",
    "birthDate": "1990-01-01",
    "address": "House: 25, Road: 7, Dhanmondi, Dhaka-1205",
    "phone": "01712345678",
    "email": "rahim@example.com",
    "photo": "https://cdn.example.com/photos/citizen-001.jpg",
    "verificationStatus": "verified",
    "verifiedFields": ["name", "nid", "birthDate", "address"],
    "documentScan": {
      "type": "nid",
      "uploadedDate": "2024-01-15",
      "status": "verified"
    }
  }
}
```

---

### Get My Applications

**Endpoint**: `GET /api/v1/citizen/applications`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "APP001",
      "service": "Passport Renewal",
      "status": "processing",
      "submittedDate": "2024-02-20",
      "lastUpdated": "2024-02-25",
      "progressPercentage": 60,
      "nextStep": "Document verification",
      "estimatedCompletion": "2024-03-10"
    }
  ]
}
```

---

### Submit Application

**Endpoint**: `POST /api/v1/citizen/applications`

**Request**:
```json
{
  "serviceId": "passport_renewal",
  "documents": ["doc1_url", "doc2_url"],
  "answers": {
    "purpose": "Travel to UK",
    "duration": "6 months"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "APP001",
    "referenceNumber": "REF-2024-PKR-001",
    "status": "submitted",
    "submittedDate": "2024-02-25T15:30:00Z"
  }
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "requestId": "req-abc123xyz",
    "details": {
      "field": "error_specific_details"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email/password incorrect |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Backend service down |

---

## Request/Response Headers

### Required Request Headers

```
Content-Type: application/json
Accept: application/json
X-Request-Source: web
Authorization: Bearer {access_token}  // For protected endpoints
X-CSRF-Token: {csrf_token}            // For state-changing requests
```

### Response Headers

```
Content-Type: application/json
X-Request-Id: req-abc123
Cache-Control: no-cache, no-store, must-revalidate
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## Frontend Implementation

### Setup API Client

```typescript
// src/lib/api.ts
import type { ApiResponse } from '../types/api';
import { secureStore } from './security';

const API_BASE_URL = process.env.VITE_API_BASE_URL || '';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = secureStore.get('accessToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-Source': 'web',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1${path}`,
      { ...options, headers, credentials: 'include' }
    );

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network request failed',
        requestId: '',
      },
    };
  }
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthSession>> {
    return request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async adminLogin(email: string, password: string): Promise<ApiResponse<AuthSession>> {
    return request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<ApiResponse<void>> {
    return request('/auth/logout', { method: 'POST' });
  },
};
```

---

## Testing API Locally

```bash
# Test citizen login
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess-123",
    "method": "nid",
    "idNumber": "1234567890",
    "dateOfBirth": "1990-01-01",
    "otpCode": "123456"
  }'

# Test admin login
curl -X POST http://localhost:3000/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Test with auth header
curl -X GET http://localhost:3000/api/v1/admin/citizens \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-02-28 | Initial release |

---

**Last Updated**: February 28, 2026  
**API Version**: v1  
**Status**: Production Ready

