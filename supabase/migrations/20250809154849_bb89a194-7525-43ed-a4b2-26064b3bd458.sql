-- Primeiro, vamos atualizar os business_id que estão nulos
-- assumindo que podemos derivar do store_id se necessário
UPDATE services 
SET business_id = stores.business_id 
FROM stores 
WHERE services.store_id = stores.id 
AND services.business_id IS NULL;

-- Remove as colunas desnecessárias da tabela services
ALTER TABLE services DROP COLUMN IF EXISTS category_id;
ALTER TABLE services DROP COLUMN IF EXISTS category;

-- Reorganiza a ordem das colunas criando uma nova tabela com a ordem correta
CREATE TABLE services_new (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid,
    store_id uuid,
    name text NOT NULL,
    description text,
    price numeric NOT NULL DEFAULT 0,
    duration integer DEFAULT 60,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Copia os dados da tabela antiga para a nova
INSERT INTO services_new (id, business_id, store_id, name, description, price, duration, is_active, created_at, updated_at)
SELECT id, business_id, store_id, name, description, price, duration, is_active, created_at, updated_at
FROM services;

-- Remove a tabela antiga e renomeia a nova
DROP TABLE services;
ALTER TABLE services_new RENAME TO services;

-- Recria as políticas RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone" 
ON services FOR SELECT 
USING (true);

CREATE POLICY "Services can be inserted by everyone" 
ON services FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Services can be updated by everyone" 
ON services FOR UPDATE 
USING (true);

CREATE POLICY "Services can be deleted by everyone" 
ON services FOR DELETE 
USING (true);

-- Adiciona o trigger para updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();