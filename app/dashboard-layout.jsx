'use client'

import { DashboardLayout } from '../components/dashboard/layout'

// This wrapper component allows us to use the DashboardLayout component
// which is a client component, with the App Router structure
export default function DashboardLayoutWrapper({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
