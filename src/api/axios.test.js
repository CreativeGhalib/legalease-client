import { afterEach, describe, expect, it, vi } from 'vitest'
import { showErrorToast } from '../utils/toast'
import api from './axios'

vi.mock('../utils/toast', () => ({ showErrorToast: vi.fn() }))

afterEach(() => vi.clearAllMocks())

function rejectedAdapter(status, message) {
  return async (config) => Promise.reject({
    config,
    response: { status, data: { error: { message } } },
  })
}

describe('API error notifications', () => {
  it('shows the safe API message for a failed request', async () => {
    await expect(api.get('/lawyers', { adapter: rejectedAdapter(503, 'Service is temporarily unavailable.') })).rejects.toBeDefined()
    expect(showErrorToast).toHaveBeenCalledWith('Service is temporarily unavailable.')
  })

  it('does not notify for the expected unauthenticated session probe', async () => {
    await expect(api.get('/auth/me', { adapter: rejectedAdapter(401, 'Authentication is required.') })).rejects.toBeDefined()
    expect(showErrorToast).not.toHaveBeenCalled()
  })

  it('does not notify when a lawyer has not created a profile yet', async () => {
    await expect(api.get('/lawyers/me/profile', { adapter: rejectedAdapter(404, 'Profile was not found.') })).rejects.toBeDefined()
    expect(showErrorToast).not.toHaveBeenCalled()
  })
})
