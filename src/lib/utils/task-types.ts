export type TaskType = 'info' | 'action' | 'payment' | 'reminder' | 'approval' | 'handoff' | 'confirm' | 'warning' | 'complete'

export const taskTypeConfig: Record<TaskType, { label: string; icon: string; color: string }> = {
  info: {
    label: 'Info',
    icon: 'ℹ️',
    color: 'info',
  },
  action: {
    label: 'Action Required',
    icon: '⚡',
    color: 'warning',
  },
  payment: {
    label: 'Payment',
    icon: '💳',
    color: 'orange',
  },
  reminder: {
    label: 'Reminder',
    icon: '🔔',
    color: 'default',
  },
  approval: {
    label: 'Approval',
    icon: '✓',
    color: 'info',
  },
  handoff: {
    label: 'Handoff',
    icon: '🤝',
    color: 'default',
  },
  confirm: {
    label: 'Confirm',
    icon: '✅',
    color: 'success',
  },
  warning: {
    label: 'Warning',
    icon: '⚠️',
    color: 'error',
  },
  complete: {
    label: 'Complete',
    icon: '🎉',
    color: 'success',
  },
}

export const taskTypeOptions = Object.entries(taskTypeConfig).map(([value, config]) => ({
  value,
  label: `${config.icon} ${config.label}`,
}))

