-- Insert example user data for each role type
-- Note: These are example records. Actual auth users need to be created through signup or Supabase dashboard

-- Insert example profiles for each user type
-- Admin user
INSERT INTO public.profiles (id, email, name, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@agenda.cash', 'Administrador do Sistema', 'saas_admin');

-- Business owner
INSERT INTO public.profiles (id, email, name, role) VALUES 
('22222222-2222-2222-2222-222222222222', 'business@agenda.cash', 'Dono do Negócio', 'business_owner');

-- Professional  
INSERT INTO public.profiles (id, email, name, role) VALUES 
('33333333-3333-3333-3333-333333333333', 'professional@agenda.cash', 'Profissional', 'professional');

-- Client
INSERT INTO public.profiles (id, email, name, role) VALUES 
('44444444-4444-4444-4444-444444444444', 'client@agenda.cash', 'Cliente', 'client');

-- Create a sample business for the business owner
INSERT INTO public.businesses (id, name, plan) VALUES 
('55555555-5555-5555-5555-555555555555', 'Salão Exemplo', 'Básico');

-- Link business owner to the business
UPDATE public.profiles 
SET business_id = '55555555-5555-5555-5555-555555555555' 
WHERE email = 'business@agenda.cash';

-- Link professional to the same business
UPDATE public.profiles 
SET business_id = '55555555-5555-5555-5555-555555555555' 
WHERE email = 'professional@agenda.cash';