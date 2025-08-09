-- Add missing columns to businesses table to fix creation error
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS owner text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create index for better performance on slug lookups
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);

-- Also ensure proper RLS policies for businesses table
-- Fix any remaining RLS recursion issues by refreshing policies

-- First drop existing problematic policies if any
DROP POLICY IF EXISTS "Admins and business owners can view businesses" ON public.businesses;
DROP POLICY IF EXISTS "Only admins can create businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins and business owners can update their businesses" ON public.businesses;
DROP POLICY IF EXISTS "Only admins can delete businesses" ON public.businesses;

-- Recreate clean, non-recursive policies using security definer functions
CREATE POLICY "Admins and business owners can view businesses" 
ON public.businesses 
FOR SELECT 
USING (public.get_current_user_role() = ANY (ARRAY['saas_admin'::text, 'business_owner'::text]));

CREATE POLICY "Only admins can create businesses" 
ON public.businesses 
FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'saas_admin'::text);

CREATE POLICY "Admins and business owners can update their businesses" 
ON public.businesses 
FOR UPDATE 
USING (
  public.get_current_user_role() = 'saas_admin'::text 
  OR (
    public.get_current_user_role() = 'business_owner'::text 
    AND id = public.get_current_user_business_id()
  )
);

CREATE POLICY "Only admins can delete businesses" 
ON public.businesses 
FOR DELETE 
USING (public.get_current_user_role() = 'saas_admin'::text);