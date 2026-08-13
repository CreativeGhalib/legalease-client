import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import AuthCheckingScreen from '../components/common/AuthCheckingScreen'

export default function GuestOnlyRoute({ children }) {
  const { isChecking, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isChecking) return <AuthCheckingScreen />
  if (isAuthenticated) return <Navigate to={location.state?.from || '/dashboard'} replace />
  return children
}
