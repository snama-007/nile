import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Nile/)
  })

  test('should display main heading', async ({ page }) => {
    await page.goto('/')
    const heading = page.getByRole('heading', { name: /nile/i })
    await expect(heading).toBeVisible()
  })

  test('should display tagline', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/real-time service updates/i)).toBeVisible()
  })

  test('should have dashboard link', async ({ page }) => {
    await page.goto('/')
    const dashboardLink = page.getByRole('link', { name: /vendor dashboard/i })
    await expect(dashboardLink).toBeVisible()
    await expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  test('should display handle example', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/@yourhandle/i)).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /nile/i })).toBeVisible()
  })

  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /vendor dashboard/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})

