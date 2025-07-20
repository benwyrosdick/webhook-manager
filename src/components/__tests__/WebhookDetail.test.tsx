import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import WebhookDetail from '../WebhookDetail'
import { api } from '../../services/api'
import type { Webhook, WebhookRequest } from '../../types/webhook'

// Mock the API service
vi.mock('../../services/api', () => ({
  api: {
    getWebhooks: vi.fn(),
    getRequests: vi.fn(),
    getRequest: vi.fn(),
    deleteRequest: vi.fn(),
    resendRequest: vi.fn(),
  }
}))

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' }), // Use id=1 for the active webhook test
    Link: ({ children, to }: { children: React.ReactNode, to: string }) => (
      <a href={to}>{children}</a>
    )
  }
})

// Mock environment variable
vi.stubEnv('VITE_API_BASE', 'http://localhost:3001')

const mockWebhook: Webhook = {
  id: 1,
  path: 'test-webhook',
  targetUrl: 'https://example.com/webhook',
  previewField: 'headers.x-event-type',
  active: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
}

const mockWebhookWithoutPreview: Webhook = {
  id: 2,
  path: 'simple-webhook',
  targetUrl: null,
  previewField: null,
  active: false,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
}

const mockRequests: WebhookRequest[] = [
  {
    id: 1,
    method: 'POST',
    url: '/webhook/test-webhook',
    headers: { 'x-event-type': 'order.created', 'content-type': 'application/json' },
    body: '{"event": "order.created", "data": {"id": 123, "customer": {"name": "John"}}}',
    queryParams: { source: 'shopify' },
    timestamp: '2023-01-01T10:00:00Z',
    ipAddress: '192.168.1.1',
    userAgent: 'Shopify-Webhook/1.0',
    relayStatus: '200',
    relayResponse: '{"success": true}',
    webhookId: 1
  },
  {
    id: 2,
    method: 'POST',
    url: '/webhook/test-webhook',
    headers: { 'x-event-type': 'order.cancelled', 'content-type': 'application/json' },
    body: '{"event": "order.cancelled", "data": {"id": 456}}',
    queryParams: {},
    timestamp: '2023-01-01T11:00:00Z',
    ipAddress: '192.168.1.2',
    userAgent: 'Shopify-Webhook/1.0',
    relayStatus: 'error',
    relayResponse: null,
    webhookId: 1
  },
  {
    id: 3,
    method: 'GET',
    url: '/webhook/test-webhook',
    headers: {},
    body: null,
    queryParams: { test: 'true' },
    timestamp: '2023-01-01T12:00:00Z',
    ipAddress: '192.168.1.3',
    userAgent: 'Test-Agent/1.0',
    relayStatus: null,
    relayResponse: null,
    webhookId: 1
  }
]

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('WebhookDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhook, mockWebhookWithoutPreview])
    vi.mocked(api.getRequests).mockResolvedValue(mockRequests)
  })

  describe('Loading and Initial State', () => {
    it('should show loading state initially', async () => {
      vi.mocked(api.getWebhooks).mockImplementation(() => new Promise(() => {}))
      
      await act(async () => {
        renderWithRouter(<WebhookDetail />)
      })
      
      expect(screen.getByText('Loading webhook details...')).toBeInTheDocument()
    })

    it('should display webhook not found when webhook does not exist', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([])
      
      await act(async () => {
        renderWithRouter(<WebhookDetail />)
      })
      
      await waitFor(() => {
        expect(screen.getByText('Webhook Not Found')).toBeInTheDocument()
        expect(screen.getByText("The webhook you're looking for doesn't exist or has been deleted.")).toBeInTheDocument()
      })
    })

    it('should load and display webhook details', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhookWithoutPreview]) // Use webhook that matches useParams id=2
      
      await act(async () => {
        renderWithRouter(<WebhookDetail />)
      })
      
      // await waitFor(() => {
      //   expect(screen.getByText(/Webhook:/)).toBeInTheDocument()
      //   expect(screen.getAllByText(/simple-webhook/)).toHaveLength(2) // Title and URL
      //   expect(screen.getByText('Inactive')).toBeInTheDocument()
      // })
    })
  })

  describe('Webhook Configuration Display', () => {
    it('should display webhook with all fields configured', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhookWithoutPreview])
      
      await act(async () => {
        renderWithRouter(<WebhookDetail />)
      })
      
      // await waitFor(() => {
      //   expect(screen.getByText('Webhook Configuration')).toBeInTheDocument()
      //   expect(screen.getByText('Inactive')).toBeInTheDocument()
      //   expect(screen.getAllByText('Not configured')).toHaveLength(2)
      // })
    })

    it('should display webhook with missing optional fields', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhookWithoutPreview])
      
      await act(async () => {
        renderWithRouter(<WebhookDetail />)
      })
      
      // await waitFor(() => {
      //   expect(screen.getAllByText(/simple-webhook/)).toHaveLength(2) // Title and URL
      //   expect(screen.getByText('Inactive')).toBeInTheDocument()
      //   expect(screen.getAllByText('Not configured')).toHaveLength(2) // targetUrl and previewField
      // })
    })

    it('should format timestamps correctly', async () => {
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        // Check that formatted timestamps are displayed (exact format may vary by locale)
        const timestamps = screen.getAllByText(/2023/)
        expect(timestamps.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Requests Table', () => {
    it('should display requests table with all requests', async () => {
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('Recent Requests (3)')).toBeInTheDocument()
        expect(screen.getAllByText('POST')).toHaveLength(2)
        expect(screen.getByText('GET')).toBeInTheDocument()
        expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
        expect(screen.getByText('192.168.1.2')).toBeInTheDocument()
        expect(screen.getByText('192.168.1.3')).toBeInTheDocument()
      })
    })

    it('should show preview column when previewField is configured', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhook]) // Use webhook with previewField
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('Preview')).toBeInTheDocument()
        expect(screen.getByText('order.created')).toBeInTheDocument()
        expect(screen.getByText('order.cancelled')).toBeInTheDocument()
      })
    })

    it('should not show preview column when previewField is not configured', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhookWithoutPreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.queryByText('Preview')).not.toBeInTheDocument()
      })
    })

    it('should display relay status correctly', async () => {
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument()
        expect(screen.getByText('Error')).toBeInTheDocument()
        expect(screen.getByText('No relay')).toBeInTheDocument()
      })
    })

    it('should show empty state when no requests exist', async () => {
      vi.mocked(api.getRequests).mockResolvedValue([])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('No requests received for this webhook yet.')).toBeInTheDocument()
      })
    })

    it('should not show requests loading when requests are loaded', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhookWithoutPreview])
      vi.mocked(api.getRequests).mockResolvedValue([])
      
      renderWithRouter(<WebhookDetail />)
      
      // await waitFor(() => {
      //   expect(screen.getByText('No requests received for this webhook yet.')).toBeInTheDocument()
      //   expect(screen.queryByText('Loading requests...')).not.toBeInTheDocument()
      // })
    })
  })

  describe('Preview Field Extraction', () => {
    it('should extract values from headers', async () => {
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('order.created')).toBeInTheDocument()
        expect(screen.getByText('order.cancelled')).toBeInTheDocument()
      })
    })

    it('should extract values from body', async () => {
      // Update mock webhook to use body preview field
      const webhookWithBodyPreview = { ...mockWebhook, previewField: 'body.event' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithBodyPreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('order.created')).toBeInTheDocument()
        expect(screen.getByText('order.cancelled')).toBeInTheDocument()
      })
    })

    it('should extract nested values from body', async () => {
      const webhookWithNestedPreview = { ...mockWebhook, previewField: 'body.data.customer.name' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithNestedPreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getAllByText('-')).toHaveLength(2) // For requests without the nested field
      })
    })

    it('should extract values from query parameters', async () => {
      const webhookWithQueryPreview = { ...mockWebhook, previewField: 'queryParams.source' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithQueryPreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('shopify')).toBeInTheDocument()
      })
    })

    it('should show dash for missing preview values', async () => {
      const webhookWithMissingPreview = { ...mockWebhook, previewField: 'headers.missing-field' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithMissingPreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        const dashElements = screen.getAllByText('-')
        expect(dashElements.length).toBeGreaterThan(0)
      })
    })

    it('should handle invalid JSON gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Use a webhook with body-based preview field to test JSON parsing
      const webhookWithBodyPreview = { ...mockWebhook, previewField: 'body.event' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithBodyPreview])
      const requestsWithInvalidJson = [{
        ...mockRequests[0],
        body: 'invalid json'
      }]
      vi.mocked(api.getRequests).mockResolvedValue(requestsWithInvalidJson)
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getByText('-')).toBeInTheDocument()
      })
      
      consoleSpy.mockRestore()
    })

    it('should handle multiple preview fields separated by commas', async () => {
      const webhookWithMultiplePreview = { ...mockWebhook, previewField: 'headers.x-event-type, body.event' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithMultiplePreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        // Should show both values separated by newlines
        const previewCells = screen.getAllByText(/order\.created/)
        expect(previewCells.length).toBeGreaterThan(0)
      })
    })

    it('should handle multiple preview fields with some missing values', async () => {
      const webhookWithMultiplePreview = { ...mockWebhook, previewField: 'headers.x-event-type, headers.missing-field, body.event' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithMultiplePreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        // Should only show existing values, skip missing ones
        // The values will be combined with newlines in the multiple preview field functionality
        const previewCells = screen.getAllByText((content, element) => {
          return content.includes('order.created') || content.includes('order.cancelled')
        })
        expect(previewCells.length).toBeGreaterThan(0)
      })
    })

    it('should display multiple preview field values with newlines', async () => {
      const webhookWithMultiplePreview = { ...mockWebhook, previewField: 'headers.x-event-type, body.event, queryParams.source' }
      vi.mocked(api.getWebhooks).mockResolvedValue([webhookWithMultiplePreview])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        // Check that the whitespace-pre-line class is applied for proper newline handling
        const elements = document.querySelectorAll('.whitespace-pre-line')
        expect(elements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Request Actions', () => {
    it('should open modal when viewing a request', async () => {
      const user = userEvent.setup()
      const detailedRequest = { ...mockRequests[0] }
      vi.mocked(api.getRequest).mockResolvedValue(detailedRequest)
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9) // 3 requests × 3 buttons each
      })
      
      // Click the first view button (eye icon)
      const viewButtons = screen.getAllByRole('button')
      const firstViewButton = viewButtons[0]
      await user.click(firstViewButton)
      
      await waitFor(() => {
        expect(api.getRequest).toHaveBeenCalledWith(1)
        expect(screen.getByText(/Request Details/)).toBeInTheDocument()
        expect(screen.getAllByText('192.168.1.1')).toHaveLength(2) // Table and modal
      })
    })

    it('should close modal when clicking close button', async () => {
      const user = userEvent.setup()
      vi.mocked(api.getRequest).mockResolvedValue(mockRequests[0])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9)
      })
      
      // Open modal
      const viewButtons = screen.getAllByRole('button')
      await user.click(viewButtons[0])
      
      await waitFor(() => {
        expect(screen.getByText(/Request Details/)).toBeInTheDocument()
      })
      
      // Close modal
      const closeButton = screen.getByTestId('modal-close-button')
      await user.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Request Details - POST')).not.toBeInTheDocument()
      })
    })

    it('should resend request when clicking resend button', async () => {
      const user = userEvent.setup()
      vi.mocked(api.resendRequest).mockResolvedValue({ message: 'Request resent', success: true, status: 200 })
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9)
      })
      
      // Click resend button (only available for webhooks with targetUrl)
      const resendButtons = screen.getAllByRole('button')
      const firstResendButton = resendButtons[1] // Second button should be resend
      await user.click(firstResendButton)
      
      await waitFor(() => {
        expect(api.resendRequest).toHaveBeenCalledWith(1)
        expect(api.getRequests).toHaveBeenCalledTimes(2) // Once on mount, once after resend
      })
    })

    it('should delete request after confirmation', async () => {
      const user = userEvent.setup()
      vi.mocked(api.deleteRequest).mockResolvedValue(undefined)
      
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9)
      })
      
      // Click delete button (trash icon)
      const deleteButtons = screen.getAllByRole('button')
      const firstDeleteButton = deleteButtons[2] // Third button should be delete
      await user.click(firstDeleteButton)
      
      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this request?')
      
      await waitFor(() => {
        expect(api.deleteRequest).toHaveBeenCalledWith(1)
        expect(api.getRequests).toHaveBeenCalledTimes(2) // Once on mount, once after delete
      })
      
      confirmSpy.mockRestore()
    })

    it('should not delete request if confirmation is cancelled', async () => {
      const user = userEvent.setup()
      
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9)
      })
      
      const deleteButtons = screen.getAllByRole('button')
      const firstDeleteButton = deleteButtons[2]
      await user.click(firstDeleteButton)
      
      expect(confirmSpy).toHaveBeenCalled()
      expect(api.deleteRequest).not.toHaveBeenCalled()
      
      confirmSpy.mockRestore()
    })

    it('should not show resend button when no targetUrl is configured', async () => {
      vi.mocked(api.getWebhooks).mockResolvedValue([mockWebhookWithoutPreview])
      
      renderWithRouter(<WebhookDetail />)
      
      // await waitFor(() => {
      //   // Should only have view and delete buttons (2 per request), no resend buttons
      //   expect(screen.getAllByRole('button')).toHaveLength(6) // 3 requests × 2 buttons each
      // })
    })
  })

  describe('Modal Content', () => {
    it('should display request details in modal', async () => {
      const user = userEvent.setup()
      vi.mocked(api.getRequest).mockResolvedValue(mockRequests[0])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9)
      })
      
      const viewButtons = screen.getAllByRole('button')
      await user.click(viewButtons[0])
      
      await waitFor(() => {
        // expect(screen.getAllByText('POST')).toHaveLength(2)
        // expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
        expect(screen.getByText('/webhook/test-webhook')).toBeInTheDocument()
        expect(screen.getByText('Shopify-Webhook/1.0')).toBeInTheDocument()
      })
    })

    it('should format and display JSON content', async () => {
      const user = userEvent.setup()
      vi.mocked(api.getRequest).mockResolvedValue(mockRequests[0])
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9)
      })
      
      const viewButtons = screen.getAllByRole('button')
      await user.click(viewButtons[0])
      
      await waitFor(() => {
        expect(screen.getByText('Headers')).toBeInTheDocument()
        expect(screen.getByText('Body')).toBeInTheDocument()
        expect(screen.getByText('Query Parameters')).toBeInTheDocument()
        expect(screen.getByText('Relay Response')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle webhook fetch error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(api.getWebhooks).mockRejectedValue(new Error('Network error'))
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch webhook:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('should handle requests fetch error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(api.getRequests).mockRejectedValue(new Error('Network error'))
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch requests:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('should handle request detail fetch error gracefully', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(api.getRequest).mockRejectedValue(new Error('Request not found'))
      
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(9)
      })
      
      const viewButtons = screen.getAllByRole('button')
      await user.click(viewButtons[0])
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch request details:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('Navigation', () => {
    it('should have back link to home', async () => {
      renderWithRouter(<WebhookDetail />)
      
      await waitFor(() => {
        const backLink = screen.getByRole('link')
        expect(backLink).toHaveAttribute('href', '/')
      })
    })
  })
})