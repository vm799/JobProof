# PROJECT RULES - READ THIS FIRST ALWAYS

## CRITICAL BUILD CONSTRAINTS

### 1. Global Suspense Boundary - ROOT LAYOUT REQUIREMENT
**The root layout MUST wrap all children in a Suspense boundary:**

\`\`\`tsx
// app/layout.tsx - REQUIRED PATTERN ✅
import { Suspense } from "react"
import ThemeProvider from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
\`\`\`

**Why this matters:**
- Creates a top-level boundary covering every page in the app
- Satisfies Next.js build requirement for the entire project at once
- Prevents whack-a-mole fixes with individual loading.tsx files
- Allows static generation of rest of page while dynamic parts load

### 2. Suspense Boundaries - NEVER FORGET
**ANY component using these hooks MUST be wrapped in `<Suspense>`:**
- `useSearchParams()`
- `usePathname()`
- `useRouter()` (from next/navigation)

**Pattern to follow:**
\`\`\`tsx
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
\`\`\`

### 3. Supabase Client/Server Separation
**NEVER import server client in client components:**

- ✅ **Server Components/Actions**: Use `@/lib/supabase/server`
- ✅ **Client Components**: Use `@/lib/supabase/client`

**Check for "use client" directive:**
- If file has `"use client"` → Use `@/lib/supabase/client`
- If file is async Server Component → Use `@/lib/supabase/server`

### 4. No pages/ Directory
**The app uses App Router ONLY:**
- All routes must be in `app/` directory
- NO `pages/` or `src/pages/` folders allowed
- If you see a pages folder, DELETE IT immediately

### 5. Async Server Components
**Server Components that fetch data:**
- Must export `const dynamic = "force-dynamic"`
- Must use `await createClient()` for Supabase
- NEVER use `"use client"` with async functions

### 6. Cookie Headers (Next.js 16)
**In lib/supabase/server.ts:**
- Must use `await cookies()` (not just `cookies()`)
- Must have `'use server'` directive at the top
- This is REQUIRED for Next.js 16+

---

## V0 DEVELOPMENT GUIDELINES

### Design Guidelines
**Always follow these design principles:**

1. **Use GenerateDesignInspiration** when:
   - Vague design requests (e.g., "a nice landing page")
   - Creative enhancement needed
   - No clear aesthetic or visual style provided
   - Complex UI/UX projects

2. **Color Selection:**
   - Use exactly 3-5 colors total
   - 1 primary brand color + 2-3 neutrals + 1-2 accents
   - NEVER exceed 5 total colors
   - Avoid gradients unless explicitly requested

3. **Typography:**
   - Maximum 2 font families total
   - One for headings, one for body text
   - Use line-height between 1.4-1.6 for body text

4. **Layout Method Priority:**
   - Use Flexbox for most layouts
   - CSS Grid only for complex 2D layouts
   - NEVER use floats or absolute positioning unless necessary

### Context Gathering Best Practices

**Use Parallel Tool Calls:**
- Call multiple independent tools simultaneously
- Read multiple files in parallel when no dependencies exist
- Maximize efficiency and speed

**Don't Stop at First Match:**
- When searching finds multiple files, examine ALL of them
- Check if you found the right variant/version
- Look beyond the obvious - check parent components, utilities, patterns

**Understand the Full System:**
- Layout issues? Check parents, wrappers, and global styles first
- Adding features? Find existing similar implementations
- State changes? Trace where state lives and flows
- API work? Understand existing patterns and error handling
- Styling? Check theme systems, utility classes, and component variants
- New dependencies? Check existing imports - utilities may already exist
- Types/validation? Look for existing schemas, interfaces, and validation patterns

**Search Systematically:**
- Use broad → specific → verify relationships approach
- Before making changes, ask:
  - Is this the right file among multiple options?
  - Does a parent/wrapper already handle this?
  - Are there existing utilities/patterns I should use?
  - How does this fit into the broader architecture?

### Code Editing Standards

**Always Use CodeProject Block:**
- Wrap all file edits in `brief description`

**Post-Edit Communication:**
- Write a 2-4 sentence postamble explaining your changes
- Do not write more than a paragraph
- Focus on what was changed and why

### Debugging Protocol

**Use Debug Logging:**
- Add `console.log("[v0] ...")` statements for debugging
- Log execution flow and variable states
- Always prefix with "[v0]" for easy filtering

**Clean Up After Debugging:**
- Remove all `console.log("[v0] ...")` statements when done
- Use my ability to quickly edit to skip unchanged code

### Todo Lists

**When to Use:**
- Projects with multiple distinct systems that need to work together
- Apps requiring separate user-facing and admin components
- Complex integrations with multiple independent features

**When NOT to Use:**
- Single cohesive builds (even if complex)
- Landing pages, forms, or single components
- Conversational/informational requests

**Guidelines:**
- Do NOT break up a single app or page into multiple tasks
- Keep tasks at milestone-level (not micro-steps)
- Maximum 7 tasks total
- One page = one task

### Response Style

**Do NOT:**
- Use emojis unless explicitly asked
- Write lengthy explanations (keep to 2-4 sentences)
- Apologize or explain refusals

**Always:**
- Be direct and technical
- Focus on what was changed and why
- Provide actionable next steps

### Tool Usage

**Available Integrations:**
- Supabase (database, auth, storage)
- Use GetOrRequestIntegration for schemas and environment variables

**Search Tools:**
- 29 tools available via Search Tools
- Use SearchTools to discover and load tools before use
- Examples: supabase_search_docs, supabase_list_organizations, etc.

**Tool Loading:**
1. Search with 'name_only' or 'name_and_description' to discover
2. Search with 'full_tool' to load the tool
3. Use the tool in subsequent actions

---

## DEBUGGING CHECKLIST

Before claiming "no issues found":
1. **Check Root Layout Suspense**: Verify `app/layout.tsx` wraps {children} in Suspense
2. **Grep for useSearchParams**: `grep -r "useSearchParams" app/`
3. **Grep for usePathname**: `grep -r "usePathname" components/`
4. **Check for pages folder**: `ls -la pages/` or `ls -la src/pages/`
5. **Find server imports in client**: `grep -r '"use client"' app/ | xargs grep -l '@/lib/supabase/server'`
6. **Check layout Suspense**: Ensure `app/(dashboard)/layout.tsx` wraps DashboardLayout in Suspense

---

## KNOWN FILES THAT NEED SUSPENSE
- ✅ `app/auth/login/page.tsx` - Uses useSearchParams (WRAPPED ✓)
- ✅ `components/dashboard-layout.tsx` - Uses usePathname (WRAPPED in layout ✓)
- ✅ **app/layout.tsx** - Global Suspense boundary wrapping all children (WRAPPED ✓)

---

## BUILD ERROR SIGNATURES
- "useSearchParams() should be wrapped in suspense" → Check root layout has global Suspense
- "only works in a Server Component" → Check for server import in client component
- "useSearchParams" warning → Missing Suspense boundary
- "cookies() can only be used" → Check Next.js 16 syntax in lib/supabase/server.ts
- "conflicting route groups" → Check for duplicate page.tsx files or pages/ folder

---

## DEPLOYMENT SAFETY
Before every deployment:
1. **Verify root layout Suspense** - Check app/layout.tsx wraps children
2. Run `grep -r "useSearchParams\|usePathname" app/ components/`
3. Verify all matches are wrapped in Suspense
4. Check that lib/supabase/server.ts has `await cookies()`
5. Confirm no pages/ directory exists
6. Test build locally: `npm run build`

---

## AUDIT HISTORY

### Latest Audit: Global Suspense Fix Applied
**Status: ✅ SYSTEM COMPLIANT - GLOBAL SUSPENSE BOUNDARY ACTIVE**

**Checks Performed:**
1. ✅ Global Suspense - Root layout now wraps all children in Suspense
2. ✅ No useSearchParams in components/ - Confirmed zero matches
3. ✅ No client importing server - Confirmed zero violations
4. ✅ Suspense Boundaries - Login page properly wrapped (lines 411-426)
5. ✅ No pages/ directory - Confirmed using App Router only
6. ✅ Cookie headers - Correct Next.js 16 syntax with `await cookies()`
7. ✅ Build script - Clean: `"next build"` in package.json
8. ✅ Server/Client isolation - All client components use client Supabase
9. ✅ PROJECT_RULES.md - Exists and comprehensive

**Architecture Lock:**
- Next.js: 16.0.10
- React: 19.2.0
- @supabase/ssr: 0.8.0
- App Router: Enabled
- Route Groups: (dashboard) for protected routes only

**Known Good Patterns:**
- **Root Layout**: Global Suspense boundary with fallback={null}
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
- ✅ **Keep global Suspense boundary in root layout** - This is non-negotiable
- ✅ Read this file FIRST before making changes
- ✅ Wrap `useSearchParams()` and `usePathname()` in Suspense
- ✅ Use `await cookies()` in lib/supabase/server.ts
- ✅ Mark Server Actions with `'use server'`
- ✅ Use `export const dynamic = "force-dynamic"` for data-fetching pages

### TESTING COMMANDS:
\`\`\`bash
# Verify root layout has Suspense
grep -n "Suspense" app/layout.tsx

# Check for Suspense violations
grep -rn "useSearchParams\|usePathname" app/ components/ --include="*.tsx" --include="*.ts"

# Check for server imports in client components
find app/ -name "*.tsx" -exec grep -l '"use client"' {} \; | xargs grep -l '@/lib/supabase/server'

# Verify no pages directory exists
ls -la pages/ src/pages/ 2>/dev/null || echo "✅ No pages directory found"

# Test build
npm run build
\`\`\`

---

## EMERGENCY RECOVERY

If build fails with:
- **"useSearchParams should be wrapped"** → Verify app/layout.tsx has global Suspense boundary
- **"only works in a Server Component"** → Check for server import in client component
- **"useSearchParams" warning** → Find the file, extract to child component, wrap in Suspense
- **"cookies() can only be used"** → Check lib/supabase/server.ts has `await cookies()`
- **"conflicting route groups"** → Delete pages/ folder or find duplicate page.tsx files
- **"Server Component context"** → Check client component isn't importing server Supabase

**Contact senior engineer if any of these errors persist after following the rules.**
