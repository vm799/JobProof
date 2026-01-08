"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info" | "warning"
}

const ToastContext = createContext<{
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => removeToast(id), 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Card
            key={toast.id}
            className={`w-96 border-l-4 ${
              toast.type === "success"
                ? "border-l-green-600 bg-green-50"
                : toast.type === "error"
                  ? "border-l-red-600 bg-red-50"
                  : toast.type === "warning"
                    ? "border-l-yellow-600 bg-yellow-50"
                    : "border-l-blue-600 bg-blue-50"
            }`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{toast.title}</p>
                  {toast.description && <p className="text-sm text-gray-600 mt-1">{toast.description}</p>}
                </div>
                <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
