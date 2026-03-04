import { Hono } from 'npm:hono';
import { getSupabaseClient } from '../index.tsx';

export const serviceRoutes = new Hono();

// Get all services (public)
serviceRoutes.get('/', async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    const supabase = getSupabaseClient();

    let query = supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name_bn', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name_bn.ilike.%${search}%,name_en.ilike.%${search}%,description_bn.ilike.%${search}%`);
    }

    const { data: services, error } = await query;

    if (error) {
      console.error('Get services error:', error);
      return c.json({
        success: false,
        error: 'Failed to fetch services'
      }, 500);
    }

    return c.json({
      success: true,
      data: services.map(service => ({
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
        isActive: service.is_active
      }))
    });

  } catch (error) {
    console.error('Get services error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch services'
    }, 500);
  }
});

// Get single service
serviceRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !service) {
      return c.json({
        success: false,
        error: 'Service not found'
      }, 404);
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
    return c.json({
      success: false,
      error: 'Failed to fetch service'
    }, 500);
  }
});

// Get service categories
serviceRoutes.get('/meta/categories', async (c) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('services')
      .select('category')
      .eq('is_active', true);

    if (error) {
      console.error('Get categories error:', error);
      return c.json({
        success: false,
        error: 'Failed to fetch categories'
      }, 500);
    }

    const categories = [...new Set(data.map(s => s.category))].filter(Boolean);

    return c.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch categories'
    }, 500);
  }
});
