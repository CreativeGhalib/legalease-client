import api from './axios'

export async function getLawyerSlots(lawyerId, dateKey) {
  return (await api.get(`/lawyers/${lawyerId}/slots`, { params: { dateKey } })).data.data
}

export async function bookAppointment({ lawyerProfileId, dateKey, start }) {
  return (await api.post('/appointments', { lawyerProfileId, dateKey, start })).data.data.appointment
}

export async function getMyAppointments() {
  return (await api.get('/appointments/mine')).data.data.items
}

export async function getLawyerAppointments() {
  return (await api.get('/appointments/lawyer')).data.data.items
}

export async function cancelAppointment(id) {
  await api.patch(`/appointments/${id}/cancel`)
}

export async function completeAppointment(id) {
  await api.patch(`/appointments/${id}/complete`)
}
