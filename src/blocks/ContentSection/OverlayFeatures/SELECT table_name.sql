SELECT table_name
FROM information_schema.tables
WHERE table_name LIKE '%poster_bento%';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = '_pages_v_blocks_poster_bento_items';


SELECT name, batch FROM payload_migrations ORDER BY created_at DESC LIMIT 10;