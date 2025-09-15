"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface DeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeviceDialog({ open, onOpenChange }: DeviceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    device_type: "",
    ip_address: "",
    mac_address: "",
    operating_system: "",
    location: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("devices").insert([
        {
          ...formData,
          status: "active",
          last_seen: new Date().toISOString(),
        },
      ])

      if (error) throw error

      toast({
        title: "Device Added",
        description: "The device has been successfully added to the network.",
      })

      // Reset form
      setFormData({
        name: "",
        device_type: "",
        ip_address: "",
        mac_address: "",
        operating_system: "",
        location: "",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error adding device:", error)
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>Register a new device to the security monitoring system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Web Server 01"
              required
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="device_type">Device Type</Label>
            <Select
              value={formData.device_type}
              onValueChange={(value) => setFormData({ ...formData, device_type: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="workstation">Workstation</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="iot">IoT Device</SelectItem>
                <SelectItem value="network">Network Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip_address">IP Address</Label>
              <Input
                id="ip_address"
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                placeholder="192.168.1.10"
                required
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mac_address">MAC Address</Label>
              <Input
                id="mac_address"
                value={formData.mac_address}
                onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                placeholder="00:1B:44:11:3A:B7"
                className="bg-input border-border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="operating_system">Operating System</Label>
            <Input
              id="operating_system"
              value={formData.operating_system}
              onChange={(e) => setFormData({ ...formData, operating_system: e.target.value })}
              placeholder="Ubuntu 22.04 LTS"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Data Center A"
              className="bg-input border-border"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
