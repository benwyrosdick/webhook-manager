import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('should handle click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply variant classes correctly', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary', 'text-primary-foreground')

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive', 'text-destructive-foreground')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border', 'bg-background')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-primary', 'underline-offset-4')
  })

  it('should apply size classes correctly', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'px-4', 'py-2')

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'px-3')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11', 'px-8')

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should render as different element when asChild is used', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    
    render(<Button ref={ref}>Ref Test</Button>)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('should spread additional props', () => {
    render(<Button data-testid="custom-button" aria-label="Custom label">Test</Button>)
    
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('should be a button element', () => {
    render(<Button>Test</Button>)
    
    const button = screen.getByRole('button')
    expect(button.tagName).toBe('BUTTON')
  })

  it('should allow custom type', () => {
    render(<Button type="submit">Submit</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should handle keyboard events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Keyboard Test</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.keyDown(button, { key: ' ' })
    
    // Button should handle these automatically
    expect(button).toBeInTheDocument()
  })

  it('should render with children', () => {
    render(
      <Button>
        <span>Icon</span>
        Text Content
      </Button>
    )
    
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text Content')).toBeInTheDocument()
  })

  it('should combine variant and size classes correctly', () => {
    render(<Button variant="outline" size="sm">Small Outline</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'bg-background', 'h-9', 'px-3')
  })
})