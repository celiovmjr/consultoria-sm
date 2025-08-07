-- Insert default application settings if they don't exist
INSERT INTO system_settings (setting_key, setting_value) 
VALUES 
  ('app_name', '"AgendaPro"'),
  ('app_tagline', '"Revolucione seu Salão com Agendamentos Inteligentes"'),
  ('app_description', '"A plataforma completa para gestão de agendamentos em salões de beleza, barbearias e clínicas de estética."'),
  ('hero_title', '"Revolucione seu Salão com Agendamentos Inteligentes"'),
  ('hero_subtitle', '"A plataforma completa para gestão de agendamentos em salões de beleza, barbearias e clínicas de estética."'),
  ('features_title', '"Tudo que você precisa em uma plataforma"'),
  ('features_subtitle', '"Recursos pensados especialmente para o seu tipo de negócio"'),
  ('testimonials_title', '"O que nossos clientes dizem"'),
  ('testimonials_subtitle', '"Histórias reais de sucesso"'),
  ('pricing_title', '"Planos que crescem com seu negócio"'),
  ('pricing_subtitle', '"Escolha o plano ideal para o seu estabelecimento"'),
  ('cta_title', '"Pronto para transformar seu negócio?"'),
  ('cta_subtitle', '"Junte-se a centenas de profissionais que já revolucionaram seus salões"')
ON CONFLICT (setting_key) DO NOTHING;