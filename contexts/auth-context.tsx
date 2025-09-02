"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type AuthState, authService } from "@/lib/auth"
import type { User } from "@/lib/types" // Assuming User type is defined somewhere

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const user = authService.getCurrentUser()
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const user = await authService.login(email, password)
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const user = await authService.signup(email, password, name)
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) {
      throw new Error("No user logged in")
    }

    try {
      const updatedUser = await authService.updateProfile(state.user.id, updates)
      setState((prev) => ({
        ...prev,
        user: updatedUser,
      }))
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!state.user) {
      throw new Error("No user logged in")
    }

    try {
      await authService.changePassword(state.user.id, currentPassword, newPassword)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
