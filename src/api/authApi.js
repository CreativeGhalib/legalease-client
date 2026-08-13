import api from './axios'

function userFrom(response) {
  return response.data.data.user
}

export async function registerAccount(payload) {
  return userFrom(await api.post('/auth/register', payload))
}

export async function loginAccount(payload) {
  return userFrom(await api.post('/auth/login', payload))
}

export async function getCurrentUser() {
  return userFrom(await api.get('/auth/me'))
}

export async function logoutAccount() {
  await api.post('/auth/logout')
}
