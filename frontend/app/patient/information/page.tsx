"use client"

import { useEffect, useState } from "react"
import UserInformation from "./user-information"
import { useRequireAuth } from "@/contexts/auth-context"
import { AuthManager } from "@/lib/auth"

export default function PatientInformation() {
  const [patientInfo, setPatientInfo] = useState<any>(null)
    const [isLoadingInfo, setIsLoadingInfo] = useState(true)
    const [error, setError] = useState("")
    const { authData, isAuthenticated, isLoading } = useRequireAuth('patient')
  
    useEffect(() => {
      const fetchPatientInfo = async () => {
        if (!isAuthenticated || !authData) return
  
        try {
          setIsLoadingInfo(true)
          const info = await AuthManager.getPatientInfo()
          setPatientInfo(info)
          setError("")
        } catch (error) {
          console.error('Error fetching patient info:', error)
          setError("Failed to load patient information")
        } finally {
          setIsLoadingInfo(false)
        }
      }
      if (isAuthenticated) {
        fetchPatientInfo()
      }
    }, [isAuthenticated, authData])
  
    if (isLoading || isLoadingInfo) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }
  
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

  return <UserInformation user={patientInfo}/>
}
