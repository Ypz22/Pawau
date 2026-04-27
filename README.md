# Pawau Boutique & Spa

Sitio web de Pawau con paginas de inicio, servicios, contacto y reserva de citas para mascotas.

## Supabase

La aplicacion ahora funciona sin backend propio. Las citas y el acceso administrativo usan Supabase directamente desde el frontend con `anon key`, Supabase Auth y politicas RLS.

1. Crea un proyecto en Supabase.
2. Ejecuta el SQL de [supabase/appointments_schema.sql](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/supabase/appointments_schema.sql:1).
3. Crea el usuario administrador desde `Authentication > Users` en Supabase.
4. Ejecuta [supabase/admin_setup.sql](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/supabase/admin_setup.sql:1) cambiando el correo del admin.
5. Crea un archivo `.env` basado en `.env.example`.
6. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

No pongas `service_role` en el navegador. Segun la documentacion oficial de Supabase, para apps frontend debes usar la `anon key` junto con RLS:
- https://supabase.com/docs/guides/api/api-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/reference/javascript/auth-signinwithpassword

## Como levantar el proyecto

```bash
npm install
npm run dev
```

## Produccion con Nginx

La imagen de produccion compila la app con Vite y luego la sirve como sitio estatico con `nginx`.

Archivos:

- [Dockerfile](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/Dockerfile:1)
- [nginx/nginx.conf](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/nginx/nginx.conf:1)
- [docker-compose.prod.yml](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/docker-compose.prod.yml:1)

Para levantar produccion:

```bash
docker compose -f docker-compose.prod.yml up --build
```

La aplicacion quedara disponible en:

```bash
http://localhost
```
