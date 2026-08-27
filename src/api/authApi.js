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

export async function authenticateWithGoogle(payload) {
  return (await api.post('/auth/google', payload)).data.data
}

export async function completeGoogleAccountOnboarding(payload) {
  return userFrom(await api.post('/auth/google/onboarding', payload))
}

export async function requestPasswordReset(email) {
  return (await api.post('/auth/forgot-password', { email })).data.data
}

export async function submitPasswordReset(payload) {
  return (await api.post('/auth/reset-password', payload)).data.data
}

export async function changeAccountPassword(payload) {
  return (await api.patch('/auth/change-password', payload)).data.data
}

export async function requestPhoneOtp(phone) {
  return (await api.post('/auth/phone/send-otp', { phone })).data.data
}

export async function verifyPhoneOtp(code) {
  return (await api.post('/auth/phone/verify-otp', { code })).data.data
}

// Session management (6-H)
export const getSessions = () => api.get('/auth/sessions').then((r) => r.data.data)
export const revokeSession = (sid) => api.delete(`/auth/sessions/${sid}`)
export const revokeAllSessions = () => api.delete('/auth/sessions')
