"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import {
  Shield,
  LayoutDashboard,
  Eye,
  Monitor,
  AlertTriangle,
  Settings,
  FileText,
  Users,
  Activity,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["user", "analyst", "admin"],
  },
  {
    name: "Live Monitor",
    href: "/monitor",
    icon: Eye,
    roles: ["analyst", "admin"],
  },
  {
    name: "Devices",
    href: "/devices",
    icon: Monitor,
    roles: ["user", "analyst", "admin"],
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
    roles: ["user", "analyst", "admin"],
  },
  {
    name: "Events",
    href: "/events",
    icon: Activity,
    roles: ["analyst", "admin"],
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: FileText,
    roles: ["user", "analyst", "admin"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["user", "analyst", "admin"],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  const filteredNavigation = navigation.filter((item) => profile?.role && item.roles.includes(profile.role))

  return (
    <div className={cn("flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border", className)}>
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-sidebar-foreground">Security X</h1>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-sidebar-foreground">{profile?.full_name || profile?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
          {profile?.organization && <p className="text-xs text-muted-foreground">{profile.organization}</p>}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
