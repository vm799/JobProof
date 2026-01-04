"use client"

import { Card } from "@/components/ui/card"
import { Play, Volume2 } from "lucide-react"
import { useState } from "react"

interface WelcomeVideoProps {
  videoUrl?: string
  message?: string
  authorName: string
  authorRole: string
}

export function WelcomeVideo({ videoUrl, message, authorName, authorRole }: WelcomeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!videoUrl && !message) return null

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          {videoUrl ? <Play className="h-6 w-6 text-primary" /> : <Volume2 className="h-6 w-6 text-primary" />}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">A personal message from {authorName}</h3>
              <p className="text-sm text-muted-foreground">{authorRole}</p>
            </div>
          </div>

          {videoUrl ? (
            <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video">
              <video
                src={videoUrl}
                controls
                className="w-full h-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          ) : (
            <div className="mt-4 p-4 bg-card rounded-lg border border-border">
              <p className="text-sm leading-relaxed text-foreground/80 italic">"{message}"</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-3 italic">
            We believe in the human touch. This message was recorded just for you.
          </p>
        </div>
      </div>
    </Card>
  )
}
