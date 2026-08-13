import api from './axios'

export async function getPublicLawyers(params) {
  return (await api.get('/lawyers', { params })).data
}

export async function getFeaturedLawyers() {
  return (await api.get('/lawyers/featured')).data.data.items
}

export async function getTopLawyers() {
  return (await api.get('/lawyers/top')).data.data.items
}

export async function getPublicLawyer(id) {
  return (await api.get(`/lawyers/${id}`)).data.data.lawyer
}
