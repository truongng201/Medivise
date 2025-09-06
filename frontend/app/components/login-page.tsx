"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, Stethoscope } from "lucide-react"

interface LoginPageProps {
  onLogin: (userData: any) => void
  onSwitchToSignup: () => void
  onSwitchToDoctorSignup: () => void
}

export default function LoginPage({ onLogin, onSwitchToSignup, onSwitchToDoctorSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userType, setUserType] = useState<"patient" | "doctor">("patient")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (userType === "patient") {
        // Mock patient login
        const userData = {
          id: 1,
          userType: "patient",
          name: "John Doe",
          email: formData.email,
          avatar: "/placeholder.svg",
          phone: "+1 (555) 123-4567",
          dateOfBirth: "1990-05-15",
          assignedDoctors: [
            { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
            { id: 2, name: "Dr. Michael Chen", specialty: "General Practice" },
          ],
          // Demographics
          age: 34,
          gender_F: false,
          gender_M: true,
          race_asian: false,
          race_black: false,
          race_white: true,
          ethnicity_hispanic: false,
          ethnicity_nonhispanic: true,
          // Lifestyle
          tobacco_smoking_status_Current_every_day_smoker: false,
          tobacco_smoking_status_Former_smoker: true,
          tobacco_smoking_status_Never_smoker: false,
          // Vitals & Clinical Measurements
          systolic_bp: 120,
          diastolic_bp: 80,
          heart_rate: 72,
          respiratory_rate: 16,
          pain_severity: 2,
          // Lab Results
          bmi: 23.5,
          calcium: 10.0,
          carbon_dioxide: 24,
          chloride: 100,
          creatinine: 1.0,
          glucose: 95,
          potassium: 4.0,
          sodium: 140,
          urea_nitrogen: 15,
          // Treatment-related
          medication_count: 2,
          // Additional fields
          bloodType: "O+",
          address: "123 Main St, Anytown, USA 12345",
          emergencyContact: "Jane Doe - +1 (555) 987-6543",
          allergies: "Penicillin, Shellfish",
          medications: "Lisinopril 10mg daily, Metformin 500mg twice daily",
          medicalConditions: "Hypertension, Type 2 Diabetes",
        }
        onLogin(userData)
      } else {
        // Mock doctor login
        const userData = {
          id: 101,
          userType: "doctor",
          name: "Dr. Sarah Johnson",
          email: formData.email,
          avatar: "/placeholder.svg",
          phone: "+1 (555) 987-6543",
          specialty: "Cardiologist",
          licenseNumber: "MD123456",
          hospital: "City General Hospital",
          department: "Cardiology",
          experience: "15 years",
          education: "Harvard Medical School",
          bio: "Experienced cardiologist specializing in interventional cardiology and heart disease prevention.",
          consultationFee: "$200",
          availableHours: "Mon-Fri 9AM-5PM",
          languages: "English, Spanish",
          patients: [
            {
              id: 1,
              name: "John Doe",
              age: 34,
              lastVisit: "2024-01-10",
              condition: "Hypertension",
              status: "stable",
            },
            {
              id: 2,
              name: "Jane Smith",
              age: 28,
              lastVisit: "2024-01-08",
              condition: "Arrhythmia",
              status: "monitoring",
            },
            {
              id: 3,
              name: "Robert Wilson",
              age: 45,
              lastVisit: "2024-01-05",
              condition: "Heart Disease",
              status: "critical",
            },
          ],
        }
        onLogin(userData)
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medivise</h1>
            <p className="text-gray-600 mt-2">Sign in to access your health platform</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your account type and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "patient" | "doctor")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Patient</span>
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Doctor</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In as Patient"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In as Doctor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have a patient account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="font-medium text-slate-800 hover:text-slate-700 underline"
                >
                  Sign up as Patient
                </button>
              </p>
              <p className="text-sm text-gray-600">
                Are you a healthcare provider?{" "}
                <button
                  onClick={onSwitchToDoctorSignup}
                  className="font-medium text-slate-800 hover:text-slate-700 underline"
                >
                  Sign up as Doctor
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        {/* <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm font-medium text-slate-800">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="space-y-1">
                  <p className="font-medium">Patient Account:</p>
                  <p>Email: patient@demo.com</p>
                  <p>Password: patient123</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Doctor Account:</p>
                  <p>Email: doctor@demo.com</p>
                  <p>Password: doctor123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
