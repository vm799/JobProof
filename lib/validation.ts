// Input validation and sanitization utilities

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeFileName(fileName: string): string {
  // Remove any path traversal attempts and dangerous characters
  return fileName
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 255)
}

export function validateFileType(fileName: string, allowedTypes: string[]): boolean {
  const extension = fileName.toLowerCase().split(".").pop()
  return extension ? allowedTypes.includes(`.${extension}`) : false
}

export function validateFileSize(sizeBytes: number, maxSizeMB: number): boolean {
  return sizeBytes <= maxSizeMB * 1024 * 1024
}

export function sanitizeInput(input: string, maxLength = 1000): string {
  return input.trim().slice(0, maxLength)
}

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}
