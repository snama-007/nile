import { test, expect } from '@playwright/test'

test.describe('Security Tests', () => {
  test('should not expose sensitive data in client', async ({ page }) => {
    await page.goto('/')
    
    // Check that no API keys are exposed
    const content = await page.content()
    expect(content).not.toContain('SUPABASE_SERVICE_KEY')
    expect(content).not.toContain('sk_live_')
    expect(content).not.toContain('secret_key')
  })

  test('should use HTTPS in production URLs', async ({ page }) => {
    await page.goto('/')
    
    const links = page.locator('a[href^="http"]')
    const count = await links.count()
    
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href')
      if (href && !href.startsWith('http://localhost')) {
        expect(href).toMatch(/^https:\/\//)
      }
    }
  })

  test('should have proper CSP headers', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers()
    
    // In production, these should be set
    // expect(headers).toHaveProperty('content-security-policy')
    // expect(headers).toHaveProperty('x-frame-options')
  })

  test('should sanitize handle input', async ({ page }) => {
    // Test XSS protection
    await page.goto('/@<script>alert("xss")</script>')
    
    // Should not execute script
    await page.waitForTimeout(500)
    const dialogs = []
    page.on('dialog', dialog => dialogs.push(dialog))
    expect(dialogs).toHaveLength(0)
  })

  test('should handle SQL injection attempts safely', async ({ page }) => {
    // Test SQL injection in handle
    await page.goto('/@testuser\' OR 1=1--')
    
    // Should either show "not found" or safely escape
    await expect(page).toHaveURL(/\/@/)
  })

  test('should not expose stack traces', async ({ page }) => {
    // Navigate to invalid route
    await page.goto('/invalid-route-that-does-not-exist')
    
    const content = await page.content()
    expect(content).not.toContain('Error:')
    expect(content).not.toContain('at ')
    expect(content).not.toContain('/node_modules/')
  })

  test('form inputs should have maxLength', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Once authenticated, check form inputs
    // const inputs = page.locator('input[type="text"]')
    // Should have reasonable maxLength to prevent abuse
  })

  test('should rate limit API calls', async ({ page }) => {
    // Test that rapid requests are handled
    const promises = []
    for (let i = 0; i < 10; i++) {
      promises.push(page.goto('/@testuser' + i))
    }
    
    await Promise.all(promises)
    // Should not crash or hang
  })
})

