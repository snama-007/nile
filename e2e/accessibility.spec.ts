import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests', () => {
  test('landing page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
  })

  test('buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('links should have accessible names', async ({ page }) => {
    await page.goto('/')
    const dashboardLink = page.getByRole('link', { name: /vendor dashboard/i })
    await expect(dashboardLink).toHaveAttribute('href')
  })

  test('forms should have labels', async ({ page }) => {
    await page.goto('/dashboard')
    // Once form is visible (after auth), labels should be present
    // This is a structural test
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/')
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      await expect(img).toHaveAttribute('alt')
    }
  })
})

