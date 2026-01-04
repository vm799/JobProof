"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { UploadIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { updateWorkspaceSettings, uploadWorkspaceLogo } from "@/app/actions/workspace"
import { ExportDataModal } from "@/components/export-data-modal"
import { DeleteAccountModal } from "@/components/delete-account-modal"

interface SettingsContentProps {
  workspace: any
}

export function SettingsContent({ workspace: initialWorkspace }: SettingsContentProps) {
  const [workspace, setWorkspace] = useState(initialWorkspace)
  const [brandColor, setBrandColor] = useState(initialWorkspace.brand_color || "#000000")
  const [removeBranding, setRemoveBranding] = useState(initialWorkspace.remove_branding || false)
  const [logoPreview, setLogoPreview] = useState<string | null>(initialWorkspace.logo_url)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let logoUrl = workspace.logo_url

      if (logoFile) {
        const formData = new FormData()
        formData.append("logo", logoFile)
        const result = await uploadWorkspaceLogo(workspace.id, formData)
        logoUrl = result.logoUrl
      }

      await updateWorkspaceSettings(workspace.id, {
        name: workspace.name,
        logoUrl,
        brandColor,
        removeBranding,
      })

      toast({
        title: "Settings saved",
        description: "Your workspace settings have been updated successfully.",
      })

      router.refresh()
    } catch (err: any) {
      console.error("[v0] Save error:", err)
      toast({
        title: "Error saving settings",
        description: err.message || "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your workspace and preferences</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Organization Details</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={workspace.name}
              onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">White-Label Branding</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Agency Logo</Label>
              <div className="flex items-center gap-3">
                <div className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                  {logoPreview ? (
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo preview"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  ) : (
                    <UploadIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
                  <p className="text-xs text-muted-foreground mt-1">PNG or SVG, max 2MB</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-color">Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="brand-color"
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-10 w-20"
                />
                <Input value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="flex-1" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label>Remove BoardingPass Branding</Label>
                <p className="text-sm text-muted-foreground">Hide "Powered by BoardingPass" footer</p>
              </div>
              <Switch checked={removeBranding} onCheckedChange={setRemoveBranding} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client Portal Preview</Label>
            <Card className="border-2 p-6 bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {logoPreview ? (
                    <img src={logoPreview || "/placeholder.svg"} alt="Logo" className="h-10 w-10 object-contain" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {workspace.name?.substring(0, 2).toUpperCase() || "BP"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">Welcome to Onboarding</h3>
                    <p className="text-xs text-muted-foreground">Complete your setup</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: "40%", backgroundColor: brandColor }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="h-8 rounded border bg-background" />
                  <div className="h-8 rounded border bg-background" />
                </div>
                <Button className="w-full" style={{ backgroundColor: brandColor }}>
                  Continue
                </Button>
                {!removeBranding && (
                  <p className="text-xs text-center text-muted-foreground">Powered by BoardingPass</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email updates about client progress</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Client Completion Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when clients complete onboarding</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly summary of onboarding activity</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export Your Data</Label>
              <p className="text-sm text-muted-foreground">
                Download all your data in CSV or JSON format for backup or migration
              </p>
            </div>
            <ExportDataModal />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-destructive/50">
        <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently delete your workspace and all associated data</p>
            </div>
            <DeleteAccountModal workspaceId={workspace.id} />
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={() => router.refresh()} className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
