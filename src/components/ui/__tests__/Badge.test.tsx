import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge Component', () => {
  it('renders with children', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('renders default variant', () => {
    render(<Badge variant="default">Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge).toHaveClass('bg-navy-100', 'text-navy-800')
  })

  it('renders info variant', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('renders success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('renders warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const badge = screen.getByText('Warning')
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('renders error variant', () => {
    render(<Badge variant="error">Error</Badge>)
    const badge = screen.getByText('Error')
    expect(badge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('renders orange variant', () => {
    render(<Badge variant="orange">Orange</Badge>)
    const badge = screen.getByText('Orange')
    expect(badge).toHaveClass('bg-brand-orange/10', 'text-brand-orange')
  })

  it('renders with icon', () => {
    render(<Badge icon="🔔">Notification</Badge>)
    expect(screen.getByText('🔔')).toBeInTheDocument()
  })

  it('applies small size', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toHaveClass('px-2', 'py-1', 'text-xs')
  })

  it('applies medium size by default', () => {
    render(<Badge>Medium</Badge>)
    expect(screen.getByText('Medium')).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })
})

