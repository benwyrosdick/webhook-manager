import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border')
  })

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter text here" />)
    
    const input = screen.getByPlaceholderText('Enter text here')
    expect(input).toBeInTheDocument()
  })

  it('should handle value and onChange', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input value="" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    
    expect(handleChange).toHaveBeenCalledTimes(4) // Once for each character
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should not accept input when disabled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input disabled onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    
    expect(handleChange).not.toHaveBeenCalled()
    expect(input).toHaveValue('')
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="password" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')

    rerender(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    
    render(<Input ref={ref} />)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })

  it('should spread additional props', () => {
    render(<Input data-testid="custom-input" aria-label="Custom input" maxLength={10} />)
    
    const input = screen.getByTestId('custom-input')
    expect(input).toHaveAttribute('aria-label', 'Custom input')
    expect(input).toHaveAttribute('maxLength', '10')
  })

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should show focus styles', async () => {
    const user = userEvent.setup()
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    await user.click(input)
    
    expect(input).toHaveFocus()
    expect(input).toHaveClass('focus-visible:ring-2')
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn()
    render(<Input onKeyDown={handleKeyDown} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyDown(input, { key: 'Escape' })
    
    expect(handleKeyDown).toHaveBeenCalledTimes(2)
  })

  it('should display initial value', () => {
    render(<Input defaultValue="Initial value" />)
    
    const input = screen.getByDisplayValue('Initial value')
    expect(input).toBeInTheDocument()
  })

  it('should be read-only when readOnly prop is true', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input readOnly value="readonly" onChange={handleChange} />)
    
    const input = screen.getByDisplayValue('readonly')
    expect(input).toHaveAttribute('readonly')
    
    await user.type(input, 'test')
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('should handle required attribute', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('should handle min and max for number inputs', () => {
    render(<Input type="number" min={0} max={100} />)
    
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('should handle autoComplete attribute', () => {
    render(<Input autoComplete="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autoComplete', 'email')
  })

  it('should handle controlled component pattern', async () => {
    const user = userEvent.setup()
    let value = 'initial'
    const setValue = vi.fn((newValue) => {
      value = newValue
    })
    
    const ControlledInput = () => (
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
    )
    
    const { rerender } = render(<ControlledInput />)
    
    const input = screen.getByDisplayValue('initial')
    await user.clear(input)
    await user.type(input, 'new value')
    
    expect(setValue).toHaveBeenCalled()
  })

  it('should have proper styling classes', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass(
      'flex',
      'h-10',
      'w-full',
      'rounded-md',
      'border'
    )
  })
})