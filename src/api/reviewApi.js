import api from './axios'

export async function createReview({ hiringRequestId, rating, feedback }) {
  return (await api.post('/reviews', { hiringRequestId, rating, ...(feedback ? { feedback } : {}) })).data.data.review
}

export async function getLawyerReviews(profileId, params = {}) {
  const response = await api.get(`/lawyers/${profileId}/reviews`, { params })
  return {
    items: response.data.data.items,
    averageRating: response.data.data.averageRating,
    reviewCount: response.data.data.reviewCount,
    ratingCounts: response.data.data.ratingCounts,
    meta: response.data.meta,
  }
}
