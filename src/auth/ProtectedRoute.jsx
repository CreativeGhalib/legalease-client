import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import AuthCheckingScreen from '../components/common/AuthCheckingScreen'

export default function ProtectedRoute({ children }) {
  const { isChecking, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isChecking) return <AuthCheckingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
