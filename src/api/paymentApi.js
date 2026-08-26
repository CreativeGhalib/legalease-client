import api from './axios'

export async function startVerificationCheckout() {
  return (await api.post('/payments/publishing/checkout')).data.data
}

/**
 * Fetches payment status for any transaction type (verification or hiring fee).
 * The server endpoint handles both types and returns type-specific fields.
 */
export async function getPaymentStatus(id) {
  return (await api.get(`/payments/${id}/status`)).data.data
}

export async function startHiringCheckout(id) {
  return (await api.post(`/payments/hiring/${id}/checkout`)).data.data
}

export async function startSslcommerzCheckout(id) {
  return (await api.post(`/payments/hiring/${id}/sslcommerz/initiate`)).data.data
}

export async function getMyPayments() {
  return (await api.get('/payments/mine')).data.data.items
}

export async function confirmCaseCompletion(hiringRequestId) {
  return (await api.post(`/cases/${hiringRequestId}/confirm-completion`)).data.data
}

export async function changePublication(publicationStatus) {
  return (await api.patch('/lawyers/me/publication', { publicationStatus })).data.data
}
