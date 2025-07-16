import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock child components
vi.mock('../components/WebhookRequests', () => ({
  default: () => <div data-testid="webhook-requests">Webhook Requests Component</div>
}))

vi.mock('../components/URLMappings', () => ({
  default: () => <div data-testid="url-mappings">URL Mappings Component</div>
}))

describe('App', () => {
  it('should render app title and description', () => {
    render(<App />)
    
    expect(screen.getByText('Webhook Manager')).toBeInTheDocument()
    expect(screen.getByText('Capture, view, and forward webhooks with ease')).toBeInTheDocument()
  })

  it('should render Quick Start section', () => {
    render(<App />)
    
    expect(screen.getByText('Quick Start')).toBeInTheDocument()
    expect(screen.getByText(/Receive webhooks:/)).toBeInTheDocument()
    expect(screen.getByText(/Forward webhooks:/)).toBeInTheDocument()
  })

  it('should render navigation tabs', () => {
    render(<App />)
    
    expect(screen.getByText('Webhook Requests')).toBeInTheDocument()
    expect(screen.getByText('URL Mappings')).toBeInTheDocument()
  })

  it('should show webhook requests by default', () => {
    render(<App />)
    
    expect(screen.getByTestId('webhook-requests')).toBeInTheDocument()
    expect(screen.queryByTestId('url-mappings')).not.toBeInTheDocument()
  })

  it('should switch to URL mappings when tab is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const urlMappingsTab = screen.getByText('URL Mappings')
    await user.click(urlMappingsTab)
    
    expect(screen.getByTestId('url-mappings')).toBeInTheDocument()
    expect(screen.queryByTestId('webhook-requests')).not.toBeInTheDocument()
  })

  it('should switch back to webhook requests when tab is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Switch to URL mappings first
    const urlMappingsTab = screen.getByText('URL Mappings')
    await user.click(urlMappingsTab)
    
    // Then switch back to webhook requests
    const webhookRequestsTab = screen.getByText('Webhook Requests')
    await user.click(webhookRequestsTab)
    
    expect(screen.getByTestId('webhook-requests')).toBeInTheDocument()
    expect(screen.queryByTestId('url-mappings')).not.toBeInTheDocument()
  })

  it('should highlight active tab', () => {
    render(<App />)
    
    const webhookRequestsTab = screen.getByText('Webhook Requests').closest('button')
    const urlMappingsTab = screen.getByText('URL Mappings').closest('button')
    
    // Webhook requests should be active by default
    expect(webhookRequestsTab).toHaveClass('bg-gradient-to-r', 'from-blue-500')
    expect(urlMappingsTab).toHaveClass('bg-white/80', 'border-blue-200')
  })

  it('should display correct webhook URL in Quick Start', () => {
    render(<App />)
    
    const codeElement = screen.getByText('http://localhost:3001/webhook/your-path')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('should have gradient background', () => {
    render(<App />)
    
    // Find the main container with gradient background
    const containers = document.querySelectorAll('.bg-gradient-to-br')
    expect(containers.length).toBeGreaterThan(0)
    
    const mainContainer = containers[0]
    expect(mainContainer).toHaveClass('bg-gradient-to-br', 'from-slate-50', 'via-blue-50', 'to-indigo-50')
  })
})