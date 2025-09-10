"use client"

import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import { useRequireAuth, useAuthContext } from "@/contexts/auth-context"
import { AuthManager } from "@/lib/auth"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { authData, isAuthenticated, isLoading } = useRequireAuth('patient')
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
    if (pathname === '/patient') return 'dashboard'
    if (pathname === '/patient/information') return 'user-info'
    if (pathname === '/patient/records') return 'records'
    if (pathname === '/patient/appointments') return 'appointments'
    if (pathname === '/patient/recommendations') return 'recommendations'
    if (pathname === '/patient/metrics') return 'metrics'
    return 'dashboard'
  }

  const handleTabChange = (tab: string) => {
    const routes = {
      dashboard: '/patient',
      'user-info': '/patient/information',
      records: '/patient/records',
      appointments: '/patient/appointments',
      recommendations: '/patient/recommendations',
      metrics: '/patient/metrics'
    }
    router.push(routes[tab as keyof typeof routes] || '/patient')
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
        <AppSidebar
          user={authData.account}
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
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
