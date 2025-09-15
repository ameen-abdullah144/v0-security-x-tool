"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity } from "lucide-react"

interface ChartData {
  time: string
  events: number
  alerts: number
}

export function RealtimeChart() {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    const generateInitialData = () => {
      const now = new Date()
      const initialData: ChartData[] = []

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        initialData.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          events: Math.floor(Math.random() * 20) + 5,
          alerts: Math.floor(Math.random() * 8) + 1,
        })
      }

      setData(initialData)
    }

    generateInitialData()

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          events: Math.floor(Math.random() * 20) + 5,
          alerts: Math.floor(Math.random() * 8) + 1,
        })
        return newData
      })
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-Time Activity
        </CardTitle>
        <CardDescription>Security events and alerts over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name="Events"
              />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                name="Alerts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
