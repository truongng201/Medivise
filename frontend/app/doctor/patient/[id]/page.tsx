"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import PatientDetails from "../../../components/patient-details"

export default function DoctorPatientDetails() {
  const [user, setUser] = useState<any>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const patientData = localStorage.getItem('selectedPatient')
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    if (patientData) {
      setSelectedPatient(JSON.parse(patientData))
    }
  }, [])

  const handleBack = () => {
    localStorage.removeItem('selectedPatient')
    router.push('/doctor/patients')
  }

  if (!user || !selectedPatient) {
    return <div>Loading...</div>
  }

  return (
    <PatientDetails
      patient={selectedPatient}
      doctor={user}
      onBack={handleBack}
    />
  )
}
