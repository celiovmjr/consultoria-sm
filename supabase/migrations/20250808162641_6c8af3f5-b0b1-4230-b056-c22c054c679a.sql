-- Create professionals table
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  business_id UUID,
  store_id UUID REFERENCES public.stores(id),
  commission INTEGER NOT NULL DEFAULT 60,
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for professionals and services
CREATE TABLE public.professional_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_id, service_id)
);

-- Enable Row Level Security
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;

-- Create policies for professionals
CREATE POLICY "Professionals are viewable by everyone" 
ON public.professionals 
FOR SELECT 
USING (true);

CREATE POLICY "Professionals can be created by everyone" 
ON public.professionals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Professionals can be updated by everyone" 
ON public.professionals 
FOR UPDATE 
USING (true);

CREATE POLICY "Professionals can be deleted by everyone" 
ON public.professionals 
FOR DELETE 
USING (true);

-- Create policies for professional_services
CREATE POLICY "Professional services are viewable by everyone" 
ON public.professional_services 
FOR SELECT 
USING (true);

CREATE POLICY "Professional services can be created by everyone" 
ON public.professional_services 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Professional services can be updated by everyone" 
ON public.professional_services 
FOR UPDATE 
USING (true);

CREATE POLICY "Professional services can be deleted by everyone" 
ON public.professional_services 
FOR DELETE 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_professionals_business_id ON public.professionals(business_id);
CREATE INDEX idx_professionals_store_id ON public.professionals(store_id);
CREATE INDEX idx_professional_services_professional_id ON public.professional_services(professional_id);
CREATE INDEX idx_professional_services_service_id ON public.professional_services(service_id);