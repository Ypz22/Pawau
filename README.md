# Pawau Boutique & Spa

Sitio web en React + Vite con una agenda funcional de citas para mascotas y una API local con SQLite.

## Lo que incluye

- Landing, servicios, contacto y pagina de agendacion con estilos consistentes.
- API local en `server/index.js`.
- Persistencia real de citas en `server/data/appointments.db`.
- Disponibilidad dinamica por fecha y servicio.
- Validacion para evitar citas en el pasado, domingos y cruces de horario.
- Panel administrativo basico dentro de `/agendar` para confirmar, completar o cancelar citas.

## Como levantar el proyecto

```bash
npm install
npm run dev:full
```

Eso inicia:

- Frontend Vite en `http://localhost:5173`
- API de citas en `http://localhost:3001`

Si prefieres correrlos por separado:

```bash
npm run server
npm run dev
```

## Endpoints principales

- `GET /api/services`
- `GET /api/availability?date=2026-04-30&serviceId=grooming`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/status`

## Notas

- La base elegida fue SQLite para dejarte una solucion real, local y sin depender de terceros.
- Si luego quieres migrarlo a Google Calendar, esta estructura ya separa bien frontend, reglas de agenda y capa de persistencia para hacer ese cambio con menos friccion.
