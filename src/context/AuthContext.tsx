/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  username: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  successMessage: string | null
  login: (username: string, password: string) => boolean
  register: (username: string, password: string) => boolean
  logout: () => void
  clearSuccessMessage: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, string>>({
    admin: 'password123',
    demo: 'demo123',
  })

  const login = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) {
      return false
    }
    const storedPassword = registeredUsers[username]
    if (storedPassword && storedPassword === password) {
      setIsAuthenticated(true)
      setUser({ username })
      return true
    }
    if (username.trim() && password.trim()) {
      setIsAuthenticated(true)
      setUser({ username })
      return true
    }
    return false
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
