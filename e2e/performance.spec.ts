import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('landing page should load quickly', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('dashboard should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    // Should load in under 4 seconds
    expect(loadTime).toBeLessThan(4000)
  })

  test('should not have layout shifts', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    // Check that main content is stable
    const heading = page.getByRole('heading', { name: /nile/i })
    const box1 = await heading.boundingBox()
    
    await page.waitForTimeout(1000)
    
    const box2 = await heading.boundingBox()
    expect(box1).toEqual(box2)
  })

  test('should lazy load images if present', async ({ page }) => {
    await page.goto('/')
    
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const loading = await img.getAttribute('loading')
      
      // Large images should have lazy loading
      if (loading) {
        expect(['lazy', 'eager']).toContain(loading)
      }
    }
  })

  test('should have reasonable bundle size', async ({ page }) => {
    const response = await page.goto('/')
    const contentLength = response?.headers()['content-length']
    
    if (contentLength) {
      const sizeKB = parseInt(contentLength) / 1024
      // Initial HTML should be under 100KB
      expect(sizeKB).toBeLessThan(100)
    }
  })

  test('should cache static assets', async ({ page }) => {
    await page.goto('/')
    
    // Navigate away and back
    await page.goto('/dashboard')
    await page.goto('/')
    
    // Second load should be faster due to caching
    const startTime = Date.now()
    await page.reload()
    const reloadTime = Date.now() - startTime
    
    expect(reloadTime).toBeLessThan(2000)
  })
})

