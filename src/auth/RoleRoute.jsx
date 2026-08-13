import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth()
  const userRole = user?.role?.trim().toLowerCase()
  if (!roles.includes(userRole)) return <Navigate to="/unauthorized" replace />
  return children
}
