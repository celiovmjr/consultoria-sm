
-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  owner TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  logo TEXT,
  phone TEXT,
  email TEXT
);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professionals table
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  services JSONB DEFAULT '[]'::jsonb,
  working_hours JSONB NOT NULL DEFAULT '{
    "monday": {"start": "09:00", "end": "18:00", "active": true},
    "tuesday": {"start": "09:00", "end": "18:00", "active": true},
    "wednesday": {"start": "09:00", "end": "18:00", "active": true},
    "thursday": {"start": "09:00", "end": "18:00", "active": true},
    "friday": {"start": "09:00", "end": "18:00", "active": true},
    "saturday": {"start": "09:00", "end": "17:00", "active": true},
    "sunday": {"start": "09:00", "end": "15:00", "active": false}
  }'::jsonb,
  commission DECIMAL(5,2) DEFAULT 60.00,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'business_owner', 'professional', 'client')),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plans table
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_professionals INTEGER NOT NULL,
  max_businesses INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribers_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allowing all operations for now)
CREATE POLICY "Enable all operations for authenticated users" ON public.businesses FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.stores FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.professionals FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.services FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.users FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON public.plans FOR ALL USING (true);

-- Insert sample data
INSERT INTO public.businesses (id, name, slug, description, owner, plan, status, phone, email) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Salão Bella Vista', 'salao-bella-vista', 'O melhor em beleza e bem-estar', 'Maria Silva', 'Professional', 'active', '(11) 3333-4444', 'contato@bellavista.com'),
('550e8400-e29b-41d4-a716-446655440002', 'Barbearia do João', 'barbearia-joao', 'Tradição em cortes masculinos', 'João Santos', 'Starter', 'active', '(11) 2222-3333', 'joao@barbearia.com');

INSERT INTO public.stores (id, name, address, phone, business_id, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Filial Centro', 'Rua das Flores, 123', '(11) 1111-1111', '550e8400-e29b-41d4-a716-446655440001', 'active'),
('660e8400-e29b-41d4-a716-446655440002', 'Filial Shopping', 'Shopping Center, Loja 45', '(11) 2222-2222', '550e8400-e29b-41d4-a716-446655440001', 'active');

INSERT INTO public.services (id, name, duration, price, category, business_id, store_id, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Corte Feminino', 60, 45.00, 'Cabelos', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'active'),
('770e8400-e29b-41d4-a716-446655440002', 'Escova', 45, 25.00, 'Cabelos', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'active'),
('770e8400-e29b-41d4-a716-446655440003', 'Manicure', 45, 25.00, 'Unhas', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'active');

INSERT INTO public.professionals (id, name, email, phone, business_id, store_id, services, commission, status) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Ana Costa', 'ana@bellavista.com', '(11) 99999-1111', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '["770e8400-e29b-41d4-a716-446655440001", "770e8400-e29b-41d4-a716-446655440002"]', 60.00, 'active');

INSERT INTO public.appointments (id, client_name, client_phone, client_email, service_id, professional_id, business_id, appointment_date, appointment_time, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Maria Silva', '(11) 99999-9999', 'maria@email.com', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-12-22', '09:00', 'confirmed');

INSERT INTO public.users (id, name, email, phone, role, business_id, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Admin Sistema', 'admin@agenda.ai', '(11) 0000-0000', 'admin', NULL, 'active'),
('aa0e8400-e29b-41d4-a716-446655440002', 'Maria Silva', 'maria@bellavista.com', '(11) 1111-1111', 'business_owner', '550e8400-e29b-41d4-a716-446655440001', 'active');

INSERT INTO public.plans (id, name, price, features, max_professionals, max_businesses, is_active, subscribers_count) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Básico', 29.90, '["Até 3 profissionais", "Agendamentos ilimitados", "Suporte por email"]', 3, 1, true, 145),
('bb0e8400-e29b-41d4-a716-446655440002', 'Premium', 79.90, '["Até 10 profissionais", "Relatórios avançados", "Suporte prioritário", "Integração com WhatsApp"]', 10, 1, true, 89),
('bb0e8400-e29b-41d4-a716-446655440003', 'Enterprise', 149.90, '["Profissionais ilimitados", "Múltiplos negócios", "API dedicada", "Suporte 24/7"]', -1, -1, true, 23);
