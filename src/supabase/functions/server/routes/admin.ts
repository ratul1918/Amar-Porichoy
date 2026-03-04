import { Hono } from 'npm:hono';
import { getSupabaseClient } from '../index.tsx';

export const adminRoutes = new Hono();

// Middleware to verify admin authentication
const requireAdmin = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  // TODO: Verify user is admin
  await next();
};

// Dashboard statistics
adminRoutes.get('/stats', requireAdmin, async (c) => {
  try {
    const supabase = getSupabaseClient();

    // Total citizens
    const { count: totalCitizens } = await supabase
      .from('citizens')
      .select('*', { count: 'exact', head: true });

    // Verified citizens
    const { count: verifiedCitizens } = await supabase
      .from('citizens')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'verified');

    // Total applications
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    // Applications by status
    const { data: applicationsByStatus } = await supabase
      .from('applications')
      .select('status');

    const statusCounts = {
      pending: 0,
      processing: 0,
      approved: 0,
      rejected: 0
    };

    applicationsByStatus?.forEach(app => {
      if (app.status in statusCounts) {
        statusCounts[app.status as keyof typeof statusCounts]++;
      }
    });

    // Applications this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { count: applicationsThisMonth } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString());

    // Active services
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
    return c.json({
      success: false,
      error: 'Failed to fetch statistics'
    }, 500);
  }
});

// Get all citizens (paginated)
adminRoutes.get('/citizens', requireAdmin, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const search = c.req.query('search');
    const status = c.req.query('status');

    const supabase = getSupabaseClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('citizens')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`name.ilike.%${search}%,name_bn.ilike.%${search}%,nid.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('verification_status', status);
    }

    const { data: citizens, error, count } = await query;

    if (error) {
      console.error('Get citizens error:', error);
      return c.json({
        success: false,
        error: 'Failed to fetch citizens'
      }, 500);
    }

    return c.json({
      success: true,
      data: citizens,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get citizens error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch citizens'
    }, 500);
  }
});

// Get all applications (paginated)
adminRoutes.get('/applications', requireAdmin, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const status = c.req.query('status');
    const serviceId = c.req.query('serviceId');

    const supabase = getSupabaseClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('applications')
      .select(`
        *,
        services (
          id,
          name_bn,
          name_en,
          category
        ),
        citizens (
          id,
          name,
          name_bn,
          nid
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq('status', status);
    }

    if (serviceId) {
      query = query.eq('service_id', serviceId);
    }

    const { data: applications, error, count } = await query;

    if (error) {
      console.error('Get applications error:', error);
      return c.json({
        success: false,
        error: 'Failed to fetch applications'
      }, 500);
    }

    return c.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch applications'
    }, 500);
  }
});

// Update citizen verification status
adminRoutes.patch('/citizens/:id/verify', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const { verificationStatus, notes } = await c.req.json();
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('citizens')
      .update({
        verification_status: verificationStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update verification status error:', error);
      return c.json({
        success: false,
        error: 'Failed to update verification status'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Verification status updated successfully',
      data
    });

  } catch (error) {
    console.error('Update verification status error:', error);
    return c.json({
      success: false,
      error: 'Failed to update verification status'
    }, 500);
  }
});

// Create or update service
adminRoutes.post('/services', requireAdmin, async (c) => {
  try {
    const serviceData = await c.req.json();
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('services')
      .insert({
        name_bn: serviceData.nameBn,
        name_en: serviceData.nameEn,
        description_bn: serviceData.descriptionBn,
        description_en: serviceData.descriptionEn,
        category: serviceData.category,
        icon: serviceData.icon,
        processing_time_days: serviceData.processingTimeDays,
        fee: serviceData.fee,
        required_documents: serviceData.requiredDocuments,
        form_fields: serviceData.formFields,
        is_active: serviceData.isActive ?? true
      })
      .select()
      .single();

    if (error) {
      console.error('Create service error:', error);
      return c.json({
        success: false,
        error: 'Failed to create service'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Service created successfully',
      data
    });

  } catch (error) {
    console.error('Create service error:', error);
    return c.json({
      success: false,
      error: 'Failed to create service'
    }, 500);
  }
});

// Update service
adminRoutes.patch('/services/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const serviceData = await c.req.json();
    const supabase = getSupabaseClient();

    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (serviceData.nameBn) updates.name_bn = serviceData.nameBn;
    if (serviceData.nameEn) updates.name_en = serviceData.nameEn;
    if (serviceData.descriptionBn) updates.description_bn = serviceData.descriptionBn;
    if (serviceData.descriptionEn) updates.description_en = serviceData.descriptionEn;
    if (serviceData.category) updates.category = serviceData.category;
    if (serviceData.icon) updates.icon = serviceData.icon;
    if (serviceData.processingTimeDays !== undefined) updates.processing_time_days = serviceData.processingTimeDays;
    if (serviceData.fee !== undefined) updates.fee = serviceData.fee;
    if (serviceData.requiredDocuments) updates.required_documents = serviceData.requiredDocuments;
    if (serviceData.formFields) updates.form_fields = serviceData.formFields;
    if (serviceData.isActive !== undefined) updates.is_active = serviceData.isActive;

    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update service error:', error);
      return c.json({
        success: false,
        error: 'Failed to update service'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Service updated successfully',
      data
    });

  } catch (error) {
    console.error('Update service error:', error);
    return c.json({
      success: false,
      error: 'Failed to update service'
    }, 500);
  }
});

// Delete/deactivate service
adminRoutes.delete('/services/:id', requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('services')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Delete service error:', error);
      return c.json({
        success: false,
        error: 'Failed to delete service'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete service'
    }, 500);
  }
});
