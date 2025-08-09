-- Atualiza os business_id que estão nulos derivando do store_id
UPDATE services 
SET business_id = stores.business_id 
FROM stores 
WHERE services.store_id = stores.id 
AND services.business_id IS NULL;

-- Remove apenas as colunas desnecessárias sem afetar a estrutura principal
ALTER TABLE services DROP COLUMN IF EXISTS category_id;
ALTER TABLE services DROP COLUMN IF EXISTS category;