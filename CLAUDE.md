# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CasaDiag is a housing pathology diagnostic platform for Spain. Users describe building damage through a guided chat flow (S0-S10 states), upload photo/video evidence, receive a free AI analysis (S8), then pay for a professional pre-report reviewed by a technician.

**Stack:** React 18 + TypeScript + Vite (frontend) / NestJS 11 + Prisma + PostgreSQL (backend submodule `casadiag-backend/`)

**Production URL:** `https://patologias.micasaverde.es`

## Commands

```bash
# Frontend
npm run dev          # Vite dev server on port 8080
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build

# Backend (cd casadiag-backend/)
npm run start:dev    # NestJS dev server on port 3001
npm run build        # Compile TypeScript
npx prisma migrate dev    # Run DB migrations
npx prisma generate       # Regenerate Prisma client
npx prisma studio         # Visual DB browser
```

## Architecture

### Frontend

- **Routing:** React Router v6 in `src/App.tsx`. Lazy-loaded pages except Index. Spanish URLs (`/iniciar-sesion`, `/registro`, `/asistente`).
- **State:** No Redux — uses React Context (`AuthContext`) + custom hooks (`useExpediente`) + TanStack React Query for server state.
- **UI:** shadcn-ui components in `src/components/ui/`, Tailwind CSS with HSL CSS variables, custom fonts Inter + Cormorant Garamond.
- **Path alias:** `@` maps to `./src` (configured in vite and tsconfig).

### Core Business Logic

`src/hooks/useExpediente.ts` — the central hook orchestrating the entire diagnostic workflow. Manages case state (S0 through S10 and beyond), syncs with the backend, handles evidence uploads, AI analysis, and payment flow.

**State machine (S0-S10):**
S0_INTRODUCCION → S1_LOCALIZACION → S2_TIPO_DANO → S3_ANTIGUEDAD → S4_EVOLUCION → S5_MATERIAL_GRAFICO → S6_CONTEXTO → S7_DESCRIPCION_LIBRE → S7B_PREGUNTAS_TECNICAS → S8_ANALISIS_GRATUITO → PAYMENT_PENDING → PAYMENT_COMPLETED → INFO_CONFIRMATION → S9_GENERACION_PREINFORME → DRAFT_SENT_TO_TECHNICIAN → FINAL_SENT

### API Layer

- `src/services/api/casadiag-api.ts` — Axios client with JWT interceptors, auto-refresh on 401. Extended timeouts (120s) for AI analysis and file uploads.
- `src/services/api/auth-api.ts` — Login/register/token refresh. Tokens stored in localStorage with sessionStorage fallback (iOS Safari private browsing).
- Backend API base: `/api` (proxied in dev, same-origin in production).

### Backend (NestJS submodule)

Key modules: `auth`, `cases`, `messages`, `evidence`, `payments`, `diagnosis`, `admin`, `reports`, `chat`, `email`, `common` (openai, r2, prisma services).

**Database schema** at `casadiag-backend/prisma/schema.prisma`. Core models: User, Case, Evidence, Message, Payment, DiagnosisHistory, SiteContent.

**Case IDs** use format `MCV-YYYY-NNNNNN`.

### External Services

- **OpenAI:** Vision API for evidence analysis + Assistants API for chat threads
- **Cloudflare R2:** Evidence file storage (S3-compatible)
- **Stripe:** Payment Links (single pack at 108.90 EUR incl. 21% VAT)
- **Resend:** Transactional email

### Authentication

JWT-based with access + refresh tokens. Roles: CLIENT, TECHNICIAN, ADMIN. `ProtectedRoute` component guards authenticated/admin routes.

## Key Conventions

- All user-facing text is in **Spanish**.
- tsconfig is permissive: `noImplicitAny: false`, `strictNullChecks: false`.
- The S8 analysis has a 5-block JSON structure: damage identification, probable causes, risk assessment, technical questions, recommendations.
- Environment variables: frontend uses `VITE_` prefix; backend uses plain names. See `.env.example`.
