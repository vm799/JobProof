# JobProof - Field Service Proof-of-Work Platform

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/vm799s-projects/jobproof)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/m5bcOMMSA1W)

## Overview

JobProof is a mobile-first field service platform that captures proof-of-work in seconds. Eliminate invoice disputes with timestamped photos, signatures, and auto-generated completion reports.

**Key Features:**
- Token-based job links (no technician accounts needed)
- Photo/signature capture on mobile
- Auto-generated completion reports
- Secure cloud storage with workspace isolation
- Multi-tenant SaaS architecture

## Architecture

**Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
**Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
**Deployment:** Vercel
**Mobile:** Responsive web (future: React Native wrapper)

## Project Structure

```
app/
├── (dashboard)/          # Admin interface (authenticated)
│   ├── dashboard/        # Job sessions overview
│   ├── clients/          # Sites/customers directory
│   ├── flows/            # Job template builder
│   ├── templates/        # Pre-built templates
│   ├── analytics/        # Job metrics
│   └── team/             # Technician management
├── portal/[token]/       # Technician job interface (token-based)
├── auth/                 # Authentication pages
└── api/                  # API routes

components/
├── dashboard-layout.tsx  # Admin navigation
├── client-portal.tsx     # Technician mobile UI
├── flow-builder.tsx      # Job template editor
└── ui/                   # shadcn/ui components

lib/
├── supabase/
│   ├── server.ts         # Server-side Supabase client
│   └── client.ts         # Client-side Supabase client
```

## Database Schema

See `JOBPROOF_MVP_BLUEPRINT.md` for complete backend-to-frontend mapping.

**Core Tables:**
- `workspaces` - Company/organization isolation
- `clients` - Sites/customers
- `onboarding_flows` - Job templates (reusable checklists)
- `onboarding_steps` - Template step definitions
- `jobs` - Job sessions (assigned to technicians)
- `client_step_progress` - Job completion tracking
- `file_uploads` - Photos/signatures (proof-of-work)

## Development

**Prerequisites:**
- Node.js 18+
- Supabase account

**Setup:**
```bash
# Install dependencies
npm install

# Set environment variables (see Vars in v0.app sidebar)
# Required: SUPABASE_URL, SUPABASE_ANON_KEY, etc.

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

Your project is live at:

**[https://vercel.com/vm799s-projects/jobproof](https://vercel.com/vm799s-projects/jobproof)**

## Implementation Status

See `JOBPROOF_MVP_BLUEPRINT.md` for the complete 14-day implementation checklist.

**Phase 1 (Complete):**
- ✅ AppSumo references removed
- ✅ Navigation labels updated (Clients → Sites, Flows → Job Templates)
- ✅ Neutral branding applied

**Phase 2 (In Progress):**
- [ ] Job session assignment flow
- [ ] Token-based job links
- [ ] Email notifications to technicians

**Phase 3 (Planned):**
- [ ] Portal rebrand for technicians
- [ ] Photo compression before upload
- [ ] Proof-of-work report generation

## Contributing

Continue building your app on:

**[https://v0.app/chat/m5bcOMMSA1W](https://v0.app/chat/m5bcOMMSA1W)**

## License

Proprietary - All rights reserved
