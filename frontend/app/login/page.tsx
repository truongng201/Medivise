"use client"

import LoginPage from "../components/login-page"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const handleLogin = (userData: any) => {
    // Store user data in localStorage or context
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Redirect based on user type
    if (userData.userType === "doctor") {
      router.push("/doctor")
    } else {
      router.push("/patient")
    }
  }

  const handleSwitchToSignup = () => {
    router.push("/signup/patient")
  }

  const handleSwitchToDoctorSignup = () => {
    router.push("/signup/doctor")
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onSwitchToSignup={handleSwitchToSignup}
      onSwitchToDoctorSignup={handleSwitchToDoctorSignup}
    />
  )
}
