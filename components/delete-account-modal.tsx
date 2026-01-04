"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DeleteAccountModalProps {
  workspaceId: string
}

export function DeleteAccountModal({ workspaceId }: DeleteAccountModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm')
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Delete workspace (cascade will handle related records)
      const { error: deleteError } = await supabase.from("workspaces").delete().eq("id", workspaceId)

      if (deleteError) throw deleteError

      // Sign out user
      await supabase.auth.signOut()

      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Delete account error:", err)
      setError(err.message || "Failed to delete account. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Account</DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your workspace and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              All of your data will be permanently deleted:
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>All onboarding flows</li>
                <li>All client data and files</li>
                <li>All team members</li>
                <li>All settings and branding</li>
              </ul>
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirm-delete">Type DELETE to confirm</Label>
            <Input
              id="confirm-delete"
              placeholder="DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting} className="bg-transparent">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || confirmText !== "DELETE"}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Forever
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
