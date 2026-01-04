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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { deleteFlow } from "@/app/actions/flows"
import { toast } from "@/hooks/use-toast"

interface DeleteFlowModalProps {
  flowId: string
  flowName: string
}

export function DeleteFlowModal({ flowId, flowName }: DeleteFlowModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteFlow(flowId)

      toast({
        title: "Flow deleted",
        description: `${flowName} has been permanently deleted.`,
      })

      setIsOpen(false)
      router.push("/flows")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete flow. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive bg-transparent">
          <Trash2 className="h-4 w-4" />
          Delete Flow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Flow</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete <strong>{flowName}</strong>? This action cannot be undone.
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
