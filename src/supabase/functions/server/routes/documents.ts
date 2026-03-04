import { Hono } from 'npm:hono';
import { getSupabaseClient } from '../index.tsx';

export const documentRoutes = new Hono();

const BUCKET_NAME = 'make-7b2c3016-documents';

// Initialize storage bucket on startup
const initBucket = async () => {
  const supabase = getSupabaseClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
    });
    console.log(`Created storage bucket: ${BUCKET_NAME}`);
  }
};

// Initialize bucket
initBucket();

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  await next();
};

// Upload document
documentRoutes.post('/upload', requireAuth, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const applicationId = formData.get('applicationId') as string;
    const documentType = formData.get('documentType') as string;

    if (!file || !applicationId || !documentType) {
      return c.json({
        success: false,
        error: 'File, applicationId, and documentType are required'
      }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicationId}/${documentType}-${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({
        success: false,
        error: 'Failed to upload file'
      }, 500);
    }

    // Save document record
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        application_id: applicationId,
        document_type: documentType,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Clean up uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([fileName]);
      return c.json({
        success: false,
        error: 'Failed to save document record'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id: document.id,
        fileName: document.file_name,
        fileSize: document.file_size,
        uploadedAt: document.uploaded_at
      }
    });

  } catch (error) {
    console.error('Upload document error:', error);
    return c.json({
      success: false,
      error: 'Failed to upload document'
    }, 500);
  }
});

// Get documents for an application
documentRoutes.get('/application/:applicationId', requireAuth, async (c) => {
  try {
    const applicationId = c.req.param('applicationId');
    const supabase = getSupabaseClient();

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Get documents error:', error);
      return c.json({
        success: false,
        error: 'Failed to fetch documents'
      }, 500);
    }

    // Generate signed URLs for each document
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const { data: signedUrl } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(doc.file_path, 3600); // 1 hour expiry

        return {
          id: doc.id,
          documentType: doc.document_type,
          fileName: doc.file_name,
          fileSize: doc.file_size,
          mimeType: doc.mime_type,
          uploadedAt: doc.uploaded_at,
          url: signedUrl?.signedUrl
        };
      })
    );

    return c.json({
      success: true,
      data: documentsWithUrls
    });

  } catch (error) {
    console.error('Get documents error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch documents'
    }, 500);
  }
});

// Download document
documentRoutes.get('/:id/download', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    // Get document record
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !document) {
      return c.json({
        success: false,
        error: 'Document not found'
      }, 404);
    }

    // Generate signed URL
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(document.file_path, 300); // 5 minutes

    if (urlError || !signedUrl) {
      console.error('URL generation error:', urlError);
      return c.json({
        success: false,
        error: 'Failed to generate download URL'
      }, 500);
    }

    return c.json({
      success: true,
      data: {
        url: signedUrl.signedUrl,
        fileName: document.file_name
      }
    });

  } catch (error) {
    console.error('Download document error:', error);
    return c.json({
      success: false,
      error: 'Failed to download document'
    }, 500);
  }
});

// Delete document
documentRoutes.delete('/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient();

    // Get document record
    const { data: document, error: findError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !document) {
      return c.json({
        success: false,
        error: 'Document not found'
      }, 404);
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([document.file_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete record from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return c.json({
        success: false,
        error: 'Failed to delete document'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete document'
    }, 500);
  }
});
