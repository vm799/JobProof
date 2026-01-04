"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, FileText, Loader2 } from "lucide-react"

export function ExportDataModal() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<string | null>(null)

  const handleExport = async (type: "clients" | "flows" | "all") => {
    setIsExporting(true)
    setExportType(type)

    try {
      const response = await fetch(`/api/export/${type === "all" ? "all-data" : type}`)

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download =
        response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") || `export-${type}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Your Data</DialogTitle>
          <DialogDescription>
            Download your BoardingPass data in CSV or JSON format. Perfect for backups or migration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleExport("clients")}
            disabled={isExporting}
          >
            {isExporting && exportType === "clients" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <div className="text-left">
              <div className="font-medium">Export Clients</div>
              <div className="text-sm text-muted-foreground">Download all client data as CSV</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleExport("flows")}
            disabled={isExporting}
          >
            {isExporting && exportType === "flows" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <div className="text-left">
              <div className="font-medium">Export Flows</div>
              <div className="text-sm text-muted-foreground">Download all onboarding flows as CSV</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4 bg-transparent"
            onClick={() => handleExport("all")}
            disabled={isExporting}
          >
            {isExporting && exportType === "all" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <div className="text-left">
              <div className="font-medium">Export Everything</div>
              <div className="text-sm text-muted-foreground">
                Complete workspace backup as JSON (clients, flows, team, settings)
              </div>
            </div>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Your data will be downloaded to your device. No data is sent to external servers.
        </p>
      </DialogContent>
    </Dialog>
  )
}
