# Pawau Boutique & Spa

Producción: [pawau.vercel.app](https://pawau.vercel.app/)

Sitio web para una boutique y spa de mascotas, diseñado para presentar servicios, facilitar reservas en línea y ofrecer un panel administrativo para gestionar citas.

El proyecto combina una experiencia visual orientada a clientes con un flujo administrativo basado en Supabase, sin backend propio tradicional.

## Resumen

Pawau fue construido para cubrir dos necesidades principales:

- una experiencia pública atractiva para mostrar servicios, contacto y reservas
- una experiencia privada para gestionar citas, disponibilidad y seguimiento operativo

La aplicación está enfocada en un negocio real, no solo en una landing page, por lo que incluye lógica de disponibilidad, autenticación administrativa, SEO y despliegue preparado para distintos entornos.

## Características principales

- Página de inicio con enfoque comercial y visual
- Catálogo de servicios para perros, gatos y boutique
- Reserva de citas en línea con horarios disponibles
- Validación de cupos según duración del servicio
- Panel administrativo con login protegido
- Dashboard con resumen de citas
- Listado administrativo con filtros, estados y reprogramación
- SEO configurado para páginas públicas
- Sitemap generado automáticamente antes del build
- Soporte para despliegue en Vercel, Apache y Docker + Nginx

## Stack tecnológico

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS 4
- Motion
- Lucide React

### Backend y datos

- Supabase Auth
- Supabase PostgreSQL
- Row Level Security (RLS)
- RPC de Supabase para disponibilidad pública

### Infraestructura

- Vercel
- Docker
- Nginx

## Módulos del proyecto

### Público

- `Home`: portada principal con enfoque de marca
- `Services`: catálogo de servicios y boutique
- `Booking`: reserva de citas con control de disponibilidad
- `Contact`: contacto comercial

### Privado

- `Admin Login`: acceso del administrador
- `Admin Dashboard`: resumen general de citas
- `Admin Appointments`: listado, filtros, estados y reprogramación
- `Admin Calendar`: visualización administrativa de reservas

## Arquitectura

La aplicación funciona directamente contra Supabase desde el frontend:

- Supabase Auth maneja el acceso administrativo
- PostgreSQL guarda citas y datos relacionados
- RLS protege el acceso a la información
- una RPC pública expone la disponibilidad necesaria para el formulario de reservas

Esta decisión simplifica la infraestructura y mantiene el proyecto ligero, manteniendo al mismo tiempo una separación clara entre la experiencia pública y la gestión interna.

## Estructura del proyecto

```text
src
├── components        # Componentes reutilizables de UI
├── components/admin  # Componentes del panel administrativo
├── lib               # Lógica de negocio, API, SEO y configuración
├── pages             # Vistas públicas y privadas
├── pages/admin       # Pantallas del panel administrativo
└── index.css         # Estilos globales

supabase
├── appointments_schema.sql
└── admin_setup.sql

scripts
└── generate-sitemap.mjs
```

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_APPOINTMENTS_TABLE=appointments
```

Importante:

- usa la `anon key`, no `service_role`
- este proyecto depende de políticas RLS bien configuradas
- si las variables no están disponibles durante el build, el frontend no podrá conectarse correctamente

## Configuración de Supabase

### 1. Crear el proyecto

Crea un proyecto en Supabase y obtén:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. Crear la estructura de datos

Ejecuta el script:

- [supabase/appointments_schema.sql](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/supabase/appointments_schema.sql:1)

### 3. Crear el usuario administrador

Desde `Authentication > Users`, crea el usuario administrador manualmente.

### 4. Registrar permisos administrativos

Ejecuta:

- [supabase/admin_setup.sql](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/supabase/admin_setup.sql:1)

Antes de hacerlo, ajusta el correo del administrador en el SQL para que coincida con el usuario creado.

## Desarrollo local

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Build local

```bash
npm run build
```

### Previsualizar build

```bash
npm run preview
```

## Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # ESLint
```

Nota: antes de `build`, el proyecto genera automáticamente el sitemap con `scripts/generate-sitemap.mjs`.

## Despliegue en Vercel

Este proyecto ya incluye:

- [vercel.json](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/vercel.json:1) para rewrites de rutas SPA
- SEO y archivos públicos listos para producción

Configuración recomendada:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Variables requeridas en Vercel:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_APPOINTMENTS_TABLE=appointments
```

## Despliegue en Apache o Hostinger

Si haces un despliegue estático tradicional:

- sube el contenido de `dist`
- incluye también `public/.htaccess`

Archivo preparado:

- [public/.htaccess](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/public/.htaccess:1)

Esto es importante para que rutas como `/servicios`, `/agendar` o `/admin/login` funcionen correctamente después de recargar.

## Producción con Docker y Nginx

La imagen de producción compila la app con Vite y luego la sirve con `nginx`.

Archivos clave:

- [Dockerfile](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/Dockerfile:1)
- [nginx/nginx.conf](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/nginx/nginx.conf:1)
- [docker-compose.prod.yml](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/docker-compose.prod.yml:1)

Para levantar producción local:

```bash
docker compose -f docker-compose.prod.yml up --build
```

La aplicación quedará disponible en:

```bash
http://localhost
```

## Nota importante para Hostinger con Docker

Si despliegas usando Docker en Hostinger, las variables `VITE_*` deben estar disponibles durante el `build`, no solo en runtime.

El `Dockerfile` ya acepta estos `build args`:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_APPOINTMENTS_TABLE
```

Si el proveedor solo permite variables cuando el contenedor ya está ejecutándose, la aplicación puede compilarse sin configuración y romperse en producción.

## Solución de problemas comunes

Si la app no carga correctamente en producción, normalmente el problema está en uno de estos puntos:

1. faltan variables de entorno en el hosting
2. no están configurados los rewrites para rutas SPA
3. Supabase no tiene las tablas o políticas esperadas
4. el usuario administrador no fue creado o no tiene el rol esperado

## Qué aporta este proyecto

Pawau no es solo una página informativa. Destaca porque combina:

- marketing y presentación visual
- lógica real de negocio para reservas
- autenticación y gestión administrativa
- SEO técnico para visibilidad pública
- despliegue flexible según el entorno

## Autor

Jefferson Yepez

## Licencia

Proyecto privado.
