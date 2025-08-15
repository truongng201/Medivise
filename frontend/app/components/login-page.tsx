"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

interface LoginPageProps {
  onLogin: (userData: any) => void
  onSwitchToSignup: () => void
}

export default function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
      // Mock successful login
      const userData = {
        id: 1,
        name: "John Doe",
        email: formData.email,
        avatar: "/placeholder.svg",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1990-05-15",
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
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your health records</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
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
                    aria-describedby="email-error"
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
                    aria-describedby="password-error"
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
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="font-medium text-slate-800 hover:text-slate-700 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-slate-800">Demo Credentials</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Email: demo@healthrecord.com</p>
                <p>Password: demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
