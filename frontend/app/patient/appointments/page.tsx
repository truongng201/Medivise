"use client"

import { useEffect, useState } from "react"
import Appointments from "../../components/appointments"

export default function PatientAppointments() {
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

  return <Appointments user={user} />
}
