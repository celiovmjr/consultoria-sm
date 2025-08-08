-- Add missing columns to professionals table
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS commission INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS store_id UUID;

-- Make email unique if it's not already
CREATE UNIQUE INDEX IF NOT EXISTS professionals_email_unique ON public.professionals(email);