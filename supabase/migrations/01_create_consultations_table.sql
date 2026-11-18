-- ByteSync Studio: Consultation Bookings Schema
-- Migration 01: Create consultations table with RLS and indexing

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  industry TEXT NOT NULL,
  service TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_budget TEXT,
  consultation_type TEXT NOT NULL DEFAULT 'Free Discovery Call',
  preferred_date TEXT,
  preferred_time TEXT,
  confirmed_at TIMESTAMPTZ,
  booking_status TEXT NOT NULL DEFAULT 'pending_review' 
    CHECK (booking_status IN ('pending_review', 'awaiting_payment', 'confirmed', 'reschedule_requested', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'not_required'
    CHECK (payment_status IN ('not_required', 'pending', 'paid', 'failed', 'refunded')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for efficient queries and administration
CREATE INDEX IF NOT EXISTS idx_consultations_email ON public.consultations(email);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(booking_status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_industry ON public.consultations(industry);
CREATE INDEX IF NOT EXISTS idx_consultations_service ON public.consultations(service);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_consultations_updated_at ON public.consultations;
CREATE TRIGGER trigger_update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) Hardening
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- 1. Public can only INSERT their own requests (cannot view or harvest competitor bookings)
CREATE POLICY "Public visitors can create consultation requests"
ON public.consultations
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Strictly prohibit public SELECT access to protect customer privacy
CREATE POLICY "Public cannot read consultation requests"
ON public.consultations
FOR SELECT
TO public
USING (false);

-- Optional Admin Users registry for explicit dashboard access
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Explicitly authorized administrators ONLY have read and write access
-- Authenticated non-administrators are prohibited from accessing consultation records
CREATE POLICY "Only authorized administrators have access to consultation records"
ON public.consultations
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
  OR EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid() AND admin_users.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
  OR EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid() AND admin_users.role IN ('admin', 'superadmin')
  )
);

-- 5. Grant table access permissions to Supabase API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.consultations TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.consultations TO authenticated;
GRANT INSERT ON TABLE public.consultations TO anon;

GRANT ALL ON TABLE public.admin_users TO postgres, service_role;
GRANT SELECT ON TABLE public.admin_users TO authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;


