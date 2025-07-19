import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock child components
vi.mock('../components/WebhookList', () => ({
  default: () => <div data-testid="webhook-list">Webhook List Component</div>
}))

vi.mock('../components/WebhookDetail', () => ({
  default: () => <div data-testid="webhook-detail">Webhook Detail Component</div>
}))

// Mock React Router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>,
  useParams: () => ({ id: '1' }),
}))

describe('App', () => {
  it('should render Quick Start section', () => {
    render(<App />)
    
    expect(screen.getByText('Quick Start')).toBeInTheDocument()
    expect(screen.getByText(/Receive webhooks:/)).toBeInTheDocument()
    expect(screen.getByText(/Forward webhooks:/)).toBeInTheDocument()
  })

  it('should show webhook list component', () => {
    render(<App />)
    
    expect(screen.getByTestId('webhook-list')).toBeInTheDocument()
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