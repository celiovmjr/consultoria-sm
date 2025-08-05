-- Add status column to plans table
ALTER TABLE public.plans 
ADD COLUMN status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active';