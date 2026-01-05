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
- ✅ `app/auth/login/page.tsx` - Uses useSearchParams
- ✅ `components/dashboard-layout.tsx` - Uses usePathname (wrapped in layout)

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
