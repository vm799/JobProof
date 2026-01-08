"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface AsyncSelectProps {
  loadOptions: () => Promise<Array<{ id: string; label: string }>>
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function AsyncSelect({ loadOptions, value, onValueChange, placeholder }: AsyncSelectProps) {
  const [options, setOptions] = useState<Array<{ id: string; label: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await loadOptions()
        setOptions(data)
        setError(null)
      } catch (err) {
        setError("Failed to load options")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [loadOptions])

  if (loading) {
    return <Skeleton className="h-10 w-full" />
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || "Select an option..."} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.id} value={opt.id}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
