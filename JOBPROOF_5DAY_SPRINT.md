# JobProof MVP - 5-Day Sprint Plan (Non-Developer Guide)

**Goal:** Transform getboardingpass.app into a pilot-ready JobProof MVP by Friday
**Your Role:** Copy-paste code snippets exactly as shown
**Database:** Zero schema changes - everything reuses existing Supabase tables

---

## 🗓️ DAY 1: Branding Cleanup & Navigation

### Task 1.1: Remove AppSumo References (30 minutes)

**Delete these 17 files via GitHub or File Explorer:**
```bash
APPSUMO_LAUNCH_AUDIT.md
APPSUMO_LAUNCH_CHECKLIST.md
# (see complete list in JOBPROOF_MVP_BLUEPRINT.md Section 8)
```

**Action:** In your file browser, delete all files with "APPSUMO" in the name.

---

### Task 1.2: Update Navigation Labels (15 minutes)

**File:** `components/dashboard-layout.tsx`

**Find this code (around line 25-50):**
```tsx
{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
{ href: "/clients", label: "Clients", icon: Users },
{ href: "/flows", label: "Flows", icon: Workflow },
```

**Replace with:**
```tsx
{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
{ href: "/clients", label: "Sites", icon: MapPin },
{ href: "/flows", label: "Job Templates", icon: ClipboardList },
```

**Action:** 
1. Open `components/dashboard-layout.tsx` in your code editor
2. Use Ctrl+F (Windows) or Cmd+F (Mac) to find "Clients"
3. Replace "Clients" with "Sites"
4. Replace "Flows" with "Job Templates"
5. Save the file

---

### Task 1.3: Update Page Headings (20 minutes)

**File:** `components/clients-list.tsx`

**Find:**
```tsx
<h1 className="text-3xl font-bold">Clients</h1>
```

**Replace with:**
```tsx
<h1 className="text-3xl font-bold">Sites</h1>
```

**File:** `components/flows-list.tsx`

**Find:**
```tsx
<h1 className="text-3xl font-bold">Onboarding Flows</h1>
```

**Replace with:**
```tsx
<h1 className="text-3xl font-bold">Job Templates</h1>
```

**Action:** Repeat the Find & Replace process for both files.

---

### Task 1.4: Test Your Changes

**Action:**
1. Open your terminal
2. Run: `npm run dev`
3. Open browser to `http://localhost:3000`
4. Login to your account
5. **Verify:** Navigation now shows "Sites" and "Job Templates"

**If errors appear:** Screenshot the error message and continue to Day 2 tasks (navigation labels are cosmetic).

---

## 🗓️ DAY 2: Job Assignment Flow - Backend

### Task 2.1: Create Job Actions File (10 minutes)

**Action:** Create a new file `app/actions/jobs.ts`

**Copy this code exactly:**
```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createJobSession(data: {
  siteId: string
  templateId: string
  dueDate: string
  technicianEmail: string
  siteName: string
}) {
  const supabase = await createClient()
  
  // 1. Get current user & workspace
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_workspace_id")
    .eq("id", user.id)
    .single()
  
  if (!profile?.current_workspace_id) throw new Error("No workspace")
  
  // 2. Create job session (reuses client_onboardings table)
  const { data: job, error: jobError } = await supabase
    .from("client_onboardings")
    .insert({
      client_id: data.siteId,
      flow_id: data.templateId,
      due_date: data.dueDate,
      status: "pending",
      workspace_id: profile.current_workspace_id
    })
    .select()
    .single()
  
  if (jobError) throw jobError
  
  // 3. Generate secure token (reuses existing function)
  const { data: tokenData, error: tokenError } = await supabase
    .rpc("regenerate_onboarding_token", {
      onboarding_id: job.id
    })
  
  if (tokenError) throw tokenError
  
  const jobLink = `${process.env.NEXT_PUBLIC_SITE_URL}/portal/${tokenData}`
  
  // 4. Send email to technician (reuses existing email system)
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-job-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.technicianEmail,
      jobLink,
      siteName: data.siteName
    })
  })
  
  revalidatePath("/dashboard")
  revalidatePath("/clients")
  
  return { success: true, jobId: job.id, jobLink }
}
```

**Action:** Save the file.

---

### Task 2.2: Create Email Endpoint (15 minutes)

**Action:** Create a new file `app/api/send-job-link/route.ts`

**Copy this code exactly:**
```typescript
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, jobLink, siteName } = await req.json()
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@getboardingpass.app",
      to: email,
      subject: `New Job Assigned: ${siteName}`,
      html: `
        <h2>You have a new job assignment</h2>
        <p><strong>Site:</strong> ${siteName}</p>
        <p>Click the link below to start the job:</p>
        <a href="${jobLink}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">
          Start Job
        </a>
        <p style="color: #666; font-size: 14px;">This link expires in 30 days.</p>
      `
    })
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Job Link Email Error]:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
```

**Action:** Save the file.

---

### Task 2.3: Update Environment Variables (5 minutes)

**Action:**
1. Open your Vercel dashboard (or `.env.local` if running locally)
2. Verify these variables exist:
   - `NEXT_PUBLIC_SITE_URL` (e.g., `https://getboardingpass.app`)
   - `RESEND_API_KEY` (already configured)
   - `RESEND_FROM_EMAIL` (already configured)

**If missing:** Add `NEXT_PUBLIC_SITE_URL=https://getboardingpass.app` to your environment variables.

---

## 🗓️ DAY 3: Job Assignment Flow - Frontend

### Task 3.1: Add "Create Job" Button to Sites Page (20 minutes)

**File:** `components/clients-list.tsx`

**Find the section that shows client cards (around line 50-80). Add this button inside each card:**

```tsx
<Button 
  onClick={() => handleCreateJob(client.id, client.name)}
  size="sm"
  variant="outline"
>
  <Plus className="h-4 w-4 mr-2" />
  Create Job
</Button>
```

**Then add this function at the top of the component:**

```tsx
const [showJobModal, setShowJobModal] = useState(false)
const [selectedSite, setSelectedSite] = useState<{ id: string; name: string } | null>(null)

function handleCreateJob(siteId: string, siteName: string) {
  setSelectedSite({ id: siteId, name: siteName })
  setShowJobModal(true)
}
```

**Action:** Save the file.

---

### Task 3.2: Create Job Assignment Modal (30 minutes)

**Action:** Create a new file `components/create-job-modal.tsx`

**Copy this code exactly:**
```tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createJobSession } from "@/app/actions/jobs"
import { toast } from "sonner"

interface CreateJobModalProps {
  open: boolean
  onClose: () => void
  site: { id: string; name: string }
  templates: Array<{ id: string; name: string }>
}

export function CreateJobModal({ open, onClose, site, templates }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false)
  const [templateId, setTemplateId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [technicianEmail, setTechnicianEmail] = useState("")
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!templateId || !dueDate || !technicianEmail) {
      toast.error("Please fill in all fields")
      return
    }
    
    setLoading(true)
    
    try {
      const result = await createJobSession({
        siteId: site.id,
        templateId,
        dueDate,
        technicianEmail,
        siteName: site.name
      })
      
      toast.success(`Job assigned! Link sent to ${technicianEmail}`)
      onClose()
      
      // Optionally copy link to clipboard
      if (result.jobLink) {
        navigator.clipboard.writeText(result.jobLink)
        toast.info("Job link copied to clipboard")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to create job")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Job for {site.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Job Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Due Date</Label>
            <Input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <Label>Technician Email</Label>
            <Input 
              type="email" 
              value={technicianEmail}
              onChange={(e) => setTechnicianEmail(e.target.value)}
              placeholder="tech@example.com"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Action:** Save the file.

---

### Task 3.3: Connect Modal to Sites Page (15 minutes)

**File:** `components/clients-list.tsx`

**Add this import at the top:**
```tsx
import { CreateJobModal } from "./create-job-modal"
```

**Add this code before the return statement:**
```tsx
const [templates, setTemplates] = useState([])

useEffect(() => {
  async function fetchTemplates() {
    const supabase = createClient()
    const { data } = await supabase
      .from("onboarding_flows")
      .select("id, name")
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
    
    setTemplates(data || [])
  }
  fetchTemplates()
}, [workspaceId])
```

**Add this to the JSX (after the clients list):**
```tsx
{showJobModal && selectedSite && (
  <CreateJobModal
    open={showJobModal}
    onClose={() => setShowJobModal(false)}
    site={selectedSite}
    templates={templates}
  />
)}
```

**Action:** Save the file.

---

### Task 3.4: Test Job Creation

**Action:**
1. Restart your dev server: `npm run dev`
2. Navigate to "Sites" page
3. Click "Create Job" button
4. **Verify:** Modal opens with template dropdown, date picker, email field
5. Select a template, set future date, enter YOUR email
6. Click "Create Job"
7. **Check your email inbox** for the job link
8. **Verify:** Success toast appears with "Job assigned!"

---

## 🗓️ DAY 4: Technician Portal Updates

### Task 4.1: Rebrand Portal Labels (20 minutes)

**File:** `app/portal/[token]/page.tsx`

**Find:**
```tsx
<h1>Welcome to your onboarding</h1>
```

**Replace with:**
```tsx
<h1>Job Details</h1>
```

**Find:**
```tsx
<Button>Complete your profile</Button>
```

**Replace with:**
```tsx
<Button>Start Job</Button>
```

**Action:** Use Find & Replace to update all portal-related copy.

---

### Task 4.2: Update Step Completion Labels (15 minutes)

**File:** `components/client-portal.tsx`

**Find these button labels and replace:**
```tsx
"Submit Step" → "Mark Complete"
"Next Step" → "Continue"
"All steps complete!" → "Job Completed"
```

**Action:** Save the file.

---

### Task 4.3: Test Technician Flow

**Action:**
1. Open the job link you received via email (from Day 3 testing)
2. **Verify:** Header shows "Job Details" instead of "Welcome to your onboarding"
3. Click through the steps
4. Upload a test photo (if step requires photos)
5. Mark steps as complete
6. **Verify:** Final screen shows "Job Completed" instead of "Onboarding Complete"

---

## 🗓️ DAY 5: Proof-of-Work Report & Polish

### Task 5.1: Create Proof Report Component (40 minutes)

**Action:** Create a new file `components/proof-report.tsx`

**Copy this code exactly:**
```tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Printer, Share2 } from "lucide-react"

interface ProofReportProps {
  jobId: string
}

export function ProofReport({ jobId }: ProofReportProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchReport() {
      const supabase = createClient()
      
      // Fetch job details
      const { data: job } = await supabase
        .from("client_onboardings")
        .select(`
          *,
          clients(name, email),
          onboarding_flows(name)
        `)
        .eq("id", jobId)
        .single()
      
      // Fetch completed steps
      const { data: steps } = await supabase
        .from("client_step_progress")
        .select(`
          *,
          onboarding_steps(title, description, type)
        `)
        .eq("client_onboarding_id", jobId)
        .eq("status", "completed")
        .order("completed_at", { ascending: true })
      
      // Fetch photos
      const { data: photos } = await supabase
        .from("file_uploads")
        .select("*")
        .eq("client_onboarding_id", jobId)
      
      setData({ job, steps: steps || [], photos: photos || [] })
      setLoading(false)
    }
    
    fetchReport()
  }, [jobId])
  
  if (loading) return <div>Loading report...</div>
  if (!data) return <div>No data available</div>
  
  const { job, steps, photos } = data
  
  function handlePrint() {
    window.print()
  }
  
  function handleShare() {
    const url = `${window.location.origin}/reports/${jobId}`
    navigator.clipboard.writeText(url)
    alert("Report link copied to clipboard!")
  }
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white print:p-4">
      {/* Header */}
      <div className="mb-8 pb-6 border-b print:border-black">
        <h1 className="text-3xl font-bold mb-2">Job Completion Report</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Site</p>
            <p className="font-semibold">{job.clients?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Job Type</p>
            <p className="font-semibold">{job.onboarding_flows?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completed</p>
            <p className="font-semibold">
              {new Date(job.completed_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-semibold capitalize">{job.status}</p>
          </div>
        </div>
      </div>
      
      {/* Steps & Evidence */}
      <div className="space-y-8 mb-8">
        <h2 className="text-2xl font-semibold">Completed Steps</h2>
        {steps.map((step: any, index: number) => (
          <div key={step.id} className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {index + 1}. {step.onboarding_steps?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.onboarding_steps?.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(step.completed_at).toLocaleString()}
              </span>
            </div>
            
            {/* Photos for this step */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {photos
                .filter((photo: any) => photo.step_id === step.step_id)
                .map((photo: any) => (
                  <img
                    key={photo.id}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-uploads/${photo.storage_path}`}
                    alt={photo.file_name}
                    className="rounded-lg border w-full h-48 object-cover"
                  />
                ))}
            </div>
            
            {/* Form data */}
            {step.data && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-semibold mb-2">Notes:</p>
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(step.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print PDF
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Link
        </Button>
      </div>
    </div>
  )
}
```

**Action:** Save the file.

---

### Task 5.2: Add Report View to Dashboard (20 minutes)

**File:** `app/(dashboard)/dashboard/page.tsx`

**Add this link to completed jobs (find where jobs are displayed):**

```tsx
{job.status === "completed" && (
  <Button 
    variant="outline" 
    size="sm"
    onClick={() => router.push(`/reports/${job.id}`)}
  >
    View Report
  </Button>
)}
```

**Action:** Create a new page `app/(dashboard)/reports/[id]/page.tsx`:

```tsx
import { ProofReport } from "@/components/proof-report"

export default function ReportPage({ params }: { params: { id: string } }) {
  return <ProofReport jobId={params.id} />
}
```

**Action:** Save both files.

---

### Task 5.3: Final Polish - Empty States (20 minutes)

**File:** `components/clients-list.tsx`

**Find where clients are rendered. Add this before the list:**

```tsx
{clients.length === 0 && (
  <div className="text-center py-12">
    <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-semibold">No sites yet</h3>
    <p className="text-muted-foreground mb-4">
      Add your first site to start creating job sessions
    </p>
    <Button>Add Site</Button>
  </div>
)}
```

**Repeat for:**
- `components/flows-list.tsx` (empty templates)
- `app/(dashboard)/dashboard/page.tsx` (no active jobs)

**Action:** Save all files.

---

### Task 5.4: Deploy to Production (15 minutes)

**Action:**
1. Commit all changes to Git:
   ```bash
   git add .
   git commit -m "JobProof MVP - Day 5 complete"
   git push origin main
   ```

2. Verify deployment in Vercel dashboard
3. Test production URL: `https://getboardingpass.app`
4. **Verify:**
   - Navigation shows "Sites" and "Job Templates"
   - Can create a job session
   - Email is sent to technician
   - Technician can complete job via mobile link
   - Proof report displays correctly

---

## ✅ SUCCESS CHECKLIST

By Friday, you should be able to:

- [ ] Login to admin dashboard
- [ ] See "Sites" and "Job Templates" in navigation
- [ ] Create a new job template (or use existing)
- [ ] Add a site/customer
- [ ] Click "Create Job" on a site
- [ ] Fill in template, due date, technician email
- [ ] Receive job link via email
- [ ] Open link on mobile (no login required)
- [ ] Complete steps with photo upload
- [ ] Mark job as complete
- [ ] View proof-of-work report from dashboard
- [ ] Print/share report

---

## 🚨 TROUBLESHOOTING

### "Module not found" errors
**Fix:** Run `npm install` to ensure all dependencies are installed.

### Email not sending
**Fix:** Check Vercel environment variables for `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

### Photos not uploading
**Fix:** Verify Supabase storage bucket `client-uploads` exists and has public read policy.

### Job link returns 404
**Fix:** Verify `NEXT_PUBLIC_SITE_URL` environment variable is set correctly.

### Can't see other workspace data
**Fix:** This is expected due to RLS. Each user can only see their own workspace data.

---

## 📊 NEXT STEPS (After Friday)

Once your MVP is deployed and working:

1. **Invite 2 pilot companies** (offer free trial for feedback)
2. **Track metrics:**
   - Jobs created per week
   - Completion rate
   - Time from assignment to completion
   - Photos uploaded per job
3. **Collect feedback:**
   - What features are missing?
   - Any friction in the mobile experience?
   - Would they pay for this?
4. **Iterate based on usage:**
   - Add most-requested features
   - Improve mobile UI based on field testing
   - Build pricing plans based on pilot company size

---

## 💡 OPTIONAL ENHANCEMENTS (Week 2+)

- **SMS notifications** (integrate Twilio)
- **Bulk job assignment** (CSV import)
- **Custom branding** (logo, colors per workspace)
- **Mobile app** (React Native wrapper)
- **Offline mode** (IndexedDB sync)
- **API access** (for CRM integrations)

---

**You're ready to go! Start with Day 1 and work through each task in order. Take breaks, test frequently, and reach out if you get stuck on any step.**
