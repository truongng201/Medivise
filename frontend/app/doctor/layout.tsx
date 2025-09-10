"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DoctorSidebar } from "../components/doctor-sidebar"
import { useRequireAuth, useAuthContext } from "@/contexts/auth-context"
import { AuthManager } from "@/lib/auth"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { authData, isAuthenticated, isLoading } = useRequireAuth('doctor')
  const { logout } = useAuthContext()

  const handleLogout = async () => {
    try {
      // Optionally call backend logout endpoint
      if (authData) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authData.access_token}`
          },
          body: JSON.stringify({
            refresh_token: authData.refresh_token
          })
        })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Always clear local storage and redirect
      logout()
    }
  }

  const handleUpdateUser = (updatedUser: any) => {
    if (authData) {
      const updatedAuthData = {
        ...authData,
        account: { ...authData.account, ...updatedUser }
      }
      AuthManager.setAuthData(updatedAuthData)
    }
  }

  const getActiveTab = () => {
    if (pathname === '/doctor') return 'dashboard'
    if (pathname === '/doctor/patients') return 'patients'
    if (pathname.startsWith('/doctor/patient/')) return 'patient-details'
    if (pathname === '/doctor/appointments') return 'appointments'
    if (pathname === '/doctor/analytics') return 'analytics'
    if (pathname === '/doctor/settings') return 'settings'
    if (pathname === '/doctor/patient-requests') return 'patient-requests'
    return 'dashboard'
  }

  const handleTabChange = (tab: string) => {
    const routes = {
      dashboard: '/doctor',
      patients: '/doctor/patients',
      appointments: '/doctor/appointments',
      analytics: '/doctor/analytics',
      settings: '/doctor/settings',
      'patient-requests': '/doctor/patient-requests'
    }
    router.push(routes[tab as keyof typeof routes] || '/doctor')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !authData) {
    return null // useAuth will handle redirect
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DoctorSidebar
          user={authData.account}
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          selectedPatient={selectedPatient}
        />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-white px-4 py-3 focus-within:ring-slate-500">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
