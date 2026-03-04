import { Hono } from 'npm:hono';
import { getSupabaseClient } from '../index.tsx';

export const applicationRoutes = new Hono();

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  await next();
};

// Create new application
applicationRoutes.post('/', requireAuth, async (c) => {
  try {
    const { citizenId, serviceId, formData, documents } = await c.req.json();
    const supabase = getSupabaseClient();

    // Generate tracking number
    const trackingNumber = `PAL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        citizen_id: citizenId,
        service_id: serviceId,
        tracking_number: trackingNumber,
        form_data: formData,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Create application error:', error);
      return c.json({
        success: false,
        error: 'Failed to create application'
      }, 500);
    }

    // Create status history entry
    await supabase
      .from('application_status_history')
      .insert({
        application_id: application.id,
        status: 'submitted',
        notes: 'Application submitted successfully',
        created_at: new Date().toISOString()
      });

    return c.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application.id,
        trackingNumber: application.tracking_number,
        status: application.status,
        submittedAt: application.submitted_at
      }
    });

  } catch (error) {
    console.error('Create application error:', error);
    return c.json({
      success: false,
      error: 'Failed to create application'
    }, 500);
  }
});

// Get all applications for a citizen
applicationRoutes.get('/citizen/:citizenId', requireAuth, async (c) => {
  try {
    const citizenId = c.req.param('citizenId');
    const status = c.req.query('status');
    const supabase = getSupabaseClient();

    let query = supabase
      .from('applications')
      .select(`
        *,
        services (
          id,
          name_bn,
          name_en,
          category
        )
      `)
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: applications, error } = await query;

    if (error) {
      console.error('Get applications error:', error);
      return c.json({
        success: false,
        error: 'Failed to fetch applications'
      }, 500);
    }

    return c.json({
      success: true,
      data: applications.map(app => ({
        id: app.id,
        trackingNumber: app.tracking_number,
        serviceId: app.service_id,
        serviceName: app.services?.name_bn || 'Unknown Service',
        serviceNameEn: app.services?.name_en || 'Unknown Service',
        category: app.services?.category,
        status: app.status,
        submittedAt: app.submitted_at,
        updatedAt: app.updated_at,
        completedAt: app.completed_at
      }))
    });

  } catch (error) {
    console.error('Get applications error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch applications'
    }, 500);
  }
});

// Get single application details
applicationRoutes.get('/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        services (
          id,
          name_bn,
          name_en,
          category,
          processing_time_days,
          fee
        ),
        citizens (
          id,
          name,
          name_bn,
          nid,
          email,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error || !application) {
      return c.json({
        success: false,
        error: 'Application not found'
      }, 404);
    }

    // Get status history
    const { data: history } = await supabase
      .from('application_status_history')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: true });

    return c.json({
      success: true,
      data: {
        id: application.id,
        trackingNumber: application.tracking_number,
        citizenId: application.citizen_id,
        citizenName: application.citizens?.name_bn,
        citizenNid: application.citizens?.nid,
        serviceId: application.service_id,
        serviceName: application.services?.name_bn,
        serviceNameEn: application.services?.name_en,
        category: application.services?.category,
        fee: application.services?.fee,
        formData: application.form_data,
        status: application.status,
        submittedAt: application.submitted_at,
        updatedAt: application.updated_at,
        completedAt: application.completed_at,
        assignedTo: application.assigned_to,
        notes: application.notes,
        statusHistory: history?.map(h => ({
          status: h.status,
          notes: h.notes,
          createdBy: h.created_by,
          createdAt: h.created_at
        })) || []
      }
    });

  } catch (error) {
    console.error('Get application error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch application'
    }, 500);
  }
});

// Track application by tracking number
applicationRoutes.get('/track/:trackingNumber', async (c) => {
  try {
    const trackingNumber = c.req.param('trackingNumber');
    const supabase = getSupabaseClient();

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        services (
          name_bn,
          name_en,
          processing_time_days
        )
      `)
      .eq('tracking_number', trackingNumber)
      .single();

    if (error || !application) {
      return c.json({
        success: false,
        error: 'Application not found'
      }, 404);
    }

    // Get status history
    const { data: history } = await supabase
      .from('application_status_history')
      .select('status, notes, created_at')
      .eq('application_id', application.id)
      .order('created_at', { ascending: true });

    return c.json({
      success: true,
      data: {
        trackingNumber: application.tracking_number,
        serviceName: application.services?.name_bn,
        serviceNameEn: application.services?.name_en,
        status: application.status,
        submittedAt: application.submitted_at,
        estimatedCompletionDays: application.services?.processing_time_days,
        statusHistory: history || []
      }
    });

  } catch (error) {
    console.error('Track application error:', error);
    return c.json({
      success: false,
      error: 'Failed to track application'
    }, 500);
  }
});

// Update application status (admin/agent only)
applicationRoutes.patch('/:id/status', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const { status, notes } = await c.req.json();
    const supabase = getSupabaseClient();

    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'approved' || status === 'rejected') {
      updates.completed_at = new Date().toISOString();
    }

    const { data: application, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update application status error:', error);
      return c.json({
        success: false,
        error: 'Failed to update application status'
      }, 500);
    }

    // Add to status history
    await supabase
      .from('application_status_history')
      .insert({
        application_id: id,
        status,
        notes,
        created_at: new Date().toISOString()
      });

    return c.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Update application status error:', error);
    return c.json({
      success: false,
      error: 'Failed to update application status'
    }, 500);
  }
});
