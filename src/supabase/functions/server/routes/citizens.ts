import { Hono } from 'npm:hono';
import { getSupabaseClient } from '../index.tsx';

export const citizenRoutes = new Hono();

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  await next();
};

// Get citizen profile
citizenRoutes.get('/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data: citizen, error } = await supabase
      .from('citizens')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !citizen) {
      return c.json({
        success: false,
        error: 'Citizen not found'
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        id: citizen.id,
        nid: citizen.nid,
        birthRegNumber: citizen.birth_reg_number,
        name: citizen.name,
        nameBn: citizen.name_bn,
        email: citizen.email,
        phone: citizen.phone,
        dateOfBirth: citizen.date_of_birth,
        address: citizen.address,
        fatherName: citizen.father_name,
        motherName: citizen.mother_name,
        photo: citizen.photo_url,
        verificationStatus: citizen.verification_status,
        createdAt: citizen.created_at,
        updatedAt: citizen.updated_at
      }
    });

  } catch (error) {
    console.error('Get citizen error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch citizen profile'
    }, 500);
  }
});

// Update citizen profile
citizenRoutes.patch('/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const supabase = getSupabaseClient();

    // Allowed fields for update
    const allowedFields = ['email', 'phone', 'address', 'photo_url'];
    const filteredUpdates: any = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('citizens')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update citizen error:', error);
      return c.json({
        success: false,
        error: 'Failed to update profile'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Profile updated successfully',
      data
    });

  } catch (error) {
    console.error('Update citizen error:', error);
    return c.json({
      success: false,
      error: 'Failed to update profile'
    }, 500);
  }
});

// Get citizen statistics
citizenRoutes.get('/:id/stats', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    // Get application counts
    const { data: applications } = await supabase
      .from('applications')
      .select('status')
      .eq('citizen_id', id);

    const stats = {
      totalApplications: applications?.length || 0,
      pending: applications?.filter(a => a.status === 'pending').length || 0,
      processing: applications?.filter(a => a.status === 'processing').length || 0,
      approved: applications?.filter(a => a.status === 'approved').length || 0,
      rejected: applications?.filter(a => a.status === 'rejected').length || 0
    };

    return c.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get citizen stats error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch statistics'
    }, 500);
  }
});
