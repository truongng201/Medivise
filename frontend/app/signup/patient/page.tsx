"use client"

import SignupPage from "./signup-page"
import { useRouter } from "next/navigation"

export default function PatientSignup() {
  const router = useRouter()

  const handleSignup = (userData: any) => {
    // Store user data in localStorage or context
    localStorage.setItem('user', JSON.stringify(userData))
    router.push("/patient")
  }

  const handleSwitchToLogin = () => {
    router.push("/login")
  }

  const handleSwitchToDoctorSignup = () => {
    router.push("/signup/doctor")
  }

  return (
    <SignupPage
      onSignup={handleSignup}
      onSwitchToLogin={handleSwitchToLogin}
      onSwitchToDoctorSignup={handleSwitchToDoctorSignup}
    />
  )
}
