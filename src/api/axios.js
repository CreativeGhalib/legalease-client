import axios from 'axios'
import { showErrorToast } from '../utils/toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const expectedGuestProbe = error.response?.status === 401 && error.config?.url === '/auth/me'
    const expectedMissingProfile = error.response?.status === 404
      && error.config?.method === 'get'
      && error.config?.url === '/lawyers/me/profile'
    if (!expectedGuestProbe && !expectedMissingProfile && !error.config?.suppressErrorToast) {
      showErrorToast(error.response?.data?.error?.message)
    }
    return Promise.reject(error)
  },
)

export default api
