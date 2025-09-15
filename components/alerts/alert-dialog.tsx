"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Clock, User, CheckCircle } from "lucide-react"

interface Alert {
  id: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "new" | "acknowledged" | "in_progress" | "resolved" | "dismissed"
  notes: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  security_events: {
    id: string
    title: string
    severity: "low" | "medium" | "high" | "critical"
    event_type: string
    description: string
    source_ip: string | null
    devices: {
      name: string
    } | null
  }
  assigned_to: {
    full_name: string | null
    email: string
  } | null
}

interface AlertDialogProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusColors = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  acknowledged: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_progress: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  dismissed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function AlertDialog({ alert, open, onOpenChange, onUpdate }: AlertDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(alert?.status || "new")
  const [notes, setNotes] = useState(alert?.notes || "")
  const [resolutionNotes, setResolutionNotes] = useState("")
  const { profile } = useAuth()
  const { toast } = useToast()

  const handleUpdateAlert = async () => {
    if (!alert) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const updateData: any = {
        status,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      }

      // If resolving, add resolution notes and timestamp
      if (status === "resolved" && resolutionNotes) {
        updateData.resolution_notes = resolutionNotes
        updateData.resolved_at = new Date().toISOString()
      }

      // Assign to current user if taking action
      if (status !== "new" && !alert.assigned_to) {
        updateData.assigned_to = profile?.id
      }

      const { error } = await supabase.from("alerts").update(updateData).eq("id", alert.id)

      if (error) throw error

      toast({
        title: "Alert Updated",
        description: "The alert has been successfully updated.",
      })

      onUpdate()
    } catch (error) {
      console.error("Error updating alert:", error)
      toast({
        title: "Error",
        description: "Failed to update alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!alert) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Details
          </DialogTitle>
          <DialogDescription>Review and manage this security alert</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Header */}
          <div className="flex items-center gap-2">
            <Badge className={priorityColors[alert.priority]} variant="outline">
              {alert.priority} priority
            </Badge>
            <Badge className={statusColors[alert.status]} variant="outline">
              {alert.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">{alert.security_events?.title}</h3>
              <p className="text-muted-foreground">{alert.security_events?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Event Type</Label>
                <p className="capitalize">{alert.security_events?.event_type.replace("_", " ")}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Severity</Label>
                <p className="capitalize">{alert.security_events?.severity}</p>
              </div>
              {alert.security_events?.devices?.name && (
                <div>
                  <Label className="text-muted-foreground">Device</Label>
                  <p>{alert.security_events.devices.name}</p>
                </div>
              )}
              {alert.security_events?.source_ip && (
                <div>
                  <Label className="text-muted-foreground">Source IP</Label>
                  <p className="font-mono">{alert.security_events.source_ip}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Alert Timeline */}
          <div className="space-y-3">
            <Label>Timeline</Label>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Created: {formatDateTime(alert.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Last Updated: {formatDateTime(alert.updated_at)}</span>
              </div>
              {alert.resolved_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Resolved: {formatDateTime(alert.resolved_at)}</span>
                </div>
              )}
              {alert.assigned_to && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Assigned to: {alert.assigned_to.full_name || alert.assigned_to.email}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Update Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add investigation notes..."
                className="bg-input border-border"
                rows={3}
              />
            </div>

            {status === "resolved" && (
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution Notes</Label>
                <Textarea
                  id="resolution"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe how this alert was resolved..."
                  className="bg-input border-border"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleUpdateAlert} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
