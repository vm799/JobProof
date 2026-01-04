import { test, expect } from "@playwright/test"

test.describe("Client Onboarding Flow", () => {
  test("complete onboarding flow end-to-end", async ({ page }) => {
    // Test the full client onboarding journey
    await page.goto("/demo")

    // Start the demo
    await expect(page.getByText("Interactive Demo")).toBeVisible()

    // Check progress tracker is visible
    await expect(page.getByText("Welcome")).toBeVisible()

    // Fill in the contact information step
    await page.getByLabel("Full Name").fill("John Doe")
    await page.getByLabel("Email Address").fill("john@example.com")
    await page.getByLabel("Company Name").fill("Acme Corp")

    // Click next
    await page.getByRole("button", { name: "Next Step" }).click()

    // Verify we're on step 2
    await expect(page.getByText("Company Information")).toBeVisible()

    // Fill in company info
    await page.getByLabel("Industry").fill("Technology")
    await page.getByLabel("Company Size").selectOption("11-50")

    await page.getByRole("button", { name: "Next Step" }).click()

    // Check for milestone celebration at 50%
    await expect(page.getByText("Halfway There!")).toBeVisible({ timeout: 3000 })

    // Complete the flow
    await page.getByRole("button", { name: "Continue" }).click()

    // Fill final step
    await page.getByLabel("Project Description").fill("Building a new product")

    await page.getByRole("button", { name: "Complete Onboarding" }).click()

    // Verify completion
    await expect(page.getByText("Onboarding Complete!")).toBeVisible({ timeout: 5000 })
  })

  test("navigate back and forth between steps", async ({ page }) => {
    await page.goto("/demo")

    // Go to step 2
    await page.getByLabel("Full Name").fill("Test User")
    await page.getByRole("button", { name: "Next Step" }).click()

    // Go back to step 1
    await page.getByRole("button", { name: "Back" }).click()

    // Verify data persists
    await expect(page.getByLabel("Full Name")).toHaveValue("Test User")
  })
})

test.describe("Authentication", () => {
  test("login flow", async ({ page }) => {
    await page.goto("/auth/login")

    await page.getByLabel("Email").fill("test@example.com")
    await page.getByLabel("Password").fill("password123")

    await page.getByRole("button", { name: "Sign in" }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard")
  })

  test("password reset flow", async ({ page }) => {
    await page.goto("/auth/forgot-password")

    await page.getByLabel("Email").fill("test@example.com")
    await page.getByRole("button", { name: "Send Reset Link" }).click()

    await expect(page.getByText("Check your email")).toBeVisible()
  })
})
