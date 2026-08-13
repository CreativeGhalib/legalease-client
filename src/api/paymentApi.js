import api from './axios'

export async function startVerificationCheckout() { return (await api.post('/payments/publishing/checkout')).data.data }
export async function getVerificationPaymentStatus(id) { return (await api.get(`/payments/${id}/status`)).data.data }
export async function changePublication(publicationStatus) { return (await api.patch('/lawyers/me/publication', { publicationStatus })).data.data }
