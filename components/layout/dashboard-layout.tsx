"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { Header } from "@/components/navigation/header"
import { AuthProvider } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth/auth-guard"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  requiredRole?: "admin" | "analyst" | "user"
}

export function DashboardLayout({ children, title, requiredRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <AuthGuard requiredRole={requiredRole}>
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Sidebar />
          </div>

          {/* Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header title={title} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  )
}
