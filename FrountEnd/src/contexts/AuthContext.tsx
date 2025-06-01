/* eslint-disable react-refresh/only-export-components */
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI } from "../services/api"
import type { User, AuthContextType } from "../types"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authAPI.login(email, password)
    const { token, user } = response.data

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response = await authAPI.register(name, email, password)
    const { token, user } = response.data

    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
