import api from './axios'
export async function getLawyerComments(profileId) { return (await api.get(`/lawyers/${profileId}/comments`)).data.data.items }
export async function createLawyerComment(profileId, content) { return (await api.post(`/lawyers/${profileId}/comments`, { content })).data.data.comment }
export async function getMyComments() { return (await api.get('/comments/mine')).data.data.items }
export async function updateComment(id, content) { return (await api.patch(`/comments/${id}`, { content })).data.data.comment }
export async function deleteComment(id) { await api.delete(`/comments/${id}`) }
