-- 1. Crea el usuario admin desde Authentication > Users en el dashboard de Supabase.
-- 2. Luego ejecuta este SQL cambiando el correo.

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@pawau.com';
