import { formatRelativeTime, formatDateTime, formatTime } from '../date'

describe('Date Utilities', () => {
  describe('formatRelativeTime', () => {
    it('formats recent dates correctly', () => {
      const now = new Date()
      const result = formatRelativeTime(now.toISOString())
      // Could be "less than a minute ago" or "X seconds ago"
      expect(result).toMatch(/less than a minute ago|second|ago/)
    })

    it('handles past dates', () => {
      const pastDate = new Date()
      pastDate.setHours(pastDate.getHours() - 2)
      const result = formatRelativeTime(pastDate.toISOString())
      expect(result).toContain('hour')
      expect(result).toContain('ago')
    })

    it('handles Date objects', () => {
      const date = new Date()
      const result = formatRelativeTime(date)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('formatDateTime', () => {
    it('formats date with time', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('Jan')
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })

    it('handles ISO string input', () => {
      const isoString = '2024-01-15T14:30:00.000Z'
      const result = formatDateTime(isoString)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatTime(date)
      expect(result).toMatch(/\d{1,2}:\d{2}\s[AP]M/i)
    })

    it('handles ISO string input', () => {
      const isoString = '2024-01-15T09:15:00.000Z'
      const result = formatTime(isoString)
      expect(typeof result).toBe('string')
      expect(result).toMatch(/\d{1,2}:\d{2}\s[AP]M/i)
    })
  })
})

