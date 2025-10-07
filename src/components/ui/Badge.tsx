import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'orange'
  size?: 'sm' | 'md'
  icon?: string
}

export function Badge({ children, variant = 'default', size = 'md', icon }: BadgeProps) {
  const variants = {
    default: 'bg-navy-100 text-navy-800',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    orange: 'bg-brand-orange/10 text-brand-orange',
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-lg ${variants[variant]} ${sizes[size]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}

