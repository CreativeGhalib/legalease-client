import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, loginAccount, logoutAccount, registerAccount } from '../api/authApi'
import { AuthContext } from './authContext'

function isUnauthenticated(error) {
  return error?.response?.status === 401
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [isChecking, setIsChecking] = useState(true)

  const refreshAuth = useCallback(async () => {
    setIsChecking(true)
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch (error) {
      setUser(null)
      if (!isUnauthenticated(error)) throw error
      return null
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    refreshAuth().catch(() => undefined)
  }, [refreshAuth])

  const register = useCallback(async (payload) => {
    await registerAccount(payload)
    return refreshAuth()
  }, [refreshAuth])

  const login = useCallback(async (payload) => {
    await loginAccount(payload)
    return refreshAuth()
  }, [refreshAuth])

  const logout = useCallback(async () => {
    try {
      await logoutAccount()
    } finally {
      setUser(null)
      queryClient.clear()
    }
  }, [queryClient])

  const value = useMemo(() => ({
    user,
    isChecking,
    isAuthenticated: Boolean(user),
    refreshAuth,
    register,
    login,
    logout,
  }), [isChecking, login, logout, refreshAuth, register, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
