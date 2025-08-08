-- Enable auth schema if not already enabled
-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('saas_admin', 'business_owner', 'professional', 'client')),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'saas_admin'
  )
);

CREATE POLICY "Business owners can view their professionals"
ON public.profiles FOR SELECT
USING (
  role = 'professional' AND business_id IN (
    SELECT business_id FROM public.profiles 
    WHERE id = auth.uid() AND role = 'business_owner'
  )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update professionals table to link to profiles
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add unique constraint on user_id in professionals
CREATE UNIQUE INDEX IF NOT EXISTS professionals_user_id_unique ON public.professionals(user_id);

-- Add trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update businesses table RLS policies to be role-based
DROP POLICY IF EXISTS "Businesses are viewable by everyone" ON public.businesses;
DROP POLICY IF EXISTS "Businesses can be inserted by everyone" ON public.businesses;
DROP POLICY IF EXISTS "Businesses can be updated by everyone" ON public.businesses;
DROP POLICY IF EXISTS "Businesses can be deleted by everyone" ON public.businesses;

CREATE POLICY "Admins and business owners can view businesses"
ON public.businesses FOR SELECT
USING (
  public.get_current_user_role() IN ('saas_admin', 'business_owner')
);

CREATE POLICY "Only admins can create businesses"
ON public.businesses FOR INSERT
WITH CHECK (public.get_current_user_role() = 'saas_admin');

CREATE POLICY "Admins and business owners can update their businesses"
ON public.businesses FOR UPDATE
USING (
  public.get_current_user_role() = 'saas_admin' OR
  (public.get_current_user_role() = 'business_owner' AND 
   id IN (SELECT business_id FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY "Only admins can delete businesses"
ON public.businesses FOR DELETE
USING (public.get_current_user_role() = 'saas_admin');