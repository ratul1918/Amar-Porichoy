import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono@4/cors';
import { logger } from 'npm:hono@4/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
}));

app.use('*', logger(console.log));

// Create Supabase client for service role operations
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Health check
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'Porichoy API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ===== AUTH ROUTES =====
const auth = new Hono();

// Register new citizen
auth.post('/register', async (c) => {
  try {
    const { email, password, phone, nid, birthRegNumber, name, nameBn, dateOfBirth } = await c.req.json();
    const supabase = getSupabaseClient();

    if (!email || !password || !phone) {
      return c.json({
        success: false,
        error: 'Email, password, and phone are required'
      }, 400);
    }

    if (!nid && !birthRegNumber) {
      return c.json({
        success: false,
        error: 'Either NID or Birth Registration Number is required'
      }, 400);
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true,
      user_metadata: {
        name,
        nameBn,
        nid,
        birthRegNumber,
        dateOfBirth,
        role: 'citizen'
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return c.json({ success: false, error: authError.message }, 400);
    }

    const { data: citizenData, error: citizenError } = await supabase
      .from('citizens')
      .insert({
        id: authData.user.id,
        email,
        phone,
        nid,
        birth_reg_number: birthRegNumber,
        name,
        name_bn: nameBn,
        date_of_birth: dateOfBirth,
        role: 'citizen',
        verification_status: 'pending'
      })
      .select()
      .single();

    if (citizenError) {
      console.error('Citizen profile creation error:', citizenError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return c.json({ success: false, error: 'Failed to create citizen profile' }, 500);
    }

    return c.json({
      success: true,
      message: 'Registration successful. Please login.',
      data: { id: citizenData.id, email: citizenData.email, name: citizenData.name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, error: 'Registration failed' }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const { identifier, identifierType, dateOfBirth } = await c.req.json();
    const supabase = getSupabaseClient();

    const column = identifierType === 'nid' ? 'nid' : 'birth_reg_number';
    const { data: citizen, error: findError } = await supabase
      .from('citizens')
      .select('*')
      .eq(column, identifier)
      .eq('date_of_birth', dateOfBirth)
      .single();

    if (findError || !citizen) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    const sessionToken = crypto.randomUUID();
    
    await supabase
      .from('citizens')
      .update({ last_login: new Date().toISOString() })
      .eq('id', citizen.id);

    return c.json({
      success: true,
      data: {
        user: {
          id: citizen.id,
          nid: citizen.nid,
          birthRegNumber: citizen.birth_reg_number,
          name: citizen.name,
          nameBn: citizen.name_bn,
          email: citizen.email,
          phone: citizen.phone,
          role: citizen.role,
          isVerified: citizen.verification_status === 'verified',
          photo: citizen.photo_url,
          permissions: citizen.role === 'admin' 
            ? ['view:reports', 'manage:users', 'process:applications', 'view:admin-dashboard']
            : citizen.role === 'agent' ? ['process:applications'] : []
        },
        token: sessionToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: 'Login failed' }, 500);
  }
});

// ===== SERVICES ROUTES =====
const services = new Hono();

services.get('/', async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    const supabase = getSupabaseClient();

    let query = supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name_bn', { ascending: true });

    if (category) query = query.eq('category', category);
    if (search) query = query.or(`name_bn.ilike.%${search}%,name_en.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) {
      console.error('Get services error:', error);
      return c.json({ success: false, error: 'Failed to fetch services' }, 500);
    }

    return c.json({
      success: true,
      data: data.map(s => ({
        id: s.id,
        nameBn: s.name_bn,
        nameEn: s.name_en,
        descriptionBn: s.description_bn,
        descriptionEn: s.description_en,
        category: s.category,
        icon: s.icon,
        processingTimeDays: s.processing_time_days,
        fee: s.fee,
        requiredDocuments: s.required_documents,
        isActive: s.is_active
      }))
    });
  } catch (error) {
    console.error('Get services error:', error);
    return c.json({ success: false, error: 'Failed to fetch services' }, 500);
  }
});

services.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !service) {
      return c.json({ success: false, error: 'Service not found' }, 404);
    }

    return c.json({
      success: true,
      data: {
        id: service.id,
        nameBn: service.name_bn,
        nameEn: service.name_en,
        descriptionBn: service.description_bn,
        descriptionEn: service.description_en,
        category: service.category,
        icon: service.icon,
        processingTimeDays: service.processing_time_days,
        fee: service.fee,
        requiredDocuments: service.required_documents,
        formFields: service.form_fields,
        isActive: service.is_active
      }
    });
  } catch (error) {
    console.error('Get service error:', error);
    return c.json({ success: false, error: 'Failed to fetch service' }, 500);
  }
});

// ===== ADMIN ROUTES =====
const admin = new Hono();

admin.get('/stats', async (c) => {
  try {
    const supabase = getSupabaseClient();

    const { count: totalCitizens } = await supabase
      .from('citizens')
      .select('*', { count: 'exact', head: true });

    const { count: verifiedCitizens } = await supabase
      .from('citizens')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'verified');

    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    const { data: applicationsByStatus } = await supabase
      .from('applications')
      .select('status');

    const statusCounts = { pending: 0, processing: 0, approved: 0, rejected: 0 };
    applicationsByStatus?.forEach(app => {
      if (app.status in statusCounts) {
        statusCounts[app.status as keyof typeof statusCounts]++;
      }
    });

    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { count: applicationsThisMonth } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString());

    const { count: activeServices } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    return c.json({
      success: true,
      data: {
        totalCitizens: totalCitizens || 0,
        verifiedCitizens: verifiedCitizens || 0,
        totalApplications: totalApplications || 0,
        applicationsThisMonth: applicationsThisMonth || 0,
        activeServices: activeServices || 0,
        applicationsByStatus: statusCounts
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return c.json({ success: false, error: 'Failed to fetch statistics' }, 500);
  }
});

// Mount routes
app.route('/auth', auth);
app.route('/services', services);
app.route('/admin', admin);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  }, 500);
});

Deno.serve(app.fetch);
