"use client"

export function DemoModeBanner() {
  return (
    <div className="w-full bg-yellow-50 border-b-2 border-yellow-300 px-4 py-2">
      <p className="text-center text-sm font-semibold text-yellow-900">
        ⚠️ INTERNAL DEMO MODE - Not for external use or data storage
      </p>
    </div>
  )
}
