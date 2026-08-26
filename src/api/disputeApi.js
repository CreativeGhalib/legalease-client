import api from './axios'

export async function openDispute({ hiringRequestId, reason }) {
  return (await api.post('/disputes', { hiringRequestId, reason })).data.data.dispute
}

export async function getMyDisputes() {
  return (await api.get('/disputes/mine')).data.data.items
}
