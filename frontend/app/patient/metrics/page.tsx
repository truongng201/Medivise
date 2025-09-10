"use client"

import { useEffect, useState } from "react"
import HealthMetrics from "./health-metrics"

export default function PatientMetrics() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // if (!user) {
  //   return <div>Loading...</div>
  // }

  return <HealthMetrics user={user} />
}
