"use client"

import { useEffect, useState } from "react"
import DoctorAnalytics from "../../components/doctor-analytics"

export default function DoctorAnalyticsPage() {
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

  return <DoctorAnalytics user={user} />
}
