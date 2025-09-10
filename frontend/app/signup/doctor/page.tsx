"use client"

import DoctorSignupPage from "../patient/doctor-signup-page"
import { useRouter } from "next/navigation"

export default function DoctorSignup() {
  const router = useRouter()

  const handleSwitchToLogin = () => {
    router.push("/login")
  }

  const handleSwitchToPatientSignup = () => {
    router.push("/signup/patient")
  }

  return (
    <DoctorSignupPage
      onSwitchToLogin={handleSwitchToLogin}
      onSwitchToPatientSignup={handleSwitchToPatientSignup}
    />
  )
}
