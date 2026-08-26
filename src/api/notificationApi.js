import api from './axios'

export async function getNotifications(params = {}) {
  const response = await api.get('/notifications', { params })
  return {
    items: response.data.data.items,
    unreadCount: response.data.data.unreadCount,
    meta: response.data.meta,
  }
}

export async function markNotificationRead(id) {
  return (await api.patch(`/notifications/${id}/read`)).data.data.notification
}

export async function markAllNotificationsRead() {
  return (await api.patch('/notifications/read-all')).data.data
}
