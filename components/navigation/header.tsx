"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Bell, Menu, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onMenuClick?: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { profile } = useAuth()

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-card/50 backdrop-blur-sm px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      {title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>}

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search events, devices..." className="w-64 pl-10 bg-input border-border" />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
            3
          </Badge>
        </Button>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{profile?.full_name || profile?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
