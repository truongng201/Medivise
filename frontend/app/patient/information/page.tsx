"use client"

import { useEffect, useState } from "react"
import UserInformation from "../../components/user-information"

export default function PatientInformation() {
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

  if (!user) {
    return <div>Loading...</div>
  }

  return <UserInformation user={user} onUpdateUser={handleUpdateUser} />
}
