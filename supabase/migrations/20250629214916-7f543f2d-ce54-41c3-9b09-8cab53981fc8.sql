
-- Add commission_percentage column to plans table
ALTER TABLE public.plans 
ADD COLUMN commission_percentage DECIMAL(5,2) DEFAULT 0.00;

-- Update the existing plans with sample commission values
UPDATE public.plans 
SET commission_percentage = 2.50 
WHERE name = 'Básico';

UPDATE public.plans 
SET commission_percentage = 3.00 
WHERE name = 'Premium';

UPDATE public.plans 
SET commission_percentage = 1.50 
WHERE name = 'Enterprise';

-- Add max_stores column to plans table  
ALTER TABLE public.plans 
ADD COLUMN max_stores INTEGER NOT NULL DEFAULT 1;

-- Update existing plans with store limits
UPDATE public.plans 
SET max_stores = 1 
WHERE name = 'Básico';

UPDATE public.plans 
SET max_stores = 3 
WHERE name = 'Premium';

UPDATE public.plans 
SET max_stores = -1 
WHERE name = 'Enterprise'; -- -1 means unlimited

-- Update sample data to reflect the new structure
UPDATE public.plans 
SET features = '["Até 3 profissionais", "1 filial", "Agendamentos ilimitados", "Suporte por email", "Comissão de 2.5%"]'
WHERE name = 'Básico';

UPDATE public.plans 
SET features = '["Até 10 profissionais", "Até 3 filiais", "Relatórios avançados", "Suporte prioritário", "Integração com WhatsApp", "Comissão de 3%"]'
WHERE name = 'Premium';

UPDATE public.plans 
SET features = '["Profissionais ilimitados", "Filiais ilimitadas", "Múltiplos negócios", "API dedicada", "Suporte 24/7", "Comissão de 1.5%"]'
WHERE name = 'Enterprise';
