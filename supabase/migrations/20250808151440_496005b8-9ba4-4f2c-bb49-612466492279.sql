-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  manager TEXT,
  working_hours JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Stores are viewable by everyone" 
ON public.stores 
FOR SELECT 
USING (true);

CREATE POLICY "Stores can be inserted by everyone" 
ON public.stores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Stores can be updated by everyone" 
ON public.stores 
FOR UPDATE 
USING (true);

CREATE POLICY "Stores can be deleted by everyone" 
ON public.stores 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();