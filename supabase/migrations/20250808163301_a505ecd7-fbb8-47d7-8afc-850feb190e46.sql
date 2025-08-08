-- Check current structure of professionals table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'professionals' 
ORDER BY ordinal_position;