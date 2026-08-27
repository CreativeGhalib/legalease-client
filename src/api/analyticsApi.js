import api from './axios.js'

/**
 * GET /api/lawyers/me/analytics
 * Returns profileViews, totalHires, paidHires, conversionRate, appointmentCount, trend[]
 */
export const getLawyerAnalytics = () =>
  api.get('/lawyers/me/analytics').then((r) => r.data.data)
