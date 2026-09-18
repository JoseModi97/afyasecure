# AfyaSecure 🇰🇪 🛡️
### Production-Grade Healthcare Security & Compliance Monorepo
*Tailored for Nairobi Healthcare Systems • Kenya DPA 2019 & HIPAA Compliant • HL7 FHIR Interoperability*

---

## 📌 Executive Summary

**AfyaSecure** is a full-stack digital health monorepo built with **React/Next.js 14+ (App Router)**, **TypeScript**, **Node.js**, and **PostgreSQL (Drizzle ORM)**. It demonstrates enterprise-grade security controls and digital-health interoperability designed specifically for the East African healthcare landscape, emphasizing the **Kenya Data Protection Act (DPA 2019)** and **HIPAA Security & Privacy Rules**.

Deployable to the **Cloudflare Free Tier** (Cloudflare Pages) paired with serverless PostgreSQL (**Neon** / **Supabase**), and containerized via **Docker Compose** for local environments and CI/CD pipelines.

---

## 🏛️ Monorepo Architecture

```
afyasecure-monorepo/
├── apps/
│   └── web/                   # Next.js 14 App Router, Tailwind CSS, Cloudflare Pages Ready
│       ├── app/
│       │   ├── api/fhir/      # RESTful HL7 FHIR R4 Endpoints (Patient, AuditEvent, Consent)
│       │   ├── patients/      # Patient Registry & Role-Based Clinical Chart
│       │   ├── auditor/       # DPO Audit Trail Viewer & JSON Inspector
│       │   └── consent/       # Kenya DPA 2019 Consent Management Portal
│       └── wrangler.toml      # Cloudflare Pages Edge configuration (nodejs_compat)
├── packages/
│   ├── database/              # Drizzle ORM schemas, PostgreSQL connection, seed records
│   ├── fhir-types/            # HL7 FHIR R4 compliant TypeScript interfaces
│   └── auth-rbac/             # RBAC engine, PII minimization masks, FHIR Audit Logger
├── .github/workflows/
│   └── ci-cd.yml              # GitHub Actions (Typecheck, Lint, Docker build, Cloudflare deploy)
├── docker-compose.yml         # Local PostgreSQL 16 + Web Service
├── Dockerfile                 # Multi-stage production container build
├── turbo.json                 # Turborepo task pipeline
└── pnpm-workspace.yaml        # pnpm workspaces definition
```

---

## ⚖️ Regulatory Compliance Matrix

| Kenya DPA 2019 / HIPAA | Legal Requirement | Technical Implementation in AfyaSecure |
| :--- | :--- | :--- |
| **DPA Section 25 (c)** | **Data Minimization & Privacy by Design**: Only process personal data adequate and relevant to purpose. | [`packages/auth-rbac/src/masking.ts`](packages/auth-rbac/src/masking.ts): Masks Kenyan National ID and phone numbers in real time for non-clinical staff (e.g. Receptionists). |
| **DPA Section 29 & 32** | **Processing of Sensitive Health Data & Explicit Consent**: Processing health records requires valid statutory consent. | [`apps/web/app/consent/page.tsx`](apps/web/app/consent/page.tsx) & [`packages/fhir-types/src/consent.ts`](packages/fhir-types/src/consent.ts): Interactive consent tracking and enforcement. |
| **DPA Section 41 & HIPAA § 164.312(b)** | **Audit Controls**: Hardware, software, and procedural mechanisms that record activity in systems containing PHI. | [`packages/fhir-types/src/audit-event.ts`](packages/fhir-types/src/audit-event.ts): Every read, modify, or blocked request writes an immutable HL7 FHIR `AuditEvent`. |
| **HIPAA Minimum Necessary** | Restrict workforce access to PHI to only what is necessary to perform duties. | [`packages/auth-rbac/src/rbac.ts`](packages/auth-rbac/src/rbac.ts): Distinct roles (`DOCTOR`, `NURSE`, `RECEPTIONIST`, `DPO_AUDITOR`). Front desk staff cannot view medical notes or diagnoses. |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ (tested on v20 and v24)
- **pnpm**: v9+ (`corepack enable` or `npm i -g pnpm`)
- **Docker & Docker Compose** (optional for local database container)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

> **Zero-Config In-Memory Fallback**: When `DATABASE_URL` is omitted, AfyaSecure automatically boots with a rich in-memory repository seeded with authentic Nairobi healthcare records (e.g. Kenyatta National Hospital, Nairobi West context).

---

## 🐳 Running with Docker Compose

Spin up a local PostgreSQL 16 database and application:
```bash
docker compose up -d
```
- PostgreSQL Port: `5432`
- Database: `afyasecure_db`
- Application: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Free Cloudflare Pages Deployment Guide

To deploy this project for **\$0/month**:

### 1. Provision Free PostgreSQL (Neon or Supabase)
1. Sign up for free at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. Create a database called `afyasecure_db`.
3. Copy your pooled connection string: `postgresql://user:password@ep-xyz.us-east-1.aws.neon.tech/afyasecure_db?sslmode=require`.

### 2. Deploy to Cloudflare Pages
1. Push this repository to GitHub.
2. Go to **Cloudflare Dashboard &gt; Workers &amp; Pages &gt; Create application &gt; Pages &gt; Connect to Git**.
3. Select your repository:
   - **Framework preset**: `Next.js`
   - **Build command**: `pnpm turbo run build --filter=web`
   - **Build output directory**: `apps/web/.next`
   - **Root directory**: `/`
4. Add Environment Variable:
   - `DATABASE_URL`: *(Your Neon/Supabase pooled Postgres connection string)*
5. Click **Save and Deploy**.

---

## 🌐 HL7 FHIR R4 REST API Reference

AfyaSecure includes production-ready HL7 FHIR R4 endpoints for health interoperability:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/fhir/Patient` | `GET` | Returns FHIR R4 Patient Bundle. Supports `?name=wanjiku` or `?id=patient-kenya-001`. |
| `/api/fhir/AuditEvent` | `GET` | Returns FHIR R4 AuditEvent Bundle. Supports `?outcome=8` (filtered security events). |
| `/api/fhir/AuditEvent` | `POST` | Ingests external FHIR AuditEvents from third-party EHRs/clinics. |
| `/api/fhir/Consent` | `GET` | Returns FHIR R4 Consent Bundle under Kenya DPA 2019 legal grounds. |

### Sample curl:
```bash
# Query FHIR Patient
curl -X GET http://localhost:3000/api/fhir/Patient?name=wanjiku

# Ingest an Audit Event
curl -X POST http://localhost:3000/api/fhir/AuditEvent \
  -H "Content-Type: application/json" \
  -d '{"resourceType":"AuditEvent","id":"audit-test-01","action":"R","outcome":"0"}'
```

---

## 🧪 Testing & Verification

```bash
# Run TypeScript compilation check across all packages
pnpm typecheck

# Lint across apps and packages
pnpm lint

# Build production bundle
pnpm build
```

---

## 📄 License
MIT License. Built for demonstration and MVP technical assessment for digital health systems in Kenya.
