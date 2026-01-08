"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"

interface PhotoCaptureModalProps {
  job: any
  workspaceId: string
  onClose: () => void
  onSuccess: () => void
}

export function PhotoCaptureModal({ job, workspaceId, onClose, onSuccess }: PhotoCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(true)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("Camera error:", error)
    }
  }

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        setCameraActive(false)
      }
    }
  }

  async function uploadPhoto() {
    if (!capturedImage) return

    setUploading(true)
    try {
      const blob = await fetch(capturedImage).then((r) => r.blob())
      const formData = new FormData()
      formData.append("file", blob, `proof-${Date.now()}.jpg`)
      formData.append("jobId", job.id)
      formData.append("workspaceId", workspaceId)

      const res = await fetch("/api/upload/proof", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Capture Proof Photo</DialogTitle>
          <DialogDescription>Take a photo for {job.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video bg-black rounded-lg"
                onLoadedMetadata={startCamera}
              />
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </>
          ) : (
            <>
              {capturedImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full rounded-lg" />
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setCapturedImage(null)
                    setCameraActive(true)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Retake
                </Button>
                <Button onClick={uploadPhoto} disabled={uploading} className="flex-1">
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  setCapturedImage(event.target?.result as string)
                  setCameraActive(false)
                }
                reader.readAsDataURL(file)
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
