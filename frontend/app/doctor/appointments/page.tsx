"use client"

import { useEffect, useState } from "react"
import DoctorAppointments from "../../components/doctor-appointments"

export default function DoctorAppointmentsPage() {
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

  return <DoctorAppointments user={user} />
}
