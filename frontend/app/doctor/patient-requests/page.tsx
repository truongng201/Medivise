"use client"

import { useEffect, useState } from "react"
import DoctorPatientRequests from "./doctor-patient-requests"

export default function DoctorPatientRequestsPage() {
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

  return <DoctorPatientRequests user={user} />
}
