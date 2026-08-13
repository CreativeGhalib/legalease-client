import api from './axios'

export async function startVerificationCheckout() { return (await api.post('/payments/publishing/checkout')).data.data }
export async function getVerificationPaymentStatus(id) { return (await api.get(`/payments/${id}/status`)).data.data }
export async function startHiringCheckout(id) { return (await api.post(`/payments/hiring/${id}/checkout`)).data.data }
export async function getMyPayments() { return (await api.get('/payments/mine')).data.data.items }
export async function changePublication(publicationStatus) { return (await api.patch('/lawyers/me/publication', { publicationStatus })).data.data }
