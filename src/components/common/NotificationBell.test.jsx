import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationBell from './NotificationBell'
import * as notificationApi from '../../api/notificationApi'

vi.mock('../../api/notificationApi')

const unreadItem = {
  id: '507f1f77bcf86cd799439011',
  title: 'New hire request from Nasrin Begum',
  message: 'Requested Criminal Law · $120.00.',
  type: 'hire_request',
  link: '/dashboard/lawyer/hiring-history',
  isRead: false,
  createdAt: new Date().toISOString(),
}

function renderBell() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <NotificationBell />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.mocked(notificationApi.getNotifications).mockResolvedValue({
    items: [unreadItem],
    unreadCount: 1,
    meta: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
  })
  vi.mocked(notificationApi.markNotificationRead).mockResolvedValue({ ...unreadItem, isRead: true })
  vi.mocked(notificationApi.markAllNotificationsRead).mockResolvedValue({ updated: 1 })
})

afterEach(() => {
  cleanup()
  vi.mocked(notificationApi.getNotifications).mockReset()
  vi.mocked(notificationApi.markNotificationRead).mockReset()
  vi.mocked(notificationApi.markAllNotificationsRead).mockReset()
})

describe('NotificationBell', () => {
  it('shows the unread badge and opens the dropdown listing notifications', async () => {
    renderBell()
    const badge = await screen.findByText('1')
    expect(badge).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /notifications/i }))
    expect(screen.getByRole('menu', { name: 'Notifications' })).toBeTruthy()
    expect(screen.getByText(unreadItem.title)).toBeTruthy()
    expect(screen.getByText('just now')).toBeTruthy()
  })

  it('hides the badge entirely when there are zero unread items', async () => {
    vi.mocked(notificationApi.getNotifications).mockResolvedValue({ items: [], unreadCount: 0, meta: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 } })
    renderBell()
    await waitFor(() => expect(vi.mocked(notificationApi.getNotifications)).toHaveBeenCalled())
    expect(screen.queryByText(/^Notifications \(/)).toBeNull()
  })

  it('marks a clicked unread item as read', async () => {
    renderBell()
    fireEvent.click(await screen.findByRole('button', { name: /notifications/i }))
    fireEvent.click(screen.getByText(unreadItem.title))
    await waitFor(() =>
      expect(notificationApi.markNotificationRead.mock.calls[0]?.[0]).toBe(unreadItem.id),
    )
  })

  it('mark-all action hits the read-all endpoint exactly once', async () => {
    vi.mocked(notificationApi.markNotificationRead).mockResolvedValue({ ...unreadItem, isRead: true })
    renderBell()
    fireEvent.click(await screen.findByRole('button', { name: /notifications/i }))

    const markAllButton = screen.getByRole('menuitem', { name: /mark all read/i })
    expect(markAllButton.disabled).toBe(false)
    fireEvent.click(markAllButton)
    await waitFor(() => expect(notificationApi.markAllNotificationsRead).toHaveBeenCalledTimes(1))
  })
})
