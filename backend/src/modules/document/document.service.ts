import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash, randomBytes } from 'crypto';
import { prisma } from '@database/client';
import { AppError } from '@utils/errors';
import { ErrorCode } from '@app-types/index';
import { DocumentType, DocumentScanStatus } from '@prisma/client';
import { writeAuditLog } from '@middleware/audit.middleware';
import { config } from '@config/index';
import { logger } from '@utils/logger';

// ─────────────────────────────────────────────
// S3 / MinIO Client
// ─────────────────────────────────────────────

const s3 = new S3Client({
  endpoint: config.S3_ENDPOINT,
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_KEY,
  },
  forcePathStyle: config.S3_FORCE_PATH_STYLE,
});

// ─────────────────────────────────────────────
// Multer — memory storage (validate before S3)
// ─────────────────────────────────────────────

const ALLOWED_MIME_TYPES = config.ALLOWED_MIME_TYPES.split(',');
const MAX_FILE_BYTES = config.MAX_FILE_SIZE_MB * 1024 * 1024;

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_BYTES,
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(ErrorCode.INVALID_FILE_TYPE, `File type ${file.mimetype} is not allowed`, 415));
    }
  },
});

// ─────────────────────────────────────────────
// Document Service
// ─────────────────────────────────────────────

export class DocumentService {
  // ── Upload document ──────────────────────────

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    params: {
      documentType: DocumentType;
      applicationId?: string;
    },
    requestId?: string
  ) {
    // Get citizen ID from user ID
    const citizen = await prisma.citizen.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!citizen) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Citizen profile not found');
    }

    // Compute SHA-256 checksum for integrity
    const checksum = createHash('sha256').update(file.buffer).digest('hex');

    // Check for duplicate (same file, same citizen)
    const duplicate = await prisma.document.findFirst({
      where: { citizenId: citizen.id, checksum, isDeleted: false },
      select: { id: true, originalName: true },
    });
    if (duplicate) {
      throw AppError.conflict(ErrorCode.CONFLICT, 'This file has already been uploaded');
    }

    // Storage key: citizen_id/type/timestamp-random.ext
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const bucket = config.S3_BUCKET_DOCUMENTS;
    const key = `${citizen.id}/${params.documentType.toLowerCase()}/${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;

    // Upload to S3/MinIO
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
        Metadata: {
          citizenId: citizen.id,
          originalName: file.originalname,
          checksum,
          uploadedBy: userId,
        },
        // Server-Side Encryption
        ServerSideEncryption: 'AES256',
      })
    );

    // Persist document record
    const document = await prisma.document.create({
      data: {
        citizenId: citizen.id,
        applicationId: params.applicationId ?? undefined,
        type: params.documentType,
        originalName: file.originalname,
        storagePath: key,
        storageBucket: bucket,
        mimeType: file.mimetype,
        fileSizeBytes: file.size,
        checksum,
        uploadedBy: userId,
        scanStatus: DocumentScanStatus.PENDING,
      },
      select: {
        id: true,
        citizenId: true,
        applicationId: true,
        type: true,
        originalName: true,
        mimeType: true,
        fileSizeBytes: true,
        scanStatus: true,
        uploadedAt: true,
      },
    });

    // Enqueue virus scan (in production: publish to message queue)
    this.enqueueScan(document.id).catch((err) =>
      logger.error({ err }, 'Failed to enqueue virus scan')
    );

    await writeAuditLog({
      userId,
      action: 'DOCUMENT_UPLOADED',
      entityType: 'Document',
      entityId: document.id,
      newData: { type: params.documentType, size: file.size },
      requestId,
    });

    return document;
  }

  // ── Get pre-signed download URL ──────────────

  async getDownloadUrl(userId: string, documentId: string): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId, isDeleted: false },
      include: { citizen: { select: { userId: true } } },
    });

    if (!document) throw AppError.notFound(ErrorCode.NOT_FOUND, 'Document not found');

    // Ownership check happens in controller via RBAC/ownership guard
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: document.storageBucket,
        Key: document.storagePath,
        ResponseContentDisposition: `attachment; filename="${document.originalName}"`,
      }),
      { expiresIn: 300 } // 5-minute signed URL
    );

    await writeAuditLog({
      userId,
      action: 'DOCUMENT_VIEWED',
      entityType: 'Document',
      entityId: documentId,
    });

    return signedUrl;
  }

  // ── List documents for a citizen/application ──

  async listDocuments(citizenId: string, applicationId?: string) {
    return prisma.document.findMany({
      where: {
        citizenId,
        applicationId: applicationId ?? undefined,
        isDeleted: false,
      },
      select: {
        id: true,
        type: true,
        originalName: true,
        mimeType: true,
        fileSizeBytes: true,
        scanStatus: true,
        isVerified: true,
        uploadedAt: true,
        expiresAt: true,
      },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  // ── Soft delete document ─────────────────────

  async deleteDocument(userId: string, documentId: string, requestId?: string): Promise<void> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { citizen: { select: { userId: true } } },
    });
    if (!document || document.isDeleted) {
      throw AppError.notFound(ErrorCode.NOT_FOUND, 'Document not found');
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
    });

    await writeAuditLog({
      userId,
      action: 'DOCUMENT_DELETED',
      entityType: 'Document',
      entityId: documentId,
      requestId,
    });
  }

  // ── Mock virus scan enqueue ──────────────────
  // In production: SQS/RabbitMQ message → ClamAV worker

  private async enqueueScan(documentId: string): Promise<void> {
    logger.info({ documentId }, 'Virus scan enqueued (mock)');
    // Simulate async scan result after 2s (replace with real worker)
    setTimeout(async () => {
      await prisma.document.update({
        where: { id: documentId },
        data: {
          scanStatus: DocumentScanStatus.CLEAN,
          scannedAt: new Date(),
        },
      });
    }, 2000);
  }
}

export const documentService = new DocumentService();
