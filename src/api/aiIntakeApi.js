import api from './axios'

export async function qualifyIntake(message) {
  return (await api.post('/intake/qualify', { message })).data.data
}
