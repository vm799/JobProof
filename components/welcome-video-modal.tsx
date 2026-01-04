"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface WelcomeVideoModalProps {
  videoUrl: string
  workspaceName: string
  userId: string
}

export function WelcomeVideoModal({ videoUrl, workspaceName, userId }: WelcomeVideoModalProps) {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Extract video ID and determine type
  const getEmbedUrl = (url: string) => {
    // Loom: https://www.loom.com/share/ABC123
    if (url.includes("loom.com")) {
      const videoId = url.split("/").pop()
      return `https://www.loom.com/embed/${videoId}`
    }
    // YouTube: https://www.youtube.com/watch?v=ABC123 or https://youtu.be/ABC123
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be") ? url.split("/").pop() : new URL(url).searchParams.get("v")
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  const handleClose = async () => {
    // Mark video as seen in database
    await supabase.from("profiles").update({ has_seen_welcome_video: true }).eq("id", userId)

    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to {workspaceName}</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={handleClose}>Got it, let's start</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
