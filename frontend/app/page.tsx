"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { DoctorSidebar } from "./components/doctor-sidebar"
import Dashboard from "./components/dashboard"
import DoctorDashboard from "./components/doctor-dashboard"
import MedicalRecords from "./components/medical-records"
import UserInformation from "./components/user-information"
import Appointments from "./components/appointments"
import Recommendations from "./components/recommendations"
import HealthMetrics from "./components/health-metrics"
import PatientList from "./components/patient-list"
import PatientDetails from "./components/patient-details"
import DoctorSettings from "./components/doctor-settings"
import DoctorAppointments from "./components/doctor-appointments"
import DoctorAnalytics from "./components/doctor-analytics"
import LoginPage from "./components/login-page"
import SignupPage from "./components/signup-page"
import DoctorSignupPage from "./components/doctor-signup-page"
import DoctorPatientRequests from "./components/doctor-patient-requests"

export default function EHealthApp() {
  const [currentPage, setCurrentPage] = useState<"login" | "signup" | "doctor-signup" | "app">("login")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [user, setUser] = useState<any>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentPage("app")
    if (userData.userType === "doctor") {
      setActiveTab("patients")
    } else {
      setActiveTab("dashboard")
    }
  }

  const handleSignup = (userData: any) => {
    setUser(userData)
    setCurrentPage("app")
    if (userData.userType === "doctor") {
      setActiveTab("patients")
    } else {
      setActiveTab("dashboard")
    }
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage("login")
    setActiveTab("dashboard")
    setSelectedPatient(null)
  }

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser)
  }

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient)
    setActiveTab("patient-details")
  }

  const renderContent = () => {
    if (user?.userType === "doctor") {
      switch (activeTab) {
        case "patients":
          return <PatientList user={user} onSelectPatient={handleSelectPatient} />
        case "patient-details":
          return selectedPatient ? (
            <PatientDetails patient={selectedPatient} doctor={user} onBack={() => setActiveTab("patients")} />
          ) : (
            <PatientList user={user} onSelectPatient={handleSelectPatient} />
          )
        case "appointments":
          return <DoctorAppointments user={user} />
        case "analytics":
          return <DoctorAnalytics user={user} />
        case "settings":
          return <DoctorSettings user={user} onUpdateUser={handleUpdateUser} />
        case "patient-requests":
          return <DoctorPatientRequests user={user} />
        default:
          return <DoctorDashboard user={user} />
      }
    } else {
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
  }

  const SidebarComponent = user?.userType === "doctor" ? DoctorSidebar : AppSidebar

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentPage("signup")}
        onSwitchToDoctorSignup={() => setCurrentPage("doctor-signup")}
      />
    )
  }

  if (currentPage === "signup") {
    return (
      <SignupPage
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToDoctorSignup={() => setCurrentPage("doctor-signup")}
      />
    )
  }

  if (currentPage === "doctor-signup") {
    return (
      <DoctorSignupPage
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentPage("login")}
        onSwitchToPatientSignup={() => setCurrentPage("signup")}
      />
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarComponent
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          selectedPatient={selectedPatient}
        />
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
