# ByteSync Studio — AI Engineering & Digital Transformation

> "Your business. Digitally transformed."
> "Intelligent systems. Built to scale."

Official web platform and consultation booking system for **ByteSync Studio** (@bytesync_studio).

---

## 1. Architecture Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend**: Full-stack Express API with Vite middleware integration mounted on dev server (`server.ts`).
- **Data Persistence**: Supabase PostgreSQL with Row Level Security (RLS) policies and automatic fallback in-memory registry.
- **Form & Validation**: React Hook Form with Zod runtime schema validation on both client and server.
- **Email Dispatch**: Transactional notification pipeline architected with Resend (with explicit manual-review confirmation wording).
- **Executive Console**: Protected administrator dashboard (`/admin`) for inquiry management, appointment scheduling, and internal notes.

---

## 2. Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install

# Start full-stack local server (port 3000)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live website.

---

## 3. Brand Assets & Logo

The original ByteSync Studio logo is referenced directly from:
```
public/images/bytesync_logo.png
```
You can drop or update your official transparent PNG into that path at any time. The `BrandLogo` component automatically renders it with exact dimensions and maintains an inline vector fallback for resilience.

---

## 4. Supabase Database Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Copy and run the migration script located at:
   ```
   supabase/migrations/01_create_consultations_table.sql
   ```
4. Copy your project URL, anon key, and service role key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
*Note: If Supabase credentials are not provided, the application runs in self-contained demonstration mode using local persistence.*

---

## 5. Administrator Console

- Route: `/admin` (or click "Portal" in the top navigation or footer)
- Default Developer Credentials:
  - **Email**: `admin@bytesyncstudio.com`
  - **Password**: `bytesync2026`
  *(Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` for production)*

---

## 6. Production Build & Deployment

```bash
# Run type checking
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```
