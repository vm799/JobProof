export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

export const onRequestError = async (err: Error, request: Request) => {
  const { captureException } = await import("@sentry/nextjs")
  captureException(err, {
    tags: {
      url: request.url,
      method: request.method,
    },
  })
}
