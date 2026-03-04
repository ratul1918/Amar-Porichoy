# Supabase Edge Function Setup

## Updated Structure

The Porichoy backend has been consolidated into a single edge function file for easier deployment.

## Folder Structure

```
supabase/
└── functions/
    ├── deno.json                          # Deno configuration
    └── make-server-7b2c3016/
        └── index.ts                       # Main edge function (all-in-one)
```

## What Changed

**Before:** Separate route files
```
/supabase/functions/server/
├── index.tsx
└── routes/
    ├── auth.ts
    ├── citizens.ts
    ├── services.ts
    └── ...
```

**After:** Single consolidated file
```
/supabase/functions/make-server-7b2c3016/
└── index.ts  (contains all routes)
```

## Available Endpoints

All endpoints are now in one file at `/supabase/functions/make-server-7b2c3016/index.ts`

### Authentication Routes (`/auth`)
- POST `/auth/register` - Register new citizen
- POST `/auth/login` - Login with NID or Birth Registration

### Services Routes (`/services`)
- GET `/services` - List all services (with optional filters)
- GET `/services/:id` - Get single service details

### Admin Routes (`/admin`)
- GET `/admin/stats` - Get dashboard statistics

## How to Deploy

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref your-project-ref
```

Find your project ref in Supabase Dashboard > Settings > General

### 4. Deploy the Function

```bash
supabase functions deploy make-server-7b2c3016
```

### 5. Test the Deployment

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

## API Base URL

After deployment, your API will be available at:
```
https://your-project-id.supabase.co/functions/v1/make-server-7b2c3016
```

## Testing Endpoints

### Health Check
```bash
curl https://your-project.supabase.co/functions/v1/make-server-7b2c3016/health
```

### Get Services
```bash
curl https://your-project.supabase.co/functions/v1/make-server-7b2c3016/services
```

### Get Admin Stats (requires auth)
```bash
curl https://your-project.supabase.co/functions/v1/make-server-7b2c3016/admin/stats \
  -H "Authorization: Bearer your-anon-key"
```

## Local Development

To test locally before deploying:

```bash
# Start Supabase locally
supabase start

# Serve the function locally
supabase functions serve make-server-7b2c3016 --no-verify-jwt

# In another terminal, test it
curl http://localhost:54321/functions/v1/make-server-7b2c3016/health
```

## Environment Variables

The function automatically has access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (use carefully!)

No need to set these manually - Supabase provides them automatically.

## Troubleshooting

### Error: "Module not found"
- Make sure you're in the project root directory
- Ensure the function is in `supabase/functions/make-server-7b2c3016/index.ts`
- Check that imports use `npm:` prefix (e.g., `npm:hono@4`)

### Error: "Failed to bundle"
- Check Deno syntax (use `Deno.env.get()` not `process.env`)
- Ensure all imports have version numbers (e.g., `npm:hono@4`)
- Use `.ts` extension for imports (not `.js`)

### Error: "CORS issues"
- CORS is configured to allow all origins (*)
- For production, update origin to your domain

## What's Included

The consolidated edge function includes:

✅ **Authentication**
- Register with email/password
- Login with NID or Birth Registration

✅ **Services**
- List all services
- Get service details
- Filter by category
- Search by name

✅ **Admin**
- Dashboard statistics
- Citizen counts
- Application metrics

## Future Additions

To add more routes, edit `/supabase/functions/make-server-7b2c3016/index.ts` and add:

```typescript
// Create new route group
const citizens = new Hono();

citizens.get('/:id', async (c) => {
  // Your code here
});

// Mount it
app.route('/citizens', citizens);
```

Then redeploy:
```bash
supabase functions deploy make-server-7b2c3016
```

## Benefits of Single File

✅ Easier to deploy
✅ No module resolution issues
✅ Faster cold starts
✅ Simpler debugging
✅ Better for edge runtime

## Notes

- The old `/supabase/functions/server/` structure is kept for reference
- Use the new `/supabase/functions/make-server-7b2c3016/index.ts` for deployment
- All routes remain the same - only the file structure changed
- No changes needed to frontend code

## Support

For deployment issues:
- Check Supabase function logs in dashboard
- Enable verbose logging: `supabase functions deploy --debug`
- View logs: `supabase functions logs make-server-7b2c3016`
