"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PatientList from "./patient-list"

export default function DoctorPatients() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSelectPatient = (patient: any) => {
    // Store selected patient in localStorage temporarily
    localStorage.setItem('selectedPatient', JSON.stringify(patient))
    router.push(`/doctor/patient/${patient.id}`)
  }

  // if (!user) {
  //   return <div>Loading...</div>
  // }

  return <PatientList user={user} onSelectPatient={handleSelectPatient} />
}
