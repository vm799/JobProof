"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import { useState, useRef } from "react"
import { uploadFile, deleteFile } from "@/lib/utils/file-upload"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onboardingId: string
  stepProgressId: string
  workspaceId: string
  existingFiles?: Array<{ id: string; file_name: string; publicUrl: string; file_size?: number }>
  onUploadComplete?: (file: any) => void
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export function FileUpload({
  onboardingId,
  stepProgressId,
  workspaceId,
  existingFiles = [],
  onUploadComplete,
  maxSizeMB = 10,
  acceptedTypes = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"],
}: FileUploadProps) {
  const [files, setFiles] = useState<any[]>(existingFiles)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      toast({
        title: "File too large",
        description: `Please choose a file smaller than ${maxSizeMB}MB`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const uploadedFile = await uploadFile(selectedFile, onboardingId, stepProgressId, workspaceId)

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been uploaded`,
      })

      setFiles([...files, { ...uploadedFile, file_size: selectedFile.size }])
      onUploadComplete?.(uploadedFile)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setTimeout(() => {
        setUploadProgress(0)
      }, 1000)
    } catch (err: any) {
      console.error("[v0] Upload error:", err)
      setError(err.message || "Failed to upload file")
      toast({
        title: "Upload failed",
        description: err.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return

    try {
      await deleteFile(fileId)
      setFiles(files.filter((f) => f.id !== fileId))
      toast({
        title: "File deleted",
        description: `${fileName} has been removed`,
      })
    } catch (err: any) {
      console.error("[v0] Delete error:", err)
      setError(err.message || "Failed to delete file")
      toast({
        title: "Delete failed",
        description: err.message || "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
          accept={acceptedTypes.join(",")}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full gap-2"
        >
          {isUploading ? (
            <>
              <Spinner className="h-4 w-4" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Choose File
            </>
          )}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Accepted formats: {acceptedTypes.join(", ")} (Max {maxSizeMB}MB)
        </p>
      </div>

      {isUploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files</p>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href={file.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-medium hover:underline truncate"
                >
                  {file.file_name}
                </a>
                {file.file_size && <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>}
              </div>
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id, file.file_name)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
