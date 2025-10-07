import { test, expect } from '@playwright/test'

test.describe('Error Handling', () => {
  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    
    // Next.js should return 404
    expect(response?.status()).toBe(404)
  })

  test('should show user-friendly error for invalid handle', async ({ page }) => {
    await page.goto('/@invalid_user_123456789')
    
    // Should show friendly message, not technical error
    await expect(page.getByText(/handle not found/i)).toBeVisible()
    expect(page.getByText(/error/i)).not.toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline mode
    await context.setOffline(true)
    
    try {
      await page.goto('/', { timeout: 5000 })
    } catch (e) {
      // Expected to fail
    }
    
    await context.setOffline(false)
    
    // Should recover when back online
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /nile/i })).toBeVisible()
  })

  test('should not crash on rapid navigation', async ({ page }) => {
    // Rapidly navigate between pages
    await page.goto('/')
    await page.goto('/dashboard')
    await page.goto('/@testuser')
    await page.goto('/')
    await page.goto('/dashboard')
    
    // Should still be functional
    await expect(page.getByRole('heading')).toBeVisible()
  })

  test('should handle missing images gracefully', async ({ page }) => {
    await page.goto('/')
    
    // Check if any images fail to load
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const isVisible = await img.isVisible()
      
      if (isVisible) {
        // Image should have loaded or have fallback
        const src = await img.getAttribute('src')
        expect(src).toBeTruthy()
      }
    }
  })

  test('should handle console errors gracefully', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // Should not have critical console errors
    const criticalErrors = errors.filter(err => 
      !err.includes('404') && 
      !err.includes('favicon')
    )
    
    expect(criticalErrors.length).toBe(0)
  })
})

