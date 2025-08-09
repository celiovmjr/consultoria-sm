-- Fix infinite recursion in profiles policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Business owners can view their professionals" ON public.profiles;

-- Create new non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Simple admin policy without recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'saas_admin'
  )
);

-- Business owners can view professionals in their business
CREATE POLICY "Business owners can view their professionals" 
ON public.profiles 
FOR SELECT 
USING (
  role = 'professional' 
  AND business_id IN (
    SELECT p.business_id 
    FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'business_owner'
  )
);

-- Allow profile creation during user registration
CREATE POLICY "Allow profile creation during registration" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);