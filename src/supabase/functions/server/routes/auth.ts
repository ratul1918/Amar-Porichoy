import { Hono } from 'npm:hono';
import { getSupabaseClient } from '../index.tsx';

export const authRoutes = new Hono();

// Register new citizen
authRoutes.post('/register', async (c) => {
  try {
    const { email, password, phone, nid, birthRegNumber, name, nameBn, dateOfBirth } = await c.req.json();
    const supabase = getSupabaseClient();

    // Validate required fields
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

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true, // Auto-confirm since email server not configured
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
      return c.json({
        success: false,
        error: authError.message
      }, 400);
    }

    // Create citizen profile
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
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return c.json({
        success: false,
        error: 'Failed to create citizen profile'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Registration successful. Please login.',
      data: {
        id: citizenData.id,
        email: citizenData.email,
        name: citizenData.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({
      success: false,
      error: 'Registration failed'
    }, 500);
  }
});

// Login
authRoutes.post('/login', async (c) => {
  try {
    const { identifier, identifierType, dateOfBirth } = await c.req.json();
    const supabase = getSupabaseClient();

    // Find user by NID or Birth Registration
    const column = identifierType === 'nid' ? 'nid' : 'birth_reg_number';
    const { data: citizen, error: findError } = await supabase
      .from('citizens')
      .select('*')
      .eq(column, identifier)
      .eq('date_of_birth', dateOfBirth)
      .single();

    if (findError || !citizen) {
      return c.json({
        success: false,
        error: 'Invalid credentials'
      }, 401);
    }

    // Generate session token (in production, use proper JWT)
    const sessionToken = crypto.randomUUID();
    
    // Update last login
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
            : citizen.role === 'agent'
            ? ['process:applications']
            : []
        },
        token: sessionToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      error: 'Login failed'
    }, 500);
  }
});

// Verify token
authRoutes.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, error: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseClient();

    // In production, verify JWT token properly
    // For now, we'll just check if user exists
    
    return c.json({
      success: true,
      data: { valid: true }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return c.json({
      success: false,
      error: 'Invalid token'
    }, 401);
  }
});

// Logout
authRoutes.post('/logout', async (c) => {
  // In production, invalidate the token
  return c.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Admin login
authRoutes.post('/admin/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Validate admin credentials
    if (email === 'admin@gmail.com' && password === 'admin123') {
      // Generate admin session token
      const sessionToken = crypto.randomUUID();

      return c.json({
        success: true,
        data: {
          user: {
            id: 'admin-001',
            email: 'admin@gmail.com',
            name: 'System Administrator',
            nameBn: 'সিস্টেম প্রশাসক',
            role: 'admin',
            isVerified: true,
            permissions: [
              'view:reports',
              'manage:users',
              'process:applications',
              'view:admin-dashboard',
              'manage:services',
              'manage:system'
            ]
          },
          token: sessionToken
        }
      });
    } else {
      return c.json({
        success: false,
        error: 'Invalid admin credentials'
      }, 401);
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({
      success: false,
      error: 'Admin login failed'
    }, 500);
  }
});