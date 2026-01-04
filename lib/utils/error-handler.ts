export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleApiError(error: any) {
  console.error("[v0] API Error:", error)

  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error.code === "PGRST116") {
    return {
      error: "Resource not found",
      code: "NOT_FOUND",
      statusCode: 404,
    }
  }

  if (error.code === "23505") {
    return {
      error: "This record already exists",
      code: "DUPLICATE",
      statusCode: 409,
    }
  }

  return {
    error: "An unexpected error occurred",
    code: "INTERNAL_ERROR",
    statusCode: 500,
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return "An unexpected error occurred"
}
