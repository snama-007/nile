import { taskTypeConfig, taskTypeOptions } from '../task-types'

describe('Task Types Utilities', () => {
  describe('taskTypeConfig', () => {
    it('contains all 9 task types', () => {
      const types = Object.keys(taskTypeConfig)
      expect(types).toHaveLength(9)
      expect(types).toContain('info')
      expect(types).toContain('action')
      expect(types).toContain('payment')
      expect(types).toContain('reminder')
      expect(types).toContain('approval')
      expect(types).toContain('handoff')
      expect(types).toContain('confirm')
      expect(types).toContain('warning')
      expect(types).toContain('complete')
    })

    it('each type has label, icon, and color', () => {
      Object.values(taskTypeConfig).forEach((config) => {
        expect(config).toHaveProperty('label')
        expect(config).toHaveProperty('icon')
        expect(config).toHaveProperty('color')
        expect(typeof config.label).toBe('string')
        expect(typeof config.icon).toBe('string')
        expect(typeof config.color).toBe('string')
      })
    })

    it('info type has correct config', () => {
      expect(taskTypeConfig.info).toEqual({
        label: 'Info',
        icon: 'ℹ️',
        color: 'info',
      })
    })

    it('payment type has correct config', () => {
      expect(taskTypeConfig.payment).toEqual({
        label: 'Payment',
        icon: '💳',
        color: 'orange',
      })
    })

    it('complete type has correct config', () => {
      expect(taskTypeConfig.complete).toEqual({
        label: 'Complete',
        icon: '🎉',
        color: 'success',
      })
    })
  })

  describe('taskTypeOptions', () => {
    it('returns an array of options', () => {
      expect(Array.isArray(taskTypeOptions)).toBe(true)
      expect(taskTypeOptions).toHaveLength(9)
    })

    it('each option has value and label', () => {
      taskTypeOptions.forEach((option) => {
        expect(option).toHaveProperty('value')
        expect(option).toHaveProperty('label')
        expect(typeof option.value).toBe('string')
        expect(typeof option.label).toBe('string')
      })
    })

    it('labels include icons', () => {
      const infoOption = taskTypeOptions.find(opt => opt.value === 'info')
      expect(infoOption?.label).toContain('ℹ️')
      expect(infoOption?.label).toContain('Info')
    })
  })
})

