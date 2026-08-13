import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth()
  if (!roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />
  return children
}
