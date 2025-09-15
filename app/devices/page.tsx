import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DeviceManagement } from "@/components/devices/device-management"

export default function DevicesPage() {
  return (
    <DashboardLayout title="Device Management">
      <DeviceManagement />
    </DashboardLayout>
  )
}
