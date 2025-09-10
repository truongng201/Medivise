"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DoctorSidebar } from "../components/doctor-sidebar"
import { Spinner } from "@/components/ui/spinner"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== 'doctor') {
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
        <DoctorSidebar
          user={user}
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
