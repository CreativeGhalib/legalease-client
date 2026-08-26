import api from './axios'

export async function getMyAccountProfile() {
  return (await api.get('/users/me')).data.data.user
}

export async function updateMyAccountProfile(payload) {
  return (await api.patch('/users/me', payload)).data.data.user
}

export async function uploadAccountPhoto(file) {
  const data = new FormData()
  data.append('image', file)
  return (await api.post('/uploads/image', data)).data.data.url
}

export async function requestAccountDeletion(payload) {
  return (await api.post('/users/me/delete-request', payload)).data.data
}

export async function cancelAccountDeletion() {
  await api.delete('/users/me/delete-request')
}

export async function revokeAllSessions(payload) {
  return (await api.patch('/users/me/revoke-sessions', payload)).data.data
}
