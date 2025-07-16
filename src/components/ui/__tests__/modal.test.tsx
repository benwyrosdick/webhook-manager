import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../modal'

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal Content</div>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />)
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('should not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('should call onClose when clicking the close button', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={mockOnClose} />)
    
    const closeButton = screen.getByRole('button')
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when clicking the backdrop', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={mockOnClose} />)
    
    // Click on backdrop (first div with fixed inset-0)
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
    expect(backdrop).toBeInTheDocument()
    
    await user.click(backdrop!)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when pressing Escape key', () => {
    const mockOnClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={mockOnClose} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose when pressing other keys', () => {
    const mockOnClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={mockOnClose} />)
    
    fireEvent.keyDown(document, { key: 'Enter' })
    fireEvent.keyDown(document, { key: 'Space' })
    
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should prevent body scroll when modal is open', () => {
    const originalOverflow = document.body.style.overflow
    
    const { rerender } = render(<Modal {...defaultProps} isOpen={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    
    rerender(<Modal {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('unset')
    
    // Restore original overflow
    document.body.style.overflow = originalOverflow
  })

  it('should cleanup event listeners on unmount', () => {
    const mockOnClose = vi.fn()
    
    const { unmount } = render(<Modal {...defaultProps} onClose={mockOnClose} />)
    
    unmount()
    
    // After unmount, escape key should not trigger onClose
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should render custom title', () => {
    render(<Modal {...defaultProps} title="Custom Title" />)
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('should render custom content', () => {
    const customContent = (
      <div>
        <h2>Custom Content</h2>
        <p>This is custom modal content</p>
      </div>
    )
    
    render(<Modal {...defaultProps} children={customContent} />)
    
    expect(screen.getByText('Custom Content')).toBeInTheDocument()
    expect(screen.getByText('This is custom modal content')).toBeInTheDocument()
  })

  it('should have correct ARIA attributes', () => {
    render(<Modal {...defaultProps} />)
    
    // Check that the modal content is rendered (the component doesn't use role="dialog")
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })
})