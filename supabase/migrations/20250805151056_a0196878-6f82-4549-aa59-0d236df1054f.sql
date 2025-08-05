-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('business_owner', 'admin', 'professional')) DEFAULT 'business_owner',
  business_id UUID,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'Básico',
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professionals table
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_id UUID REFERENCES public.businesses(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  business_id UUID REFERENCES public.businesses(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id),
  professional_id UUID REFERENCES public.professionals(id),
  service_id UUID REFERENCES public.services(id),
  client_name TEXT,
  client_email TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint for users.business_id
ALTER TABLE public.users 
ADD CONSTRAINT fk_users_business_id 
FOREIGN KEY (business_id) REFERENCES public.businesses(id);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Users can delete users" ON public.users FOR DELETE USING (true);

-- Create RLS policies for businesses table
CREATE POLICY "Businesses are viewable by everyone" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Businesses can be inserted by everyone" ON public.businesses FOR INSERT WITH CHECK (true);
CREATE POLICY "Businesses can be updated by everyone" ON public.businesses FOR UPDATE USING (true);
CREATE POLICY "Businesses can be deleted by everyone" ON public.businesses FOR DELETE USING (true);

-- Create RLS policies for plans table
CREATE POLICY "Plans are viewable by everyone" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Plans can be inserted by everyone" ON public.plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Plans can be updated by everyone" ON public.plans FOR UPDATE USING (true);
CREATE POLICY "Plans can be deleted by everyone" ON public.plans FOR DELETE USING (true);

-- Create RLS policies for professionals table
CREATE POLICY "Professionals are viewable by everyone" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Professionals can be inserted by everyone" ON public.professionals FOR INSERT WITH CHECK (true);
CREATE POLICY "Professionals can be updated by everyone" ON public.professionals FOR UPDATE USING (true);
CREATE POLICY "Professionals can be deleted by everyone" ON public.professionals FOR DELETE USING (true);

-- Create RLS policies for services table
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Services can be inserted by everyone" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Services can be updated by everyone" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Services can be deleted by everyone" ON public.services FOR DELETE USING (true);

-- Create RLS policies for appointments table
CREATE POLICY "Appointments are viewable by everyone" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Appointments can be inserted by everyone" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Appointments can be updated by everyone" ON public.appointments FOR UPDATE USING (true);
CREATE POLICY "Appointments can be deleted by everyone" ON public.appointments FOR DELETE USING (true);

-- Create RLS policies for system_settings table
CREATE POLICY "System settings are viewable by everyone" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "System settings can be inserted by everyone" ON public.system_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "System settings can be updated by everyone" ON public.system_settings FOR UPDATE USING (true);
CREATE POLICY "System settings can be deleted by everyone" ON public.system_settings FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample plans
INSERT INTO public.plans (name, price, features) VALUES
('Básico', 0.00, '{"max_businesses": 1, "max_professionals": 3}'),
('Profissional', 29.90, '{"max_businesses": 5, "max_professionals": 10}'),
('Empresarial', 99.90, '{"max_businesses": -1, "max_professionals": -1}')
ON CONFLICT DO NOTHING;