# DoseCraft — Peptide Biohacking Protocol Lab

## Project Structure
```
dosecraft/
├── apps/
│   ├── api/          → NestJS backend (port 4000)
│   ├── web/          → Next.js web app (port 3000)
│   └── landing/      → Next.js landing page (port 3001)
├── packages/
│   ├── database/     → Prisma schema, migrations, seed
│   └── shared/       → Types, constants, utils
├── render.yaml       → Render deployment config
└── .env              → Environment variables
```

## Quick Start
```bash
npm install                    # Install all dependencies
npm run db:generate            # Generate Prisma client
npm run db:migrate             # Run migrations
npm run db:seed                # Seed database
npm run dev                    # Start all services (turbo)
```

## Database
- Provider: Neon PostgreSQL (curly-base-27452080)
- Host: ep-green-tree-aijyg2hv.c-4.us-east-1.aws.neon.tech
- Extensions: pgvector enabled
- ORM: Prisma

## Architecture
- Three-lane evidence model: Clinical (cyan), Expert (orange), Experimental (purple)
- Two-layer AI: Unfiltered ingestion + Governed in-app assistant
- Four pillars: Library, Protocol Engineer, Tracker, Insight Engine

## Key Files
- Schema: packages/database/prisma/schema.prisma
- API modules: apps/api/src/modules/
- Web pages: apps/web/src/app/
- Shared types: packages/shared/src/types/
