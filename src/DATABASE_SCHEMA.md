# Porichoy Database Schema

This document describes the PostgreSQL database schema for the Porichoy platform.

## Overview

The database uses Supabase (PostgreSQL) with Row Level Security (RLS) enabled for data protection.

## Tables

### 1. citizens

Stores citizen profile information.

```sql
CREATE TABLE citizens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  nid VARCHAR(17) UNIQUE,
  birth_reg_number VARCHAR(17) UNIQUE,
  name VARCHAR(255) NOT NULL,
  name_bn VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  address JSONB,
  photo_url TEXT,
  role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'agent', 'admin')),
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT check_identifier CHECK (nid IS NOT NULL OR birth_reg_number IS NOT NULL)
);

CREATE INDEX idx_citizens_nid ON citizens(nid);
CREATE INDEX idx_citizens_birth_reg ON citizens(birth_reg_number);
CREATE INDEX idx_citizens_email ON citizens(email);
CREATE INDEX idx_citizens_role ON citizens(role);
CREATE INDEX idx_citizens_verification_status ON citizens(verification_status);
```

### 2. services

Stores available government services.

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_bn TEXT,
  description_en TEXT,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  processing_time_days INTEGER DEFAULT 7,
  fee DECIMAL(10, 2) DEFAULT 0,
  required_documents JSONB DEFAULT '[]'::jsonb,
  form_fields JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);
```

### 3. applications

Stores citizen service applications.

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  form_data JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'processing', 'approved', 'rejected')),
  assigned_to UUID REFERENCES citizens(id),
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_applications_citizen_id ON applications(citizen_id);
CREATE INDEX idx_applications_service_id ON applications(service_id);
CREATE INDEX idx_applications_tracking_number ON applications(tracking_number);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_assigned_to ON applications(assigned_to);
```

### 4. application_status_history

Tracks status changes for applications.

```sql
CREATE TABLE application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES citizens(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_history_application_id ON application_status_history(application_id);
CREATE INDEX idx_status_history_created_at ON application_status_history(created_at DESC);
```

### 5. documents

Stores uploaded documents for applications.

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
```

## Initial Data Seeding

### Sample Services

```sql
INSERT INTO services (name_bn, name_en, category, description_bn, description_en, processing_time_days, fee, icon) VALUES
('পাসপোর্ট', 'Passport', 'travel', 'নতুন পাসপোর্ট বা নবায়ন', 'New passport or renewal', 30, 5000, 'FileText'),
('জাতীয় পরিচয়পত্র', 'National ID Card', 'identity', 'নতুন এনআইডি বা সংশোধন', 'New NID or correction', 15, 0, 'Shield'),
('জন্ম নিবন্ধন সনদ', 'Birth Certificate', 'identity', 'জন্ম নিবন্ধন সনদ সংগ্রহ', 'Obtain birth registration certificate', 7, 0, 'FileText'),
('পুলিশ ক্লিয়ারেন্স', 'Police Clearance', 'legal', 'চারিত্রিক সনদপত্র', 'Character certificate', 14, 500, 'Shield'),
('ড্রাইভিং লাইসেন্স', 'Driving License', 'transport', 'নতুন বা নবায়ন', 'New or renewal', 21, 1000, 'Car'),
('ভোটার নিবন্ধন', 'Voter Registration', 'civil', 'ভোটার তালিকায় নাম অন্তর্ভুক্তি', 'Voter list enrollment', 10, 0, 'Users'),
('ট্রেড লাইসেন্স', 'Trade License', 'business', 'ব্যবসা নিবন্ধন', 'Business registration', 30, 2000, 'Briefcase'),
('টিন সার্টিফিকেট', 'TIN Certificate', 'tax', 'করদাতা শনাক্তকরণ নম্বর', 'Taxpayer identification number', 7, 0, 'FileText');
```

### Sample Admin User

```sql
-- This would be done through Supabase Auth Admin API
-- Then update the citizens table
UPDATE citizens 
SET role = 'admin', verification_status = 'verified'
WHERE email = 'admin@porichoy.gov.bd';
```

## Row Level Security (RLS) Policies

### Citizens Table

```sql
-- Enable RLS
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;

-- Citizens can read their own data
CREATE POLICY "Citizens can view own profile"
  ON citizens FOR SELECT
  USING (auth.uid() = id);

-- Citizens can update their own profile (limited fields)
CREATE POLICY "Citizens can update own profile"
  ON citizens FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all citizens
CREATE POLICY "Admins can view all citizens"
  ON citizens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM citizens
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Applications Table

```sql
-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Citizens can view their own applications
CREATE POLICY "Citizens can view own applications"
  ON applications FOR SELECT
  USING (citizen_id = auth.uid());

-- Citizens can create applications
CREATE POLICY "Citizens can create applications"
  ON applications FOR INSERT
  WITH CHECK (citizen_id = auth.uid());

-- Agents and admins can view all applications
CREATE POLICY "Staff can view all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM citizens
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- Agents and admins can update applications
CREATE POLICY "Staff can update applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM citizens
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );
```

### Services Table

```sql
-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Everyone can view active services
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Only admins can manage services
CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM citizens
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Functions and Triggers

### Update timestamp trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_citizens_updated_at
  BEFORE UPDATE ON citizens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the table creation scripts in order
4. Run the RLS policy scripts
5. Run the trigger scripts
6. Insert initial data (services and admin user)
7. Configure Storage bucket for documents (already handled in code)

## Environment Variables

Add these to your `.env` file:

```env
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Notes

- All timestamps are stored in UTC
- JSONB is used for flexible data structures (address, form_data, etc.)
- UUIDs are used for primary keys
- Indexes are created on frequently queried columns
- Soft deletes are used where appropriate (is_active flag)
- Foreign keys use appropriate ON DELETE actions
