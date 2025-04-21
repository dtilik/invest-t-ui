'use client'

import { ReactNode } from 'react'
import { DashboardLayout } from '../components/dashboard/layout'

interface DashboardLayoutWrapperProps {
  children: ReactNode
}

// This wrapper component allows us to use the DashboardLayout component
// which is a client component, with the App Router structure
export default function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  return <DashboardLayout>{children}</DashboardLayout>
}
