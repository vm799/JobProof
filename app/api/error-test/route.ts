import { NextResponse } from "next/server"
import { AppError, handleError } from "@/lib/monitoring/error-handler"

export async function GET() {
  try {
    // Simulate error for testing
    throw new AppError("Test error", 400, "TEST_ERROR")
  } catch (error) {
    const handled = handleError(error, {
      endpoint: "/api/error-test",
      method: "GET",
    })

    return NextResponse.json({ error: handled.error }, { status: handled.statusCode })
  }
}
