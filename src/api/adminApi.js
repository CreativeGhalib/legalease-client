import api from './axios'
export const getAdminUsers = async (params = {}) => { const response = await api.get('/admin/users', { params }); return { items: response.data.data.items, meta: response.data.meta } }
export const updateAdminUserRole = async ({ id, role }) => (await api.patch(`/admin/users/${id}/role`, { role })).data.data.user
export const updateAdminUserStatus = async ({ id, status }) => (await api.patch(`/admin/users/${id}/status`, { status })).data.data.user
export const getAdminLawyers = async (params = {}) => { const response = await api.get('/admin/lawyers', { params }); return { items: response.data.data.items, meta: response.data.meta } }
export const moderateAdminLawyer = async ({ id, action }) => (await api.patch(`/admin/lawyers/${id}/publication`, { action })).data.data
export const deleteAdminLawyer = async (id) => api.delete(`/admin/lawyers/${id}`)
export const getAdminTransactions = async (params = {}) => { const response = await api.get('/admin/transactions', { params }); return { items: response.data.data.items, meta: response.data.meta } }
export const getAdminAnalytics = async () => (await api.get('/admin/analytics')).data.data
