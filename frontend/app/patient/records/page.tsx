"use client"

import { useEffect, useState } from "react"
import MedicalRecords from "./medical-records"

export default function PatientRecords() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // if (!user) {
  //   return <div>Loading...</div>
  // }

  return <MedicalRecords user={user} onUpdateUser={handleUpdateUser} />
}
