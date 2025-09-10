"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import { Spinner } from "@/components/ui/spinner"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== 'patient') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" className="text-slate-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          user={user}
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
