"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import LoginPage from "./components/login-page"
import SignupPage from "./components/signup-page"
import Dashboard from "./components/dashboard"
import MedicalRecords from "./components/medical-records"
import UserInformation from "./components/user-information"
import Appointments from "./components/appointments"
import Recommendations from "./components/recommendations"
import HealthMetrics from "./components/health-metrics"

export default function EHealthApp() {
  const [currentPage, setCurrentPage] = useState<"login" | "signup" | "app">("login")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [user, setUser] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentPage("app")
  }

  const handleSignup = (userData: any) => {
    setUser(userData)
    setCurrentPage("app")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage("login")
    setActiveTab("dashboard")
  }

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser)
  }

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage("signup")} />
  }

  if (currentPage === "signup") {
    return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage("login")} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} />
      case "records":
        return <MedicalRecords user={user} onUpdateUser={handleUpdateUser} />
      case "user-info":
        return <UserInformation user={user} onUpdateUser={handleUpdateUser} />
      case "appointments":
        return <Appointments user={user} />
      case "recommendations":
        return <Recommendations user={user} />
      case "metrics":
        return <HealthMetrics user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-white px-4 py-3 focus-within:ring-slate-500">
            <SidebarTrigger />
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  )
}
