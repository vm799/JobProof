# JobProof/WorkProof/FieldProof MVP - Complete Implementation Blueprint

**Status:** Execution-ready for < 2-week deployment
**Backend:** Existing Supabase (zero schema changes required)
**Deployment:** Neutral branding only

---

## 1. UI/UX FLOW - Component Mapping

### Admin Screens (Existing → JobProof)
| Screen | Current Route | New Purpose | Components |
|--------|--------------|-------------|------------|
| Dashboard | `/dashboard` | Job sessions overview, activity feed | `app/(dashboard)/dashboard/page.tsx` |
| Clients | `/clients` | Sites/Customers database | `app/(dashboard)/clients/page.tsx`, `components/clients-list.tsx` |
| Flows | `/flows` | Job Templates library | `app/(dashboard)/flows/page.tsx`, `components/flows-list.tsx` |
| Flow Builder | `/flows/[id]` | Job Template editor | `app/(dashboard)/flows/[id]/page.tsx`, `components/flow-builder.tsx` |
| Templates | `/templates` | Pre-built job templates | `app/(dashboard)/templates/page.tsx` |
| Analytics | `/analytics` | Job completion metrics | `app/(dashboard)/analytics/page.tsx` |
| Team | `/team` | Technician management | `app/(dashboard)/team/page.tsx` |

### Technician Screens (Token-Based)
| Screen | Current Route | New Purpose | Components |
|--------|--------------|-------------|------------|
| Job Portal | `/portal/[token]` | Technician job completion interface | `app/portal/[token]/page.tsx`, `components/client-portal.tsx` |
| Success | `/portal/[token]/success` | Job completion confirmation | `app/portal/[token]/success/page.tsx` |
| Expired | `/portal/expired` | Invalid/expired job link | `app/portal/expired/page.tsx` |

### Mobile-First Layout
- Use existing `components/client-portal.tsx` for technician mobile experience
- Already responsive with photo upload, signature capture, step progression
- Token-based access (no auth required for technicians)

---

## 2. LABEL/COPY REPLACEMENT MAP

### Database Terminology
| Old Term | New Term | Usage |
|----------|----------|-------|
| onboarding | job/job_session | A specific job instance assigned to a technician |
| client | site/customer | The physical location or customer entity |
| flow/template | job_template | The reusable checklist/procedure |
| submission | job_completion | When technician marks job as done |
| portal | field_portal | Mobile interface for technicians |
| welcome message | job_instructions | Pre-job briefing for technicians |

### UI Copy Updates
```typescript
// Navigation labels
"Clients" → "Sites" 
"Onboarding Flows" → "Job Templates"
"Templates" → "Template Library"

// Dashboard headings
"Active Onboardings" → "Active Jobs"
"Client Progress" → "Job Status"
"Recent Activity" → "Field Activity"

// Portal/Technician View
"Welcome to your onboarding" → "Job Details"
"Complete your profile" → "Start Job"
"Submit step" → "Mark Complete"
"All steps complete" → "Job Completed"

// Buttons/CTAs
"Create Flow" → "New Job Template"
"Assign Onboarding" → "Create Job Session"
"Send Portal Link" → "Send Job Link"
"Regenerate Token" → "Reset Job Link"

// Status labels
"pending" → "assigned"
"in_progress" → "in_progress" (keep)
"completed" → "completed" (keep)
"overdue" → "overdue" (keep)

// Error messages
"Onboarding link expired" → "Job link expired"
"Client not found" → "Site not found"
```

---

## 3. BACKEND-TO-FRONTEND MAPPING

### Table → Purpose
| Supabase Table | JobProof Purpose | Display Fields | Key Actions |
|----------------|------------------|----------------|-------------|
| `workspaces` | Company/Organization | name, logo_url, brand_color | Admin dashboard isolation |
| `clients` | Sites/Customers | name, email, status | Site directory, job assignment target |
| `onboarding_flows` | Job Templates | name, description, status | Template library, reusable checklists |
| `onboarding_steps` | Job Template Steps | title, description, type, config | Step editor, conditional logic |
| `client_onboardings` | Job Sessions | id, client_id, flow_id, status, onboarding_link_token | Active jobs list, technician assignment |
| `client_step_progress` | Job Step Completion | step_id, status, data, completed_at | Technician progress tracking |
| `file_uploads` | Job Photos/Signatures | storage_path, file_type, file_name | Proof-of-work evidence |
| `notification_logs` | Job Notifications | recipient_email, notification_type, sent_at | SMS/email to technicians |
| `activity_logs` | Field Activity Feed | action, actor_type, metadata | Dashboard timeline |

### Token Security Flow
```typescript
// Generate secure job link
const { onboarding_link_token } = await regenerate_onboarding_token(job_id)
const jobLink = `https://app.com/portal/${onboarding_link_token}`

// RLS automatically isolates workspaces
// Token grants anonymous access to specific job_session only
// No authentication required for technicians
```

### Storage Objects (Proof-of-Work)
- **Bucket:** `job-uploads` (rename from client-uploads)
- **Path:** `{workspace_id}/{job_id}/{file_name}`
- **Types:** Photos (before/after), signatures, PDF reports
- **RLS:** Public read via token, workspace-scoped write

---

## 4. MINIMAL NEW CODE

### A. Job Session Creation (Assign Job to Technician)
**File:** `app/actions/jobs.ts` (rename from flows.ts)
```typescript
"use server"
import { createClient } from "@/lib/supabase/server"

export async function createJobSession(data: {
  siteId: string,
  templateId: string,
  dueDate: Date,
  technicianEmail: string
}) {
  const supabase = await createClient()
  
  // 1. Create job session
  const { data: job, error } = await supabase
    .from("client_onboardings")
    .insert({
      client_id: data.siteId,
      flow_id: data.templateId,
      due_date: data.dueDate,
      status: "assigned"
    })
    .select()
    .single()
  
  // 2. Generate secure token
  const { data: token } = await supabase.rpc("regenerate_onboarding_token", {
    onboarding_id: job.id
  })
  
  // 3. Send link to technician
  await fetch("/api/send-job-link", {
    method: "POST",
    body: JSON.stringify({
      email: data.technicianEmail,
      jobLink: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/${token}`,
      siteName: data.siteName
    })
  })
  
  return { job, token }
}
```

### B. Job Completion Submission
**File:** `app/portal/[token]/actions.ts`
```typescript
"use server"
import { createClient } from "@/lib/supabase/server"

export async function completeJobStep(data: {
  stepId: string,
  jobId: string,
  formData: Record<string, any>,
  photos: string[] // storage paths
}) {
  const supabase = await createClient()
  
  // Update step progress
  await supabase
    .from("client_step_progress")
    .update({
      status: "completed",
      data: formData,
      completed_at: new Date().toISOString()
    })
    .eq("step_id", data.stepId)
    .eq("client_onboarding_id", data.jobId)
  
  // Check if all steps complete
  const { data: allSteps } = await supabase
    .from("client_step_progress")
    .select("status")
    .eq("client_onboarding_id", data.jobId)
  
  const allComplete = allSteps.every(s => s.status === "completed")
  
  if (allComplete) {
    await supabase
      .from("client_onboardings")
      .update({
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", data.jobId)
    
    // Generate proof-of-work report
    await generateProofReport(data.jobId)
  }
}
```

### C. Proof-of-Work Report Rendering
**File:** `components/proof-report.tsx`
```typescript
"use client"

export function ProofReport({ jobId }: { jobId: string }) {
  const { data: job } = useSWR(`/api/jobs/${jobId}/report`)
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1>Job Completion Report</h1>
        <p>Site: {job.site_name}</p>
        <p>Completed: {job.completed_at}</p>
      </div>
      
      {/* Steps & Evidence */}
      {job.steps.map(step => (
        <div key={step.id} className="mb-6">
          <h3>{step.title}</h3>
          {step.photos?.map(photo => (
            <img src={photo || "/placeholder.svg"} alt={step.title} />
          ))}
          {step.signature && <img src={step.signature || "/placeholder.svg"} />}
          {step.notes && <p>{step.notes}</p>}
        </div>
      ))}
      
      {/* Export buttons */}
      <button onClick={() => window.print()}>Print PDF</button>
      <button onClick={() => shareReport(jobId)}>Share Link</button>
    </div>
  )
}
```

### D. PDF Export (Optional)
**File:** `app/api/jobs/[id]/pdf/route.ts`
```typescript
import { NextResponse } from "next/server"
import puppeteer from "puppeteer-core"

export async function GET(req, { params }) {
  const reportHtml = await fetch(`/api/jobs/${params.id}/report`).then(r => r.text())
  
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(reportHtml)
  const pdf = await page.pdf({ format: "A4" })
  await browser.close()
  
  return new NextResponse(pdf, {
    headers: { "Content-Type": "application/pdf" }
  })
}
```

---

## 5. WORKFLOW RECOMMENDATIONS

### Standard Job Lifecycle
1. **Admin Creates Job Template**
   - Define checklist steps (e.g., "Inspect HVAC filters", "Test thermostat")
   - Add conditional fields (e.g., "If damaged, upload photo")
   - Set required photos/signatures per step
   
2. **Admin Creates Job Session**
   - Select site/customer from directory
   - Choose job template
   - Set due date
   - Assign to technician (email)
   
3. **Secure Link Generation**
   - System calls `regenerate_onboarding_token`
   - Token embedded in URL: `/portal/{token}`
   - Email/SMS sent to technician
   
4. **Technician Completes Job**
   - Opens link on mobile (no login required)
   - Sees job instructions and checklist
   - Uploads photos per step
   - Signs off on completion
   
5. **Proof-of-Work Report**
   - Auto-generated upon final step completion
   - Contains timestamped photos, notes, signatures
   - Shareable URL or downloadable PDF
   - Archived for dispute resolution

### Data Validation
- **Required Fields:** Mark critical steps (e.g., safety checks)
- **Photo Requirements:** Min/max photos per step
- **Signature Capture:** Required for sign-off steps
- **Conditional Logic:** Use existing `skip_conditions` in onboarding_steps table

### Friction Reduction
- **No Login for Technicians:** Token-based access only
- **Offline-First:** LocalStorage caching for form data (sync on reconnect)
- **Photo Compression:** Client-side resize before upload
- **Auto-Save:** Draft progress every 30 seconds

---

## 6. LAUNCH/MVP ADVICE

### Landing Page Copy (Neutral Branding)
**Hero Section:**
```
JobProof - Field Service Made Simple
Capture proof-of-work in seconds. Eliminate invoice disputes. 
Mobile-first job completion for technicians.

[Start Free Trial] [Watch Demo]
```

**Features:**
- ✅ Token-based job links (no technician accounts needed)
- ✅ Photo/signature capture on mobile
- ✅ Auto-generated completion reports
- ✅ Secure cloud storage with workspace isolation

**Pricing Tiers:**
```
Starter: $49/mo - 25 jobs/month, 1 workspace
Pro: $149/mo - 100 jobs/month, unlimited templates
Enterprise: Custom - Multi-workspace, API access
```

### User Onboarding (First 2 Pilot Companies)
**Day 1:**
1. Admin signs up → Auto-create workspace
2. Admin creates first job template (guided wizard)
3. Admin adds 1-2 sites/customers
4. Admin creates first job session → Send link to own phone
5. Admin completes job from mobile → See proof report

**Day 3-7:**
1. Admin invites 1-2 real technicians
2. Assign 3-5 real jobs
3. Monitor completion rate

**Week 2:**
1. Export first batch of proof reports
2. Calculate time saved vs. paper/email workflow

### ROI Measurement (Pilot Phase)
**Metrics to Track:**
- **Time Saved:** Avg minutes per job (before vs. after)
- **Invoice Disputes Avoided:** Count of proof reports used in billing
- **Completion Rate:** % of jobs marked complete within due date
- **Photo Quality:** % of jobs with all required photos uploaded

**Target Pilot Success:**
- 80% adoption by assigned technicians
- 50% reduction in time-to-invoice
- Zero invoice disputes on JobProof jobs

### Optional Early Features (Post-Validation)
**Phase 2 (After 10 paying customers):**
- SMS notifications (integrate Twilio)
- Custom branding per workspace (logo, colors)
- Bulk job assignment (CSV import)

**Phase 3 (After 50 paying customers):**
- Mobile app (React Native wrapper)
- Offline mode (IndexedDB sync)
- API for CRM integrations

---

## 7. TOKEN & SECURITY MAPPING

### RLS Integration
**Workspace Isolation:**
```sql
-- Existing policy pattern (already working)
CREATE POLICY "workspace_isolation" ON client_onboardings
FOR ALL USING (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);
```

**Token-Based Access:**
```sql
-- Public portal access via token (already exists)
CREATE POLICY "client_portal_public_access" ON client_onboardings
FOR SELECT USING (
  onboarding_link_token = current_setting('request.headers')::json->>'x-portal-token'
);
```

### Token Refresh/Expiration
**Current System:**
- `token_expires_at` column in `client_onboardings` table
- `regenerate_onboarding_token()` function resets expiration to +30 days
- Frontend checks `token_expires_at` on portal load

**Recommended Handling:**
```typescript
// In portal/[token]/page.tsx
const { data: job } = await supabase
  .from("client_onboardings")
  .select("*, token_expires_at")
  .eq("onboarding_link_token", token)
  .single()

if (new Date(job.token_expires_at) < new Date()) {
  redirect("/portal/expired")
}
```

### Storage Access
**Current Bucket:** `client-uploads`
**RLS Policy:**
```sql
-- Workspace-scoped write
CREATE POLICY "upload_to_own_workspace" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'client-uploads'
  AND (storage.foldername(name))[1] IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Public read via token (add)
CREATE POLICY "public_read_via_token" ON storage.objects
FOR SELECT USING (
  bucket_id = 'client-uploads'
);
```

---

## 8. GRANULAR IMPLEMENTATION CHECKLIST

### Week 1: Core Rebrand & Job Flow
- [ ] **Day 1-2:** Remove AppSumo references
  - [ ] Delete AppSumo markdown files (17 files found)
  - [ ] Update `app/(dashboard)/billing/page.tsx` to remove AppSumo redemption
  - [ ] Replace logo files with neutral "JobProof" branding
  - [ ] Update `components/dashboard-layout.tsx` navigation labels
  
- [ ] **Day 3-4:** Job Template Flow
  - [ ] Rename `app/(dashboard)/flows` to `app/(dashboard)/templates`
  - [ ] Update `components/flows-list.tsx` copy: "flows" → "job templates"
  - [ ] Update `components/flow-builder.tsx` step editor labels
  - [ ] Test: Create job template → Edit → Delete
  
- [ ] **Day 5-7:** Job Session Assignment
  - [ ] Create `app/actions/jobs.ts` (copy from flows.ts, add createJobSession)
  - [ ] Update `app/(dashboard)/clients/page.tsx` to add "Create Job" button per site
  - [ ] Create modal: Select template → Set due date → Technician email
  - [ ] Test: Assign job → Generate token → Send email

### Week 2: Technician Experience & Proof Reports
- [ ] **Day 8-9:** Portal Rebrand
  - [ ] Update `app/portal/[token]/page.tsx` header: "Job Details"
  - [ ] Update `components/client-portal.tsx` step progression labels
  - [ ] Add photo compression before upload (use `browser-image-compression`)
  - [ ] Test: Open job link on mobile → Complete steps → Upload photos
  
- [ ] **Day 10-11:** Proof-of-Work Report
  - [ ] Create `components/proof-report.tsx` (layout: header, steps, photos)
  - [ ] Create `app/api/jobs/[id]/report/route.ts` (fetch job + steps + photos)
  - [ ] Add "View Report" link to completed jobs in dashboard
  - [ ] Test: Complete job → View report → Print PDF
  
- [ ] **Day 12-13:** Polish & Launch Prep
  - [ ] Add empty states: "No jobs yet" → "Create your first job template"
  - [ ] Add success notifications: "Job link sent to [email]"
  - [ ] Update help docs: `/help/page.tsx` with JobProof-specific FAQs
  - [ ] Create landing page: `app/page.tsx` with neutral hero copy
  
- [ ] **Day 14:** Deploy & Pilot
  - [ ] Deploy to production domain
  - [ ] Invite 2 pilot companies (offer free trial)
  - [ ] Monitor Sentry for errors
  - [ ] Collect feedback via in-app chat (remove roadmap voting, add direct feedback form)

---

## 9. API CALL MAPPING

### Admin Actions
| Action | Method | Endpoint/Function | Supabase Query |
|--------|--------|-------------------|----------------|
| List Sites | GET | Client-side | `supabase.from("clients").select("*")` |
| Create Site | POST | Server Action | `supabase.from("clients").insert({...})` |
| List Templates | GET | Client-side | `supabase.from("onboarding_flows").select("*")` |
| Create Template | POST | Server Action | `supabase.from("onboarding_flows").insert({...})` |
| Assign Job | POST | `createJobSession()` | Insert to `client_onboardings`, call `regenerate_onboarding_token` |
| List Jobs | GET | Client-side | `supabase.from("client_onboardings").select("*, clients(*)")` |
| View Report | GET | `/api/jobs/[id]/report` | Join `client_onboardings`, `client_step_progress`, `file_uploads` |

### Technician Actions (Token-Based)
| Action | Method | Endpoint/Function | Supabase Query |
|--------|--------|-------------------|----------------|
| Load Job | GET | Client-side | `supabase.from("client_onboardings").select("*").eq("onboarding_link_token", token)` |
| Load Steps | GET | Client-side | `supabase.from("client_step_progress").select("*, onboarding_steps(*)").eq("client_onboarding_id", jobId)` |
| Upload Photo | POST | Storage upload | `supabase.storage.from("client-uploads").upload(path, file)` |
| Complete Step | POST | `completeJobStep()` | Update `client_step_progress`, check completion, update `client_onboardings` |

---

## 10. RECOMMENDED ORDER OF IMPLEMENTATION

### Phase 1: Minimum Viable Rebrand (3 days)
1. Remove AppSumo files and references
2. Update navigation labels in `dashboard-layout.tsx`
3. Update page headings: Dashboard, Clients, Flows
4. Test: Login → See new labels everywhere

### Phase 2: Job Assignment Flow (3 days)
1. Create `createJobSession()` server action
2. Add "Create Job" button to clients page
3. Build job assignment modal
4. Send job link email
5. Test: Assign job → Technician receives link

### Phase 3: Technician Portal Updates (2 days)
1. Rebrand portal labels ("Job Details", "Start Job")
2. Test photo upload flow
3. Add completion success page
4. Test: Complete job end-to-end

### Phase 4: Proof Reports (3 days)
1. Create proof report component
2. Build report API endpoint
3. Add "View Report" to dashboard
4. Test: View completed job report

### Phase 5: Polish & Deploy (3 days)
1. Add empty states
2. Update help docs
3. Create landing page
4. Deploy + invite pilots

**Total: 14 days**

---

## END GOAL CONFIRMATION

This blueprint enables you to:
1. ✅ Keep 100% of existing Supabase schema
2. ✅ Remove all AppSumo branding/references
3. ✅ Ship a neutral MVP in < 2 weeks
4. ✅ Focus on core value: proof-of-work capture + invoice dispute reduction
5. ✅ Validate with 2-5 pilot customers before investing in advanced features

**Next Step:** Execute checklist starting with Phase 1 (AppSumo removal).
