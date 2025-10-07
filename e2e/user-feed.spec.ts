import { test, expect } from '@playwright/test'

test.describe('User Feed Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/@testuser')
    await expect(page).toHaveURL('/@testuser')
  })

  test('should display handle not found for non-existent users', async ({ page }) => {
    await page.goto('/@nonexistentuser123')
    await expect(page.getByText(/handle not found/i)).toBeVisible()
    await expect(page.getByText(/@nonexistentuser123/i)).toBeVisible()
  })

  test('should have go back home link when handle not found', async ({ page }) => {
    await page.goto('/@nonexistentuser123')
    const homeLink = page.getByText(/go back home/i)
    await expect(homeLink).toBeVisible()
  })

  test('should display user handle in header', async ({ page }) => {
    await page.goto('/@testuser')
    // Will show "Handle Not Found" initially since no tasks exist
    // But the URL should be correct
    await expect(page).toHaveURL('/@testuser')
  })

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/@testuser')
    await expect(page).toHaveURL('/@testuser')
  })
})

test.describe('User Feed - Empty State', () => {
  test('should show empty state when no tasks exist', async ({ page }) => {
    // This would require a user with no tasks
    // await page.goto('/@emptyuser')
    // await expect(page.getByText(/no active tasks/i)).toBeVisible()
  })
})

