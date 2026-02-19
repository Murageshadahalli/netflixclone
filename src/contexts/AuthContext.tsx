import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('netflix-user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      const { password, ...userWithoutPassword } = parsedUser
      setUser(userWithoutPassword)
    }
    setIsLoading(false)
  }, [])

  const getUsers = (): User[] => {
    const users = localStorage.getItem('netflix-users')
    return users ? JSON.parse(users) : [
      {
        id: '1',
        email: 'user@netflix.com',
        name: 'Netflix User',
        password: 'password'
      }
    ]
  }

  const saveUsers = (users: User[]) => {
    localStorage.setItem('netflix-users', JSON.stringify(users))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = getUsers()
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('netflix-user', JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = getUsers()
    
    if (users.some(u => u.email === email)) {
      setIsLoading(false)
      return false
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      password
    }
    
    users.push(newUser)
    saveUsers(users)
    
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('netflix-user', JSON.stringify(newUser))
    
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('netflix-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
