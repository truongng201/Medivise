"use client"

import { useEffect, useState } from "react"
import DoctorDashboard from "../components/doctor-dashboard"

export default function DoctorDashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return <DoctorDashboard user={user} />
}
