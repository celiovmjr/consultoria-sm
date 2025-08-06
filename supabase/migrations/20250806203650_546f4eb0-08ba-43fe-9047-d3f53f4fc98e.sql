-- Corrigir os dados dos planos para ter os valores corretos
UPDATE public.plans 
SET features = '{"max_businesses": 5, "max_professionals": 10, "commission_percentage": 3, "benefits": ""}'::jsonb 
WHERE name = 'Profissional';

UPDATE public.plans 
SET features = '{"max_businesses": 1, "max_professionals": 3, "commission_percentage": 0, "benefits": ""}'::jsonb 
WHERE name = 'Básico';

UPDATE public.plans 
SET features = '{"max_businesses": -1, "max_professionals": -1, "commission_percentage": 0, "benefits": ""}'::jsonb 
WHERE name = 'Empresarial';