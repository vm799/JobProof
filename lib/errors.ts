export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export const ErrorMessages = {
  UNAUTHORIZED: "You don't have permission to perform this action",
  NOT_FOUND: "The requested resource was not found",
  BILLING_LIMIT_EXCEEDED: "You've reached your plan limit. Upgrade to continue.",
  INVALID_INPUT: "Please check your input and try again",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  NETWORK_ERROR: "Network connection failed. Please check your internet.",
} as const

export function getErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return ErrorMessages[error.code as keyof typeof ErrorMessages] || error.message
  }
  if (error?.message) {
    return error.message
  }
  return ErrorMessages.SERVER_ERROR
}

export function handleApiError(error: any) {
  console.error("[API Error]", error)

  if (error.status === 401) {
    return new AppError("UNAUTHORIZED", 401, ErrorMessages.UNAUTHORIZED)
  }
  if (error.status === 404) {
    return new AppError("NOT_FOUND", 404, ErrorMessages.NOT_FOUND)
  }
  if (error.status === 429) {
    return new AppError("RATE_LIMITED", 429, "Too many requests. Please try again later.")
  }
  if (error.code === "BILLING_LIMIT_EXCEEDED") {
    return new AppError("BILLING_LIMIT_EXCEEDED", 402, ErrorMessages.BILLING_LIMIT_EXCEEDED)
  }

  return new AppError("SERVER_ERROR", 500, ErrorMessages.SERVER_ERROR, error)
}
