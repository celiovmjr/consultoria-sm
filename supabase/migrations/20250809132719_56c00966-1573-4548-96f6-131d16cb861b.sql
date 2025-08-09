-- Remove all existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Business owners can view their professionals" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;

-- Ensure the security definer function exists and is correct
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create a function to get current user's business_id
CREATE OR REPLACE FUNCTION public.get_current_user_business_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER  
SET search_path = public
AS $$
  SELECT business_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Admin policy using security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'saas_admin');

-- Business owners can view professionals in their business
CREATE POLICY "Business owners can view their professionals" 
ON public.profiles 
FOR SELECT 
USING (
  role = 'professional' 
  AND business_id = public.get_current_user_business_id()
  AND public.get_current_user_role() = 'business_owner'
);