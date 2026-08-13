import api from './axios'

export async function getMyLawyerProfile() {
  return (await api.get('/lawyers/me/profile')).data.data.profile
}

export async function saveMyLawyerProfile({ exists, payload }) {
  const method = exists ? 'patch' : 'post'
  return (await api[method]('/lawyers/me/profile', payload)).data.data.profile
}

export async function deleteMyLawyerProfile() {
  await api.delete('/lawyers/me/profile')
}

export async function uploadProfessionalPhoto(file) {
  const data = new FormData()
  data.append('image', file)
  return (await api.post('/uploads/image', data)).data.data.url
}
