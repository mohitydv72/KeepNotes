"use client"

import { Navigate } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"
import type { ReactNode } from "react"
import type { JSX } from "react/jsx-runtime"

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
