"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "analyst" | "user"
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/auth/login")
          return
        }

        // If no specific role required, user is authorized
        if (!requiredRole) {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // Check user profile and role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profileError || !profile) {
          console.error("Error fetching user profile:", profileError)
          router.push("/auth/login")
          return
        }

        // Check role authorization
        const roleHierarchy = { user: 1, analyst: 2, admin: 3 }
        const userRoleLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 0
        const requiredRoleLevel = roleHierarchy[requiredRole]

        if (userRoleLevel >= requiredRoleLevel) {
          setIsAuthorized(true)
        } else {
          router.push("/unauthorized")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
