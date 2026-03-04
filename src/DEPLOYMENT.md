# Porichoy Deployment Guide

Complete step-by-step guide to deploy Porichoy to production.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Sample data inserted
- [ ] Admin user created
- [ ] Environment variables configured
- [ ] Edge functions tested locally
- [ ] Frontend build tested
- [ ] All API endpoints working

---

## 🗄️ Step 1: Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: Porichoy
   - **Database Password**: (generate strong password)
   - **Region**: Southeast Asia (Singapore) - closest to Bangladesh
   - **Pricing Plan**: Pro (for production)
4. Wait 2-3 minutes for provisioning

### 1.2 Create Database Tables

1. Navigate to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy and paste from `DATABASE_SCHEMA.md`:
   - First, run **citizens** table script
   - Then **services** table
   - Then **applications** table
   - Then **application_status_history** table
   - Finally **documents** table
4. Run each script by clicking **RUN**

### 1.3 Create Indexes

Run index creation scripts from `DATABASE_SCHEMA.md`:

```sql
CREATE INDEX idx_citizens_nid ON citizens(nid);
CREATE INDEX idx_citizens_birth_reg ON citizens(birth_reg_number);
-- ... etc (all indexes from schema file)
```

### 1.4 Enable Row Level Security

For each table, run:

```sql
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

Then create policies from `DATABASE_SCHEMA.md`.

### 1.5 Create Triggers

Run trigger scripts:

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_citizens_updated_at
  BEFORE UPDATE ON citizens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
-- ... (repeat for other tables)
```

### 1.6 Insert Sample Services

```sql
INSERT INTO services (name_bn, name_en, category, description_bn, description_en, processing_time_days, fee, icon) VALUES
('পাসপোর্ট', 'Passport', 'travel', 'নতুন পাসপোর্ট বা নবায়ন', 'New passport or renewal', 30, 5000, 'FileText'),
('জাতীয় পরিচয়পত্র', 'National ID Card', 'identity', 'নতুন এনআইডি বা সংশোধন', 'New NID or correction', 15, 0, 'Shield'),
-- ... (add all services from DATABASE_SCHEMA.md)
```

---

## 🚀 Step 2: Deploy Edge Functions

### 2.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 2.2 Login to Supabase

```bash
supabase login
```

This will open a browser window. Authorize the CLI.

### 2.3 Link Your Project

```bash
supabase link --project-ref your-project-ref
```

Find your project ref in Supabase dashboard under Settings > General.

### 2.4 Deploy Functions

```bash
cd /path/to/porichoy
supabase functions deploy make-server-7b2c3016
```

### 2.5 Verify Deployment

Test the health endpoint:

```bash
curl https://your-project.supabase.co/functions/v1/make-server-7b2c3016/health
```

Should return:
```json
{
  "success": true,
  "message": "Porichoy API Server is running",
  "timestamp": "2026-03-01T...",
  "version": "1.0.0"
}
```

---

## 🎨 Step 3: Configure Frontend

### 3.1 Update Environment Variables

Create `.env.production`:

```env
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Settings > API > Project URL and anon public key

### 3.2 Update API Base URL

In `/utils/supabase/info.tsx`, ensure it uses environment variables:

```tsx
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'your-project-id';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
```

### 3.3 Build for Production

```bash
npm run build
```

This creates optimized production build in `dist/` folder.

### 3.4 Test Production Build Locally

```bash
npx vite preview
```

Open http://localhost:4173 and test:
- Landing page loads
- Language toggle works
- Navigation works
- Login flow (after creating test user)

---

## 👤 Step 4: Create Admin User

### 4.1 Register Through UI

1. Go to `/login` page
2. Click "Register" (you'll need to implement this button)
3. Fill in admin details:
   - Email: admin@porichoy.gov.bd
   - Phone: 01700000000
   - NID or Birth Reg: (use test value)
   - Name: Admin User
   - Name (Bangla): প্রশাসক
   - Date of Birth: 1990-01-01

### 4.2 Promote to Admin via SQL

Go to Supabase SQL Editor and run:

```sql
UPDATE citizens
SET 
  role = 'admin',
  verification_status = 'verified'
WHERE email = 'admin@porichoy.gov.bd';
```

### 4.3 Test Admin Access

1. Login with admin credentials
2. Navigate to `/admin`
3. Verify you can see dashboard statistics

---

## 🌐 Step 5: Deploy Frontend

### Option A: Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add your `.env.production` values
6. Click "Deploy"

### Option B: Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add from `.env.production`
6. Click "Deploy"

### Option C: Deploy to Traditional Server

```bash
# Build the project
npm run build

# Copy dist/ folder to your server
scp -r dist/* user@your-server.com:/var/www/porichoy

# Configure nginx or Apache to serve the files
```

Nginx config example:

```nginx
server {
    listen 80;
    server_name porichoy.gov.bd;
    root /var/www/porichoy;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SSL configuration (use Certbot)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/porichoy.gov.bd/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/porichoy.gov.bd/privkey.pem;
}
```

---

## 🔒 Step 6: Security Hardening

### 6.1 Enable SSL/TLS

For custom domain:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d porichoy.gov.bd -d www.porichoy.gov.bd

# Auto-renew
sudo certbot renew --dry-run
```

### 6.2 Configure CORS

In Supabase dashboard:
- Go to Settings > API > CORS
- Add your production domain: `https://porichoy.gov.bd`

### 6.3 Set Up Rate Limiting

In Supabase Edge Functions, implement rate limiting (already done in code):

```typescript
// RateLimiter class in server code
const limiter = new RateLimiter(5, 900000); // 5 attempts per 15 minutes
```

### 6.4 Review RLS Policies

Ensure all RLS policies are active:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- List all policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## 📊 Step 7: Monitoring & Analytics

### 7.1 Enable Supabase Monitoring

In Supabase dashboard:
- Go to **Reports**
- Monitor database performance
- Check API usage
- Review function invocations

### 7.2 Set Up Error Tracking

Optional: Integrate Sentry

```bash
npm install @sentry/react
```

```typescript
// In main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

### 7.3 Set Up Logging

Supabase automatically logs edge function errors. View them in:
- Dashboard > Edge Functions > Logs

### 7.4 Set Up Alerts

In Supabase dashboard:
- Go to Settings > Alerts
- Configure alerts for:
  - High database CPU usage
  - High API error rate
  - Storage limits

---

## 🧪 Step 8: Production Testing

### 8.1 Test User Flows

- [ ] Citizen registration
- [ ] Login with NID
- [ ] Login with Birth Registration
- [ ] View dashboard
- [ ] Browse services
- [ ] Submit application
- [ ] Track application
- [ ] Upload documents
- [ ] Admin login
- [ ] Admin dashboard
- [ ] Citizen verification
- [ ] Application processing
- [ ] Service management

### 8.2 Test API Endpoints

```bash
# Health check
curl https://your-project.supabase.co/functions/v1/make-server-7b2c3016/health

# Test authentication (after creating user)
curl -X POST https://your-project.supabase.co/functions/v1/make-server-7b2c3016/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"123456789","identifierType":"nid","dateOfBirth":"1990-01-01"}'

# Test services endpoint
curl https://your-project.supabase.co/functions/v1/make-server-7b2c3016/services
```

### 8.3 Load Testing

Use Apache Bench or similar:

```bash
ab -n 1000 -c 10 https://porichoy.gov.bd/
```

### 8.4 Security Testing

- [ ] SQL injection attempts
- [ ] XSS attempts
- [ ] CSRF protection
- [ ] Authentication bypass attempts
- [ ] File upload validation

---

## 📱 Step 9: Mobile Optimization

### 9.1 Test on Real Devices

- [ ] Android phones (various screen sizes)
- [ ] iOS devices
- [ ] Tablets
- [ ] Old devices (slow networks)

### 9.2 Performance Optimization

```bash
# Analyze bundle size
npm run build -- --mode production

# Check Lighthouse score
npx lighthouse https://porichoy.gov.bd --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## 📋 Step 10: Launch Checklist

### Pre-Launch

- [ ] All database tables created
- [ ] RLS policies enabled
- [ ] Edge functions deployed
- [ ] Frontend deployed
- [ ] Admin user created
- [ ] Sample services added
- [ ] SSL certificate active
- [ ] CORS configured
- [ ] Monitoring enabled
- [ ] Backup strategy in place

### Launch Day

- [ ] Announce to pilot user group
- [ ] Monitor error logs
- [ ] Watch database performance
- [ ] Check API response times
- [ ] Be ready for support calls

### Post-Launch

- [ ] Gather user feedback
- [ ] Monitor analytics
- [ ] Fix critical bugs immediately
- [ ] Plan first update

---

## 🔄 Backup & Recovery

### Daily Backups (Automatic)

Supabase Pro includes:
- Daily automated backups (retained for 7 days)
- Point-in-time recovery

### Manual Backup

```bash
# Backup database
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql

# Backup storage bucket
supabase storage cp make-7b2c3016-documents ./backups/documents --recursive
```

### Recovery

```bash
# Restore database
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql

# Restore storage
supabase storage cp ./backups/documents make-7b2c3016-documents --recursive
```

---

## 📞 Support & Maintenance

### Monitoring Checklist (Daily)

- [ ] Check error logs
- [ ] Review API performance
- [ ] Monitor database size
- [ ] Check storage usage
- [ ] Review user feedback

### Maintenance Schedule

- **Daily**: Review logs and metrics
- **Weekly**: Check for security updates
- **Monthly**: Review and optimize database
- **Quarterly**: Security audit

---

## 🚨 Troubleshooting

### Issue: Edge Function Not Responding

```bash
# Check function logs
supabase functions logs make-server-7b2c3016

# Redeploy function
supabase functions deploy make-server-7b2c3016
```

### Issue: Database Connection Timeout

- Check connection pool settings
- Review slow queries in Supabase dashboard
- Optimize indexes

### Issue: Storage Full

- Check storage usage in dashboard
- Clean up old documents
- Upgrade plan if needed

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ All pages load within 2 seconds
- ✅ Users can register and login
- ✅ Applications can be submitted
- ✅ Admin can manage system
- ✅ No critical errors in logs
- ✅ Lighthouse score > 90
- ✅ Mobile responsive
- ✅ Bangla and English work perfectly

---

**Congratulations! Porichoy is now live! 🎉**

For support, contact: support@porichoy.gov.bd
