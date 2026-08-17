import api from './axios'

export async function getAdminUsers(params = {}) {
  const response = await api.get('/admin/users', { params })
  return { items: response.data.data.items, meta: response.data.meta }
}

export async function updateAdminUserRole({ id, role }) {
  return (await api.patch(`/admin/users/${id}/role`, { role })).data.data.user
}

export async function updateAdminUserStatus({ id, status }) {
  return (await api.patch(`/admin/users/${id}/status`, { status })).data.data.user
}

export async function getAdminLawyers(params = {}) {
  const response = await api.get('/admin/lawyers', { params })
  return { items: response.data.data.items, meta: response.data.meta }
}

export async function moderateAdminLawyer({ id, action }) {
  return (await api.patch(`/admin/lawyers/${id}/publication`, { action })).data.data
}

export async function deleteAdminLawyer(id) {
  return api.delete(`/admin/lawyers/${id}`)
}

export async function getAdminTransactions(params = {}) {
  const response = await api.get('/admin/transactions', { params })
  return { items: response.data.data.items, meta: response.data.meta }
}

export async function getAdminAnalytics() {
  return (await api.get('/admin/analytics')).data.data
}
