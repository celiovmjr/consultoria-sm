-- Create junction table for many-to-many relationship between services and categories
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(service_id, category_id)
);

-- Enable Row Level Security
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for service_categories
CREATE POLICY "Service categories are viewable by everyone" 
ON public.service_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Service categories can be created by everyone" 
ON public.service_categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service categories can be updated by everyone" 
ON public.service_categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Service categories can be deleted by everyone" 
ON public.service_categories 
FOR DELETE 
USING (true);

-- Create index for better performance
CREATE INDEX idx_service_categories_service_id ON public.service_categories(service_id);
CREATE INDEX idx_service_categories_category_id ON public.service_categories(category_id);