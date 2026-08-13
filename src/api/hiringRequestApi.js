import api from './axios'

export async function createHiringRequest(lawyerProfileId) { return (await api.post('/hiring-requests', { lawyerProfileId })).data.data.request }
export async function getMyHiringRequests() { return (await api.get('/hiring-requests/mine')).data.data.items }
export async function getReceivedHiringRequests() { return (await api.get('/hiring-requests/received')).data.data.items }
export async function decideHiringRequest(id, decision) { return (await api.patch(`/hiring-requests/${id}/decision`, { decision })).data.data.request }
