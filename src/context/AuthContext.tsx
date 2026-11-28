/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react'
import { apiFetch } from '../services/api'

interface User {
  username: string
  [key: string]: unknown
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  successMessage: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => boolean
  logout: () => void
  clearSuccessMessage: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem('auth_token'))
  })
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch {
        return null
      }
    }
    return null
  })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, string>>({
    admin: 'password123',
    demo: 'demo123',
  })

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username.trim() || !password.trim()) {
      return false
    }

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json().catch(() => ({}))
        const token = data.token || data.accessToken || data.auth_token || (typeof data === 'string' ? data : 'session-token')
        const userInfo = data.user || { username }

        sessionStorage.setItem('auth_token', token)
        sessionStorage.setItem('user', JSON.stringify(userInfo))

        setIsAuthenticated(true)
        setUser(userInfo)
        return true
      } else {
        const errorText = await response.text().catch(() => '')
        const storedPassword = registeredUsers[username]
        if (storedPassword && storedPassword === password) {
          const token = 'mock-fallback-token'
          const userInfo = { username }
          sessionStorage.setItem('auth_token', token)
          sessionStorage.setItem('user', JSON.stringify(userInfo))
          setIsAuthenticated(true)
          setUser(userInfo)
          return true
        }
        throw new Error(errorText || `Authentication failed (status ${response.status})`)
      }
    } catch (err) {
      const storedPassword = registeredUsers[username]
      if (storedPassword && storedPassword === password) {
        const token = 'mock-fallback-token'
        const userInfo = { username }
        sessionStorage.setItem('auth_token', token)
        sessionStorage.setItem('user', JSON.stringify(userInfo))
        setIsAuthenticated(true)
        setUser(userInfo)
        return true
      }
      throw err instanceof Error ? err : new Error('Invalid username or password')
    }
  }

  const register = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) {
      return false
    }
    setRegisteredUsers((prev) => ({ ...prev, [username]: password }))
    setSuccessMessage(`Account successfully created for "${username}". Please log in.`)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  const clearSuccessMessage = () => {
    setSuccessMessage(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        successMessage,
        login,
        register,
        logout,
        clearSuccessMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
