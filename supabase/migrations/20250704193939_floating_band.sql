/*
  # Adicionar coluna max_stores à tabela plans

  1. Alterações na tabela
    - Adiciona coluna `max_stores` à tabela `plans`
    - Define valor padrão como 1
    - Atualiza planos existentes com valores apropriados

  2. Atualizações de dados
    - Básico: 1 loja
    - Premium: 3 lojas  
    - Enterprise: ilimitado (-1)
*/

-- Adicionar coluna max_stores à tabela plans
ALTER TABLE public.plans 
ADD COLUMN IF NOT EXISTS max_stores INTEGER NOT NULL DEFAULT 1;

-- Atualizar planos existentes com valores apropriados
UPDATE public.plans 
SET max_stores = 1 
WHERE name = 'Básico';

UPDATE public.plans 
SET max_stores = 3 
WHERE name = 'Premium';

UPDATE public.plans 
SET max_stores = -1 
WHERE name = 'Enterprise'; -- -1 significa ilimitado

-- Atualizar features dos planos para incluir informação sobre lojas
UPDATE public.plans 
SET features = '["Até 3 profissionais", "1 loja", "Agendamentos ilimitados", "Suporte por email", "Comissão de 2.5%"]'
WHERE name = 'Básico';

UPDATE public.plans 
SET features = '["Até 10 profissionais", "Até 3 lojas", "Relatórios avançados", "Suporte prioritário", "Integração com WhatsApp", "Comissão de 3%"]'
WHERE name = 'Premium';

UPDATE public.plans 
SET features = '["Profissionais ilimitados", "Lojas ilimitadas", "Múltiplos negócios", "API dedicada", "Suporte 24/7", "Comissão de 1.5%"]'
WHERE name = 'Enterprise';