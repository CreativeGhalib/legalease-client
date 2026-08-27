import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth()
  const userRole = user?.role?.trim().toLowerCase()
  const allowedRoles = roles.map((role) => String(role).trim().toLowerCase())
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />
  return children
}
