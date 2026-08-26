import api from './axios'

export async function getCaseTimeline(hiringRequestId) {
  return (await api.get(`/cases/${hiringRequestId}`)).data.data
}

export async function createCaseMilestone(hiringRequestId, payload) {
  return (await api.post(`/cases/${hiringRequestId}/milestones`, payload)).data.data.milestone
}

export async function updateCaseMilestone(milestoneId, payload) {
  return (await api.patch(`/cases/milestones/${milestoneId}`, payload)).data.data.milestone
}
