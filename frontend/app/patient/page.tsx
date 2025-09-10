"use client"

import { useEffect, useState } from "react"
import Dashboard from "../components/dashboard"

export default function PatientDashboard() {
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

  return <Dashboard user={user} />
}
