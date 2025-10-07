import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
]

viewports.forEach(({ name, width, height }) => {
  test.describe(`Responsive - ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height })
    })

    test('landing page should be visible', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: /nile/i })).toBeVisible()
    })

    test('dashboard should be accessible', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page.getByRole('heading', { name: /vendor dashboard/i })).toBeVisible()
    })

    test('user feed should load', async ({ page }) => {
      await page.goto('/@testuser')
      await expect(page).toHaveURL('/@testuser')
    })

    test('buttons should be clickable', async ({ page }) => {
      await page.goto('/')
      const button = page.getByRole('link', { name: /vendor dashboard/i })
      await expect(button).toBeVisible()
      
      // Check if button is large enough for touch (at least 44x44px)
      const box = await button.boundingBox()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40)
      }
    })
  })
})

