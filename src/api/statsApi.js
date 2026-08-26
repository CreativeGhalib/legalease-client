import api from './axios'

export async function getPublicStats() {
  return (await api.get('/stats/public')).data.data
}
