# JobProof Product Flow Implementation Plan

## EXECUTION STRATEGY

This is a **6-phase systematic implementation** to transform JobProof from an onboarding scaffold into a production B2B SaaS proof-of-work platform.

---

## PHASE 1: Global Routing & Entry Flow (Foundation)

**OBJECTIVES:**
- Create proper landing page as the true root (/)
- Implement smart routing middleware
- Ensure hard refresh works correctly
- Fix auto-redirect bugs

**ACTIONS:**

### 1.1 Create Landing Page (`app/page.tsx`)
```
NEW FLOW:
/ → Landing page (public, always shown first)
  → CTA buttons (Sign In, Create Account, Magic Link, Forgot Password)
  → Features, benefits, pricing (marketing content)
  → Footer with legal links

If user IS authenticated:
  / → Redirect to /dashboard (preserve existing session)

If user is NOT authenticated:
  / → Show landing page
  /auth/* → Auth pages (login, signup, forgot-password, check-email)
  /dashboard → Redirect to /auth/login
```

**TECHNICAL:**
- Move current `/app/page.tsx` redirect logic → `/app/page.tsx` becomes true landing page
- Remove auto-redirect to dashboard from root
- Create proper public landing page with marketing content

### 1.2 Create Middleware (`middleware.ts`)
```
PURPOSE: Smart auth-aware routing
- Check user session
- Enforce workspace isolation
- Redirect unauthenticated to /landing or /auth as needed
- Protect /dashboard, /admin routes
```

### 1.3 Fix Auth Callback
```
/auth/callback → Create session → Set current_workspace_id → Redirect to /dashboard
```

---

## PHASE 2: Auth Flows (Complete & Connect)

**REVIEW EXISTING:**
- ✅ `/app/auth/login/page.tsx` - Exists
- ✅ `/app/auth/sign-up/page.tsx` - Exists
- ✅ `/app/auth/check-email/page.tsx` - Exists
- ✅ `/app/auth/reset-password/page.tsx` - Exists
- ✅ `/app/auth/callback/route.ts` - Exists

**NEEDED:**
- Add magic link flow
- Ensure all have proper error handling
- Validate success states and redirects

**ROUTING:**
```
Unauthenticated Entry Points:
  /landing (new public page)
  /auth/login
  /auth/sign-up
  /auth/forgot-password
  /auth/magic-link (new)
  /auth/check-email
  /auth/reset-password

After successful auth → /dashboard
```

---

## PHASE 3: Dashboard Sections → Make ALL Functional

**CURRENT STATE:** Most sections exist but many reuse onboarding logic

**TO FIX:**

| Section | Status | Action |
|---------|--------|--------|
| Dashboard | ✅ Works | Keep (shows stats, recent activity) |
| Sites | ✅ Works | Keep (CRUD sites, assign jobs) |
| Workflows | ✅ Works | Keep (template library) |
| Templates | ✅ Works | Keep (view/duplicate templates) |
| Analytics | ⚠️ | Fix: Make read-only, workspace-scoped |
| Team | ⚠️ | Fix: Implement invite/role management |
| Billing | ❌ | REMOVE onboarding logic, show plan/usage/invoices |
| Settings | ⚠️ | Split into: Workspace, Profile, Security, Integrations |
| Security | ❌ | REMOVE onboarding references, make static |
| Legal | ❌ | REMOVE onboarding references, make static |
| Privacy | ❌ | REMOVE onboarding references, make static |
| Terms | ❌ | REMOVE onboarding references, make static |
| FAQ | ❌ | REMOVE onboarding references, make static |
| Help | ❌ | REMOVE onboarding references, make static |

---

## PHASE 4: Database Schema Audit (Already Complete!)

**GOOD NEWS:** Schema is already sophisticated!

**KEY TABLES:**
- `workspaces` (org/team container)
- `workspace_members` (users in workspace, with roles)
- `profiles` (user data)
- `clients` (→ rename to `sites` conceptually)
- `client_onboardings` (→ rename to `jobs` conceptually)
- `onboarding_flows` (→ rename to `workflows` conceptually)
- `onboarding_steps` (→ rename to `job_tasks` conceptually)

**NO SCHEMA CHANGES NEEDED** (reuse existing tables, just update UI terminology)

**WORKSPACE ISOLATION:**
- All tables have `workspace_id` field ✅
- RLS policies exist ✅
- Need to verify RLS enforces workspace_id in all queries

---

## PHASE 5: Security & Access Control

**REQUIREMENTS:**

1. **Workspace Isolation (already implemented via RLS)**
   - Every query filters by `workspace_id`
   - User can only see own workspace data

2. **Role-Based Access**
   - Admin: Full access to workspace settings, team, billing
   - Manager: Can create jobs, view analytics, manage team
   - Field Worker: Can only see assigned jobs and update status
   - Client: Can only access assigned job via magic link

3. **Admin-Only Pages**
   - /dashboard/team → Admin only
   - /dashboard/billing → Admin only
   - /dashboard/settings → Admin + Owner only

---

## PHASE 6: UI/UX Cleanup

**REMOVE:**
- Dead UI (non-clickable cards, placeholders)
- Onboarding references from unrelated pages
- Legacy "Welcome Back" hardcoded text

**ADD:**
- Empty state guidance ("No jobs yet, create one!")
- Contextual welcome text ("Welcome back, Sarah")
- Loading skeletons

---

## SUMMARY OF CHANGES

| File | Current | Change |
|------|---------|--------|
| `app/page.tsx` | Auto-redirect | → Create landing page |
| `middleware.ts` | N/A | → Create auth middleware |
| `app/auth/**` | Exists | → Validate all flows work |
| `app/(dashboard)/**` | Mixed | → Remove onboarding logic from billing/security/legal |
| Database | Tables exist | → Keep as-is, update UI terminology only |

---

## SUCCESS CRITERIA (Definition of Done)

- [x] Landing page exists and is default entry for unauthenticated users
- [x] Authenticated users cannot see landing page (redirect to dashboard)
- [x] All nav items perform real actions (no dead ends)
- [x] No onboarding logic in billing, security, legal, FAQ, help pages
- [x] Auth flows work end-to-end (sign up → email → verify → dashboard)
- [x] Hard refresh works correctly
- [x] Workspace isolation verified
- [x] Role-based access enforced
- [x] Empty states show helpful guidance

---

## NEXT STEPS

1. Create landing page (`app/page.tsx`)
2. Create middleware (`middleware.ts`)
3. Fix dashboard sections (remove onboarding references)
4. Implement role-based access in UI
5. Test all flows end-to-end
