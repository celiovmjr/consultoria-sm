-- Update existing plans to add default commission_percentage if missing
UPDATE public.plans 
SET features = jsonb_set(
  features, 
  '{commission_percentage}', 
  '0'::jsonb
) 
WHERE NOT (features ? 'commission_percentage');