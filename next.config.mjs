import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withSentryConfig(nextConfig, {
  // Sentry options
  org: "syneticx",
  project: "boardingpass-project",
  
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  
  // Upload source maps during production build
  widenClientFileUpload: true,
  
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  tunnelRoute: "/monitoring",
})
