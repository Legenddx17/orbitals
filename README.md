# Orbitals 🪐

Plataforma de juego social para comunidades de Discord.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (PostgreSQL + Realtime)
- **NextAuth.js** (Discord OAuth)
- **Tailwind CSS**
- **Vercel** (deploy)

## Pasos para correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Llena las siguientes claves en `.env.local`:

| Variable | Dónde conseguirla |
|---|---|
| `DISCORD_CLIENT_ID` | [Discord Developer Portal](https://discord.com/developers/applications) → Tu app → OAuth2 |
| `DISCORD_CLIENT_SECRET` | Mismo lugar |
| `NEXTAUTH_SECRET` | Ejecuta: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` en desarrollo |
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase](https://supabase.com) → Tu proyecto → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Mismo lugar |
| `SUPABASE_SERVICE_ROLE_KEY` | Mismo lugar (service_role, ¡NO lo expongas!) |

### 3. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta todo el contenido de `supabase/schema.sql`
3. En **Authentication → URL Configuration**, agrega `http://localhost:3000` como Site URL

### 4. Configurar Discord OAuth

1. En [Discord Developer Portal](https://discord.com/developers/applications) → Tu app → OAuth2 → Redirects:
2. Agrega: `http://localhost:3000/api/auth/callback/discord`
3. En producción cambia a: `https://tu-dominio.com/api/auth/callback/discord`

### 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy a Vercel

1. Push tu código a GitHub
2. Importa el repo en [vercel.com](https://vercel.com)
3. Agrega todas las variables de entorno del `.env.example` en Vercel → Settings → Environment Variables
4. Cambia `NEXTAUTH_URL` a tu dominio de producción
5. Agrega el redirect de Discord con tu dominio de producción

## Estructura del proyecto

```
orbitals/
├── app/                     # Next.js App Router pages y API routes
│   ├── page.tsx             # Landing
│   ├── onboarding/          # Elegir orbit
│   ├── orbit/[orbitId]/     # Home, juegos, misiones, weekly, daily, match
│   ├── profile/[username]/  # Perfil público
│   ├── settings/            # Configuración
│   └── api/                 # API routes
├── components/              # Componentes React
├── lib/                     # Supabase, auth, utils, points
├── types/                   # TypeScript types
└── supabase/
    └── schema.sql           # Schema completo de la DB
```
