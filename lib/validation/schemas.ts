import { z } from "zod"

// Client validation
export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  email: z.string().email("Invalid email address"),
})

// Onboarding step data validation
export const stepDataSchema = z.object({
  text: z.string().max(5000, "Text too long").optional(),
  url: z.string().url("Invalid URL").optional(),
  date: z.string().datetime().optional(),
  files: z.array(z.string()).max(10, "Too many files").optional(),
})

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string().max(255, "Filename too long"),
  type: z.string().regex(/^[a-z]+\/[a-z0-9\-+.]+$/i, "Invalid file type"),
  size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
})

// Flow creation validation
export const flowSchema = z.object({
  name: z.string().min(1, "Flow name is required").max(255, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
})

// Step creation validation
export const stepSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  type: z.enum(["text", "file", "url", "calendar", "approval"]),
  step_order: z.number().int().min(0),
  config: z.record(z.unknown()).optional(),
})
