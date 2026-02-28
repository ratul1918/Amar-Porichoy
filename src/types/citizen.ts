/**
 * Citizen domain types
 * These represent core identity entities - treat as PII (Personally Identifiable Information).
 * Never log raw values; always use masked representations in UI and logs.
 */

export type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'rejected';

export type DocumentType = 'nid' | 'birth_certificate' | 'passport';

export interface CitizenIdentity {
  readonly id: string;
  readonly nid: string;              // masked in UI: "****7890"
  readonly birthCertNo?: string;
  readonly nameBn: string;
  readonly nameEn: string;
  readonly fatherNameBn: string;
  readonly fatherNameEn: string;
  readonly motherNameBn: string;
  readonly motherNameEn: string;
  readonly dateOfBirth: string;      // ISO 8601
  readonly addressBn: string;
  readonly addressEn: string;
  readonly phone: string;            // masked in UI: "+880 17**-***678"
  readonly email?: string;
  readonly photoUrl?: string;
  readonly verificationStatus: VerificationStatus;
  readonly verifiedAt?: string;      // ISO 8601
  readonly verifiedFields: readonly string[];
}

export interface ApplicationRecord {
  readonly id: string;
  readonly serviceId: string;
  readonly serviceTitleBn: string;
  readonly serviceTitleEn: string;
  readonly status: ApplicationStatus;
  readonly submittedAt: string;      // ISO 8601
  readonly updatedAt: string;        // ISO 8601
  readonly steps: readonly ApplicationStep[];
  readonly rejectionReason?: BilingualText;
  readonly trackingNumber: string;
}

export type ApplicationStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'completed' | 'rejected';

export interface ApplicationStep {
  readonly nameBn: string;
  readonly nameEn: string;
  readonly completed: boolean;
  readonly completedAt?: string;     // ISO 8601
}

export interface BilingualText {
  readonly bn: string;
  readonly en: string;
}

export interface GovernmentService {
  readonly id: string;
  readonly category: ServiceCategory;
  readonly titleBn: string;
  readonly titleEn: string;
  readonly descBn: string;
  readonly descEn: string;
  readonly requiredDocuments: readonly string[];
  readonly estimatedProcessingDays: number;
  readonly fee: number;              // BDT, 0 = free
  readonly isAvailableOnline: boolean;
}

export type ServiceCategory =
  | 'identity'
  | 'travel'
  | 'legal'
  | 'property'
  | 'business'
  | 'social'
  | 'tax';
