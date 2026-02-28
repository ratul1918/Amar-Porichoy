import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

const ROLES: Array<{
  name: RoleName;
  displayName: string;
  description: string;
  permissions: string[];
}> = [
  {
    name: 'CITIZEN',
    displayName: 'নাগরিক (Citizen)',
    description: 'Regular registered citizen',
    permissions: [
      'profile:read', 'profile:update',
      'applications:create', 'applications:read:own',
      'documents:upload', 'documents:read:own',
      'tracking:read:own',
    ],
  },
  {
    name: 'AGENT',
    displayName: 'এজেন্ট (Agent)',
    description: 'Authorized service agent',
    permissions: ['citizens:read', 'applications:read', 'documents:read', 'nid:verify'],
  },
  {
    name: 'OFFICER',
    displayName: 'কর্মকর্তা (Officer)',
    description: 'Government processing officer',
    permissions: [
      'citizens:read', 'citizens:update',
      'applications:read', 'applications:process', 'applications:approve', 'applications:reject',
      'documents:read', 'documents:verify',
      'nid:verify',
    ],
  },
  {
    name: 'SUPERVISOR',
    displayName: 'সুপারভাইজার (Supervisor)',
    description: 'Team supervisor',
    permissions: [
      'citizens:read', 'citizens:update',
      'applications:read', 'applications:process', 'applications:approve',
      'applications:reject', 'applications:reassign',
      'officers:manage', 'reports:read',
    ],
  },
  {
    name: 'ADMIN',
    displayName: 'প্রশাসক (Admin)',
    description: 'Platform administrator',
    permissions: [
      'users:manage', 'roles:assign',
      'services:manage', 'reports:read', 'reports:export',
      'audit:read', 'system:config',
    ],
  },
  {
    name: 'SUPER_ADMIN',
    displayName: 'সুপার প্রশাসক (Super Admin)',
    description: 'Full platform access',
    permissions: ['*'],
  },
];

const SERVICES = [
  {
    code: 'PASSPORT_NEW',
    nameBn: 'নতুন পাসপোর্ট',
    nameEn: 'New Passport',
    category: 'TRAVEL',
    processingDays: 21,
    fees: 3450,
    formSchema: { fields: ['nameEn', 'dateOfBirth', 'gender', 'emergencyContact', 'travelPurpose'] },
    requiredDocuments: ['NID_CARD', 'PHOTO', 'BIRTH_CERTIFICATE'],
    requiresVerification: true,
    minimumAge: 0,
    sortOrder: 1,
  },
  {
    code: 'NID_REISSUE',
    nameBn: 'জাতীয় পরিচয়পত্র পুনর্মুদ্রণ',
    nameEn: 'NID Card Reissue',
    category: 'IDENTITY',
    processingDays: 30,
    fees: 230,
    formSchema: { fields: ['reason', 'policeReport'] },
    requiredDocuments: ['PHOTO'],
    requiresVerification: true,
    sortOrder: 2,
  },
  {
    code: 'BIRTH_CERTIFICATE',
    nameBn: 'জন্ম নিবন্ধন সনদ',
    nameEn: 'Birth Registration Certificate',
    category: 'CIVIL',
    processingDays: 14,
    fees: 50,
    formSchema: { fields: ['nameBn', 'nameEn', 'dateOfBirth', 'birthPlace', 'parentNames'] },
    requiredDocuments: ['HOSPITAL_RECORD', 'PARENT_NID'],
    requiresVerification: false,
    sortOrder: 3,
  },
  {
    code: 'DRIVING_LICENCE_NEW',
    nameBn: 'নতুন ড্রাইভিং লাইসেন্স',
    nameEn: 'New Driving Licence',
    category: 'TRANSPORT',
    processingDays: 30,
    fees: 1085,
    formSchema: { fields: ['vehicleType', 'medicalFitness', 'testDate'] },
    requiredDocuments: ['NID_CARD', 'PHOTO', 'MEDICAL_CERTIFICATE'],
    requiresVerification: true,
    minimumAge: 18,
    sortOrder: 4,
  },
  {
    code: 'POLICE_CLEARANCE',
    nameBn: 'পুলিশ ক্লিয়ারেন্স সার্টিফিকেট',
    nameEn: 'Police Clearance Certificate',
    category: 'LEGAL',
    processingDays: 15,
    fees: 500,
    formSchema: { fields: ['purpose', 'destinationCountry', 'employerName'] },
    requiredDocuments: ['NID_CARD', 'PHOTO', 'PASSPORT'],
    requiresVerification: true,
    sortOrder: 5,
  },
  {
    code: 'VOTER_REGISTRATION',
    nameBn: 'ভোটার নিবন্ধন',
    nameEn: 'Voter Registration',
    category: 'CIVIL',
    processingDays: 60,
    fees: 0,
    formSchema: { fields: ['presentAddress', 'constituencyCode'] },
    requiredDocuments: ['NID_CARD', 'PHOTO'],
    requiresVerification: true,
    minimumAge: 18,
    sortOrder: 6,
  },
  {
    code: 'TIN_REGISTRATION',
    nameBn: 'টিআইএন নিবন্ধন',
    nameEn: 'TIN Registration',
    category: 'TAX',
    processingDays: 3,
    fees: 0,
    formSchema: { fields: ['employmentType', 'annualIncome', 'businessAddress'] },
    requiredDocuments: ['NID_CARD'],
    requiresVerification: true,
    sortOrder: 7,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Upsert roles
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { permissions: role.permissions, displayName: role.displayName },
      create: role,
    });
    console.log(`  ✓ Role: ${role.name}`);
  }

  // Upsert service catalog
  for (const service of SERVICES) {
    await prisma.serviceCatalog.upsert({
      where: { code: service.code },
      update: service,
      create: service,
    });
    console.log(`  ✓ Service: ${service.code}`);
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
