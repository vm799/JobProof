"use client"

import type React from "react"

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
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle } from "lucide-react"
import { deleteOnboarding } from "@/app/actions/clients"
import { toast } from "@/hooks/use-toast"

interface DeleteClientModalProps {
  onboardingId: string
  clientName: string
  trigger: React.ReactNode
}

export function DeleteClientModal({ onboardingId, clientName, trigger }: DeleteClientModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteOnboarding(onboardingId)

      toast({
        title: "Client deleted",
        description: `${clientName}'s onboarding has been permanently deleted.`,
      })

      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete client. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Client</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete <strong>{clientName}</strong>? This will permanently delete their onboarding
            progress and uploaded files.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting} className="bg-transparent">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
