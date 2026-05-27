# Pawau Boutique & Spa

Production: [pawau.vercel.app](https://pawau.vercel.app/)

Pawau Boutique & Spa is a pet care website built to showcase services, accept online bookings, and provide an admin panel for appointment management.

The project combines a customer-facing marketing experience with a Supabase-powered administrative workflow, without relying on a traditional custom backend.

## Overview

Pawau was designed to cover two core needs:

- a polished public experience for services, contact, and bookings
- a private admin experience for scheduling, availability, and appointment operations

This makes the project more than a simple landing page. It includes real booking logic, protected admin access, SEO support, and deployment flexibility.

## Access

### Public website

- URL: `https://pawau.vercel.app/`
- Login required: `No`

### Admin panel

- Login URL: `https://pawau.vercel.app/admin/login`
- Admin email: `pawau@admin.com`
- Admin password: `Admin1234`

Note: the repository includes the admin email used in the SQL setup, but it does not store a real password.

## Main Features

- Marketing-oriented home page
- Services catalog for dogs, cats, and boutique products
- Online appointment booking with available time slots
- Availability validation based on service duration
- Protected admin login with Supabase Auth
- Admin dashboard with appointment summary
- Admin appointment listing with filters, status updates, and rescheduling
- SEO-ready public pages
- Automatic sitemap generation before build
- Deployment support for Vercel, Apache hosting, and Docker + Nginx

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS 4
- Motion
- Lucide React

### Data and Authentication

- Supabase Auth
- Supabase PostgreSQL
- Row Level Security (RLS)
- Supabase RPC for public availability queries

### Infrastructure

- Vercel
- Docker
- Nginx

## Project Modules

### Public

- `Home`: main branded landing page
- `Services`: service and boutique catalog
- `Booking`: online appointment booking flow
- `Contact`: customer contact section

### Private

- `Admin Login`: protected administrator access
- `Admin Dashboard`: appointment overview
- `Admin Appointments`: filtering, status management, and rescheduling
- `Admin Calendar`: calendar-based appointment view

## Architecture

The application communicates directly with Supabase from the frontend:

- Supabase Auth handles admin authentication
- PostgreSQL stores appointments and related booking data
- RLS protects access to sensitive records
- a public RPC provides the availability required by the booking form

This approach keeps the infrastructure lightweight while maintaining a clean separation between the public booking experience and the internal admin workflow.

## Project Structure

```text
src
├── components        # Reusable UI components
├── components/admin  # Admin panel UI components
├── lib               # Business logic, API helpers, SEO, and configuration
├── pages             # Public and private views
├── pages/admin       # Admin screens
└── index.css         # Global styles

supabase
├── appointments_schema.sql
└── admin_setup.sql

scripts
└── generate-sitemap.mjs
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_APPOINTMENTS_TABLE=appointments
```

Important:

- use the `anon` key, not `service_role`
- this project depends on properly configured RLS policies
- if these variables are missing at build time, the app will not connect correctly

## Supabase Setup

### 1. Create the project

Create a Supabase project and obtain:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. Create the database structure

Run:

- [supabase/appointments_schema.sql](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/supabase/appointments_schema.sql:1)

### 3. Create the admin user

In `Authentication > Users`, create the admin user manually.

Recommended setup based on the project:

- Email: `admin@pawau.com`
- Password: choose your own secure password

### 4. Grant admin permissions

Run:

- [supabase/admin_setup.sql](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/supabase/admin_setup.sql:1)

Before running it, update the email in the SQL if you decide to use a different admin account.

## Local Development

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build locally

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

Note: before `build`, the project automatically generates the sitemap using `scripts/generate-sitemap.mjs`.

## Deployment on Vercel

The project already includes:

- [vercel.json](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/vercel.json:1) for SPA rewrites
- production-ready public files and SEO configuration

Recommended setup:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Required variables in Vercel:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_APPOINTMENTS_TABLE=appointments
```

## Deployment on Apache or Hostinger

For a traditional static deployment:

- upload the contents of `dist`
- include `public/.htaccess`

Prepared file:

- [public/.htaccess](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/public/.htaccess:1)

This is necessary so routes such as `/services`, `/booking`, or `/admin/login` continue to work after a full page refresh.

## Production with Docker and Nginx

The production image builds the app with Vite and then serves it through `nginx`.

Key files:

- [Dockerfile](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/Dockerfile:1)
- [nginx/nginx.conf](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/nginx/nginx.conf:1)
- [docker-compose.prod.yml](/Users/jeffersonyepez/PracticasProgramacion/Proyectos/PawauWebPage/docker-compose.prod.yml:1)

To run the production stack locally:

```bash
docker compose -f docker-compose.prod.yml up --build
```

The app will be available at:

```bash
http://localhost
```

## Important Note for Hostinger with Docker

If you deploy with Docker on Hostinger, the `VITE_*` variables must be available during the image build, not only at container runtime.

The `Dockerfile` already accepts these build args:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_APPOINTMENTS_TABLE
```

If your hosting provider only injects variables after the container starts, the application may build without configuration and fail in production.

## Common Issues

If the app does not load correctly in production, the issue is usually one of these:

1. missing environment variables in the hosting platform
2. missing SPA rewrites
3. missing Supabase tables or policies
4. admin user exists but does not have the expected role

## Why This Project Matters

Pawau is not just a marketing site. It combines:

- visual presentation and branding
- real booking logic
- authentication and admin operations
- technical SEO for public discoverability
- flexible deployment options

## Author

Jefferson Yepez

## License

Private project.
