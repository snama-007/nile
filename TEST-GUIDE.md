# 🧪 Testing Guide - Project Nile

## 📋 Test Suite Overview

This project includes comprehensive testing covering:
- ✅ **Unit Tests** - Component and utility testing
- ✅ **Integration Tests** - Feature interactions
- ✅ **E2E Tests** - Full user flows
- ✅ **Accessibility Tests** - WCAG compliance
- ✅ **Responsive Tests** - Mobile/tablet/desktop

---

## 🚀 Quick Start

### Install Test Dependencies
```bash
npm install
```

### Run All Tests
```bash
# Run unit tests (watch mode)
npm test

# Run unit tests (CI mode)
npm run test:ci

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run everything
npm run test:all
```

---

## 📊 Test Structure

```
nile/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── __tests__/
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Input.test.tsx
│   │   │   │   └── Badge.test.tsx
│   │   │   └── ...
│   │   └── features/
│   │       └── __tests__/
│   │           └── ... (to be added)
│   └── lib/
│       └── utils/
│           └── __tests__/
│               ├── task-types.test.ts
│               └── date.test.ts
└── e2e/
    ├── landing.spec.ts
    ├── dashboard.spec.ts
    ├── user-feed.spec.ts
    ├── accessibility.spec.ts
    └── responsive.spec.ts
```

---

## 🧩 Unit Tests

### Component Tests

**Button Component** (`Button.test.tsx`)
- ✅ Renders with children
- ✅ Handles click events
- ✅ Supports 4 variants (primary, secondary, outline, ghost)
- ✅ Supports 3 sizes (sm, md, lg)
- ✅ Disabled state
- ✅ Custom className

**Input Component** (`Input.test.tsx`)
- ✅ Renders input field
- ✅ Label support
- ✅ Error message display
- ✅ Error styling
- ✅ onChange handler
- ✅ Required attribute
- ✅ Different input types

**Badge Component** (`Badge.test.tsx`)
- ✅ Renders with children
- ✅ 6 color variants
- ✅ Icon support
- ✅ 2 size variants

### Utility Tests

**Task Types** (`task-types.test.ts`)
- ✅ Contains all 9 task types
- ✅ Each type has label, icon, color
- ✅ taskTypeOptions array format
- ✅ Labels include icons

**Date Utils** (`date.test.ts`)
- ✅ formatRelativeTime
- ✅ formatDateTime
- ✅ formatTime
- ✅ Handles Date objects and ISO strings

---

## 🌐 E2E Tests

### Landing Page (`landing.spec.ts`)
- ✅ Page loads successfully
- ✅ Main heading visible
- ✅ Tagline display
- ✅ Dashboard link present
- ✅ Handle example shown
- ✅ Mobile responsive
- ✅ Navigation works

### Dashboard (`dashboard.spec.ts`)
- ✅ Page loads
- ✅ Sign in prompt for unauthenticated
- ✅ Sign in button visible
- ✅ Mobile responsive
- ✅ Form structure (when authenticated)

### User Feed (`user-feed.spec.ts`)
- ✅ Page loads with @handle URL
- ✅ Handle not found message
- ✅ Go back home link
- ✅ Handle in header
- ✅ Mobile responsive
- ✅ Empty state

### Accessibility (`accessibility.spec.ts`)
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation
- ✅ Accessible link names
- ✅ Form labels
- ✅ Image alt text

### Responsive (`responsive.spec.ts`)
- ✅ Mobile (375x667)
- ✅ Tablet (768x1024)
- ✅ Desktop (1920x1080)
- ✅ Touch target sizes
- ✅ All pages render correctly

---

## 📈 Coverage Goals

```javascript
coverageThreshold: {
  global: {
    branches: 70%,
    functions: 70%,
    lines: 70%,
    statements: 70%,
  },
}
```

### View Coverage Report
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 🔍 Test Categories

### 1. Smoke Tests
Basic functionality checks:
- Pages load
- Navigation works
- Core features visible

### 2. Functional Tests
Feature-specific tests:
- Form submissions
- Button interactions
- Real-time updates

### 3. Visual Tests
UI/UX validation:
- Responsive layouts
- Mobile-first design
- Touch target sizes

### 4. Security Tests
Guard rails:
- Authentication flows
- RLS policy compliance
- Input validation

### 5. Performance Tests
Speed and efficiency:
- Page load times
- Real-time latency
- Bundle size

---

## 🛡️ Guard Rails & Best Practices

### Test Writing Guidelines

**DO:**
- ✅ Test user behavior, not implementation
- ✅ Use semantic queries (getByRole, getByLabel)
- ✅ Test accessibility
- ✅ Include edge cases
- ✅ Test error states
- ✅ Mock external dependencies

**DON'T:**
- ❌ Test internal state directly
- ❌ Use implementation-specific selectors
- ❌ Write brittle tests
- ❌ Skip error scenarios
- ❌ Ignore accessibility

### Example Test Pattern

```typescript
describe('Component Name', () => {
  it('should describe expected behavior', () => {
    // Arrange
    const props = { ... }
    
    // Act
    render(<Component {...props} />)
    
    // Assert
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

---

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- ✅ Next.js integration
- ✅ TypeScript support
- ✅ Module path mapping (@/)
- ✅ Coverage collection
- ✅ jsdom environment

### Playwright Configuration (`playwright.config.ts`)
- ✅ Multi-browser testing (Chrome, Firefox, Safari)
- ✅ Mobile device emulation
- ✅ Screenshot on failure
- ✅ Video recording
- ✅ Automatic server start

---

## 🐛 Debugging Tests

### Debug Unit Tests
```bash
# Run single test file
npm test Button.test.tsx

# Run with watch mode
npm test -- --watch

# Run specific test
npm test -- -t "renders with children"
```

### Debug E2E Tests
```bash
# Run with UI mode (recommended)
npm run test:e2e:ui

# Run specific test file
npx playwright test landing.spec.ts

# Run in headed mode
npx playwright test --headed

# Debug mode
npx playwright test --debug
```

---

## 📊 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: npm run test:all

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

---

## 🎯 Test Scenarios

### Scenario 1: New Feature Development
1. Write failing test
2. Implement feature
3. Test passes
4. Refactor
5. Run full suite

### Scenario 2: Bug Fix
1. Write test reproducing bug
2. Fix bug
3. Test passes
4. Run regression tests

### Scenario 3: Pre-Deployment
```bash
# Full test suite
npm run test:all

# Check coverage
npm run test:coverage

# E2E smoke tests
npm run test:e2e
```

---

## 📝 Adding New Tests

### Unit Test Template
```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from '../ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })
})
```

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform action', async ({ page }) => {
    await page.goto('/path')
    await expect(page.getByText('...')).toBeVisible()
  })
})
```

---

## 🚨 Common Issues

### Issue: Tests timing out
**Solution**: Increase timeout in playwright.config.ts

### Issue: Flaky tests
**Solution**: Add proper wait conditions, use page.waitForSelector()

### Issue: Module not found
**Solution**: Check tsconfig paths and jest moduleNameMapper

### Issue: Supabase client errors
**Solution**: Mock Supabase in jest.setup.js

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright Docs](https://playwright.dev/)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Coverage meets threshold (70%+)
- [ ] Accessibility tests passing
- [ ] Responsive tests on all viewports
- [ ] No console errors
- [ ] Performance within limits
- [ ] Security tests passing

---

**🧪 Test with confidence. Deploy with certainty.**

