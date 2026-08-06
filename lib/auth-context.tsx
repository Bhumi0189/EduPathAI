"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string // Optional avatar property
  createdAt: string
  lastLogin?: string
  learningStyle?: string
  preferences?: {
    emailNotifications: boolean
    pushNotifications: boolean
    studyReminders: boolean
    weeklyReports: boolean
    darkMode: boolean
    language: string
  }
  stats?: {
    totalStudyHours: number
    coursesCompleted: number
    quizzesTaken: number
    vrSessionsCompleted: number
    currentStreak: number
    longestStreak: number
    totalXP: number
    level: number
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const token = localStorage.getItem("authToken")
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        } else {
          localStorage.removeItem("authToken")
        }
      } else {
        localStorage.removeItem("authToken")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("authToken")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("authToken", data.token)
        setUser(data.user)
        
        // Redirect to the redirect parameter or home page
        const redirect = searchParams.get("redirectTo") || "/"
        router.push(redirect)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem("authToken", data.token)
        }
        setUser(data.user)
        
        // Redirect to the redirect parameter or home page
        const redirect = searchParams.get("redirectTo") || "/"
        router.push(redirect)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken")
    }
    setUser(null)
    router.push("/")
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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

export { AuthContext }