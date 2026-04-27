# Pawau Boutique & Spa

Sitio web de Pawau con paginas de inicio, servicios, contacto y reserva de citas para mascotas.

## Supabase

La persistencia de citas ahora usa Supabase desde el servidor.

1. Crea un proyecto en Supabase.
2. Ejecuta el SQL de [supabase/appointments_schema.sql](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/supabase/appointments_schema.sql:1).
3. Crea un archivo `.env` basado en `.env.example`.
4. Completa `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el frontend. Segun la documentacion oficial de Supabase, esa clave debe usarse solo en el servidor:
- https://supabase.com/docs/guides/api/api-keys
- https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa

## Como levantar el proyecto

```bash
npm install
npm run dev:full
```

Tambien puedes iniciarlo por separado con:

```bash
npm run server
npm run dev
```
