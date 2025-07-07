-- Create system_settings table for storing admin configurations
CREATE TABLE public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Only admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_system_settings_updated_at();

-- Insert default settings
INSERT INTO public.system_settings (setting_key, setting_value) VALUES
  ('platform_settings', '{
    "name": "Agenda.AI",
    "description": "Plataforma completa para gestão de agendamentos",
    "supportEmail": "suporte@agenda.ai",
    "maintenanceMode": false,
    "allowRegistrations": true,
    "requireEmailVerification": true
  }'),
  ('email_settings', '{
    "smtpHost": "smtp.gmail.com",
    "smtpPort": "587",
    "smtpUsername": "sistema@agenda.ai",
    "smtpPassword": "",
    "fromName": "Agenda.AI",
    "fromEmail": "noreply@agenda.ai"
  }'),
  ('notification_settings', '{
    "newBusinessSignup": true,
    "paymentAlerts": true,
    "systemUpdates": true,
    "maintenanceAlerts": true,
    "securityAlerts": true
  }');