"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import Dashboard from "../components/dashboard"

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const authDataStr = localStorage.getItem('authData')
    if(!authDataStr){
      router.push('/login')
      return
    }
    const authData = JSON.parse(authDataStr) as { 
      account: { role: string, profile_picture_url: string, email: string, account_id: number },
      accessToken: string,
      refreshToken: string
    }
    if(authData?.account.role !== 'patient'){
      router.push('/login')
      return
    }
    setUser(authDataStr)
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return <Dashboard user={user} />
}
