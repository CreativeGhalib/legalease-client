import api from './axios'

export async function createLead(payload) {
  return (await api.post('/leads', payload)).data.data
}

export async function getAdminLeads(params = {}) {
  const response = await api.get('/admin/leads', { params })
  return { items: response.data.data.items, meta: response.data.meta }
}

export async function updateAdminLeadStatus({ id, status }) {
  return (await api.patch(`/admin/leads/${id}/status`, { status })).data.data.lead
}

export async function addAdminLeadNote({ id, note }) {
  return (await api.post(`/admin/leads/${id}/notes`, { note })).data.data.lead
}
