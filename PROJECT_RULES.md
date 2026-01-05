# PROJECT RULES - READ THIS FIRST ALWAYS

## CRITICAL BUILD CONSTRAINTS

### 1. Suspense Boundaries - NEVER FORGET
**ANY component using these hooks MUST be wrapped in `<Suspense>`:**
- `useSearchParams()`
- `usePathname()`
- `useRouter()` (from next/navigation)

**Pattern to follow:**
```tsx
// WRONG ❌
export default function Page() {
  const searchParams = useSearchParams()
  return <div>...</div>
}

// RIGHT ✅
function PageContent() {
  const searchParams = useSearchParams()
  return <div>...</div>
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  )
}
```

### 2. Supabase Client/Server Separation
**NEVER import server client in client components:**

- ✅ **Server Components/Actions**: Use `@/lib/supabase/server`
- ✅ **Client Components**: Use `@/lib/supabase/client`

**Check for "use client" directive:**
- If file has `"use client"` → Use `@/lib/supabase/client`
- If file is async Server Component → Use `@/lib/supabase/server`

### 3. No pages/ Directory
**The app uses App Router ONLY:**
- All routes must be in `app/` directory
- NO `pages/` or `src/pages/` folders allowed
- If you see a pages folder, DELETE IT immediately

### 4. Async Server Components
**Server Components that fetch data:**
- Must export `const dynamic = "force-dynamic"`
- Must use `await createClient()` for Supabase
- NEVER use `"use client"` with async functions

### 5. Cookie Headers (Next.js 16)
**In lib/supabase/server.ts:**
- Must use `await cookies()` (not just `cookies()`)
- Must have `'use server'` directive at the top
- This is REQUIRED for Next.js 16+

## DEBUGGING CHECKLIST

Before claiming "no issues found":
1. **Grep for useSearchParams**: `grep -r "useSearchParams" app/`
2. **Grep for usePathname**: `grep -r "usePathname" components/`
3. **Check for pages folder**: `ls -la pages/` or `ls -la src/pages/`
4. **Find server imports in client**: `grep -r '"use client"' app/ | xargs grep -l '@/lib/supabase/server'`
5. **Check layout Suspense**: Ensure `app/(dashboard)/layout.tsx` wraps DashboardLayout in Suspense

## KNOWN FILES THAT NEED SUSPENSE
- ✅ `app/auth/login/page.tsx` - Uses useSearchParams (WRAPPED ✓)
- ✅ `components/dashboard-layout.tsx` - Uses usePathname (WRAPPED in layout ✓)

## BUILD ERROR SIGNATURES
- "only works in a Server Component" → Check for server import in client component
- "useSearchParams" warning → Missing Suspense boundary
- "cookies() can only be used" → Check Next.js 16 syntax in lib/supabase/server.ts
- "conflicting route groups" → Check for duplicate page.tsx files or pages/ folder

## DEPLOYMENT SAFETY
Before every deployment:
1. Run `grep -r "useSearchParams\|usePathname" app/ components/`
2. Verify all matches are wrapped in Suspense
3. Check that lib/supabase/server.ts has `await cookies()`
4. Confirm no pages/ directory exists
5. Test build locally: `npm run build`

---

## AUDIT HISTORY

### Latest Audit: [Current Date]
**Status: ✅ SYSTEM COMPLIANT - ALL CHECKS PASSED**

**Checks Performed:**
1. ✅ Suspense Boundaries - Login page properly wrapped (lines 411-426)
2. ✅ No pages/ directory - Confirmed using App Router only
3. ✅ Cookie headers - Correct Next.js 16 syntax with `await cookies()`
4. ✅ Build script - Clean: `"next build"` in package.json
5. ✅ Server/Client isolation - All client components use client Supabase
6. ✅ PROJECT_RULES.md - Exists and comprehensive

**Architecture Lock:**
- Next.js: 16.0.10
- React: 19.2.0
- @supabase/ssr: 0.8.0
- App Router: Enabled
- Route Groups: (dashboard) for protected routes only

**Known Good Patterns:**
- Login: Uses Suspense wrapper with LoginContent child component
- Dashboard Layout: Wrapped in Suspense via app/(dashboard)/layout.tsx
- All Server Actions: Marked with 'use server'
- All API routes: Use server-side Supabase client

**Zero Violations Detected**

---

## PERMANENT RULES TO PREVENT REGRESSIONS

### DO NOT CREATE:
- ❌ `pages/` directory
- ❌ `app/(marketing)` folder
- ❌ Duplicate route groups for same URL path
- ❌ Client Components importing `@/lib/supabase/server`

### ALWAYS DO:
- ✅ Read this file FIRST before making changes
- ✅ Wrap `useSearchParams()` and `usePathname()` in Suspense
- ✅ Use `await cookies()` in lib/supabase/server.ts
- ✅ Mark Server Actions with `'use server'`
- ✅ Use `export const dynamic = "force-dynamic"` for data-fetching pages

### TESTING COMMANDS:
```bash
# Check for Suspense violations
grep -rn "useSearchParams\|usePathname" app/ components/ --include="*.tsx" --include="*.ts"

# Check for server imports in client components
find app/ -name "*.tsx" -exec grep -l '"use client"' {} \; | xargs grep -l '@/lib/supabase/server'

# Verify no pages directory exists
ls -la pages/ src/pages/ 2>/dev/null || echo "✅ No pages directory found"

# Test build
npm run build
```

---

## EMERGENCY RECOVERY

If build fails with:
- **"useSearchParams" warning** → Find the file, extract to child component, wrap in Suspense
- **"cookies() can only be used"** → Check lib/supabase/server.ts has `await cookies()`
- **"conflicting route groups"** → Delete pages/ folder or find duplicate page.tsx files
- **"Server Component context"** → Check client component isn't importing server Supabase

**Contact senior engineer if any of these errors persist after following the rules.**
