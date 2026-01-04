import { captureException } from "./sentry"

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown, context?: Record<string, any>) {
  if (error instanceof AppError) {
    captureException(error, context)
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    captureException(error, context)
    return {
      error: "An unexpected error occurred",
      statusCode: 500,
    }
  }

  captureException(new Error(String(error)), context)
  return {
    error: "An unknown error occurred",
    statusCode: 500,
  }
}

export function withErrorHandler<T>(fn: () => Promise<T>, context?: Record<string, any>): Promise<T> {
  return fn().catch((error) => {
    const handled = handleError(error, context)
    throw new AppError(handled.error, handled.statusCode)
  })
}
