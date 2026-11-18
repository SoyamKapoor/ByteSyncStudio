-- ByteSync Studio: Administrator Roles & Row Level Security (RLS) Hardening
-- Migration 02: Explicit admin authorization table and strict access control policies
-- Enforces that authenticated non-administrators cannot read or manage consultations.

-- 1. Create dedicated admin_users registry for explicit admin grant
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for role checks
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Helper security definer function to check if current caller is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check custom claims / app_metadata in JWT or check presence in admin_users table
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
    OR EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid() AND admin_users.role IN ('admin', 'superadmin')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. RLS Policies on admin_users
CREATE POLICY "Authorized administrators can view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin());

-- 4. Drop old permissive or generic policies on public.consultations
DROP POLICY IF EXISTS "Admins have full access to consultation records" ON public.consultations;
DROP POLICY IF EXISTS "Public cannot read consultation requests" ON public.consultations;
DROP POLICY IF EXISTS "Public visitors can create consultation requests" ON public.consultations;
DROP POLICY IF EXISTS "Public visitors can insert consultation requests" ON public.consultations;
DROP POLICY IF EXISTS "Authorized administrators only can view consultations" ON public.consultations;
DROP POLICY IF EXISTS "Authorized administrators only can update consultations" ON public.consultations;
DROP POLICY IF EXISTS "Authorized administrators only can delete consultations" ON public.consultations;

-- 5. Tighten Consultations RLS:
-- Public visitors (anon or authenticated) may ONLY insert their own consultation booking requests
CREATE POLICY "Public visitors can insert consultation requests"
ON public.consultations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated non-administrators are DENIED read access.
-- Only explicitly authorized administrators can SELECT consultations.
CREATE POLICY "Authorized administrators only can view consultations"
ON public.consultations
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Only explicitly authorized administrators can UPDATE consultations.
CREATE POLICY "Authorized administrators only can update consultations"
ON public.consultations
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only explicitly authorized administrators can DELETE consultations.
CREATE POLICY "Authorized administrators only can delete consultations"
ON public.consultations
FOR DELETE
TO authenticated
USING (public.is_admin());
