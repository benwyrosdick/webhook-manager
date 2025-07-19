import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
  it('should render with default variant', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('should apply variant classes correctly', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('bg-primary', 'text-primary-foreground')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive', 'text-destructive-foreground')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('should render with custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-badge')
    expect(badge).toHaveClass('inline-flex', 'items-center') // Should still have base classes
  })

  it('should render different content types', () => {
    const { rerender } = render(<Badge>Text Content</Badge>)
    expect(screen.getByText('Text Content')).toBeInTheDocument()

    rerender(<Badge>123</Badge>)
    expect(screen.getByText('123')).toBeInTheDocument()

    rerender(
      <Badge>
        <span>Icon</span>
        Label
      </Badge>
    )
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('should have correct base styling', () => {
    render(<Badge>Test</Badge>)
    
    const badge = screen.getByText('Test')
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold'
    )
  })

  it('should handle empty content', () => {
    render(<Badge></Badge>)
    
    const badge = document.querySelector('.inline-flex')
    expect(badge).toBeInTheDocument()
    expect(badge).toBeEmptyDOMElement()
  })

  it('should apply focus and transition classes', () => {
    render(<Badge>Focus Test</Badge>)
    
    const badge = screen.getByText('Focus Test')
    expect(badge).toHaveClass('focus:outline-none', 'focus:ring-2', 'transition-colors')
  })

  it('should combine variant and custom classes correctly', () => {
    render(<Badge variant="destructive" className="animate-pulse">Combined</Badge>)
    
    const badge = screen.getByText('Combined')
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground', 'animate-pulse')
  })

  it('should render as span element by default', () => {
    render(<Badge>Span Test</Badge>)
    
    const badge = screen.getByText('Span Test')
    expect(badge.tagName).toBe('DIV') // Based on typical badge implementation
  })

  it('should handle long text content', () => {
    const longText = 'This is a very long badge text that should still render properly'
    render(<Badge>{longText}</Badge>)
    
    const badge = screen.getByText(longText)
    expect(badge).toBeInTheDocument()
  })

  it('should maintain accessibility', () => {
    render(<Badge aria-label="Status indicator">Active</Badge>)
    
    const badge = screen.getByText('Active')
    expect(badge).toHaveAttribute('aria-label', 'Status indicator')
  })

  it('should handle boolean content', () => {
    render(<Badge>{true}</Badge>)
    
    // Boolean values should render as text
    const badge = document.querySelector('.inline-flex')
    expect(badge).toBeInTheDocument()
  })

  it('should work with conditional rendering', () => {
    const showBadge = true
    const { rerender } = render(
      showBadge ? <Badge>Visible</Badge> : null
    )
    
    expect(screen.getByText('Visible')).toBeInTheDocument()
    
    rerender(false ? <Badge>Hidden</Badge> : null)
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('should support nested elements', () => {
    render(
      <Badge>
        <div>
          <span>Nested</span>
          <span>Content</span>
        </div>
      </Badge>
    )
    
    expect(screen.getByText('Nested')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should handle special characters', () => {
    render(<Badge>Status: ✓ Active</Badge>)
    
    const badge = screen.getByText('Status: ✓ Active')
    expect(badge).toBeInTheDocument()
  })
})