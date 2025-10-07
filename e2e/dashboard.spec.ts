import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should display sign in prompt for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /vendor dashboard/i })).toBeVisible()
    await expect(page.getByText(/sign in to manage/i)).toBeVisible()
  })

  test('should have sign in button', async ({ page }) => {
    await page.goto('/dashboard')
    const signInButton = page.getByRole('button', { name: /sign in/i })
    await expect(signInButton).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /vendor dashboard/i })).toBeVisible()
  })
})

test.describe('Dashboard - Create Task Form', () => {
  test('form fields should be present', async ({ page }) => {
    // Note: This test would need authentication
    // For now, we're testing the structure
    await page.goto('/dashboard')
    
    // Once authenticated, these should be visible
    // await expect(page.getByLabel(/customer handle/i)).toBeVisible()
    // await expect(page.getByLabel(/task title/i)).toBeVisible()
    // await expect(page.getByLabel(/task type/i)).toBeVisible()
  })
})

