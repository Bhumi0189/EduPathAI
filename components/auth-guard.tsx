"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Brain } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading) {
      const redirectTo = searchParams.get("redirectTo")

      if (requireAuth && !user) {
        // Not logged in but page requires auth → send to auth page
        router.push(`/auth${redirectTo ? `?redirectTo=${redirectTo}` : ""}`)
      } else if (!requireAuth && user && redirectTo) {
        // Logged in and has a redirect target → send to redirect
        router.push(redirectTo)
      }
    }
  }, [user, loading, requireAuth, router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
          <div className="text-white text-lg">Loading...</div>
          <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    )
  }

  // Show content based on auth requirements
  if (requireAuth && !user) {
    // Waiting for redirect to auth page
    return null
  }

  if (!requireAuth && user && searchParams.get("redirectTo")) {
    // Waiting for redirect to target page
    return null
  }

  return <>{children}</>
}