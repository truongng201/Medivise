"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Camera, User, Heart, Shield, Bell, Save, CheckCircle, Phone, Calendar, Activity } from "lucide-react"

interface UserInformationProps {
  user: any
  onUpdateUser: (userData: any) => void
}

export default function UserInformation({ user, onUpdateUser }: UserInformationProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    emergencyContact: user?.emergencyContact || "",
    bloodType: user?.bloodType || "",
    dateOfBirth: user?.dateOfBirth || "",
    allergies: user?.allergies || "",
    medications: user?.medications || "",
    medicalConditions: user?.medicalConditions || "",
    // Demographics
    age: user?.age || "",
    gender_F: user?.gender_F || false,
    gender_M: user?.gender_M || false,
    race_asian: user?.race_asian || false,
    race_black: user?.race_black || false,
    race_white: user?.race_white || false,
    ethnicity_hispanic: user?.ethnicity_hispanic || false,
    ethnicity_nonhispanic: user?.ethnicity_nonhispanic || false,
    // Lifestyle
    tobacco_smoking_status_Current_every_day_smoker: user?.tobacco_smoking_status_Current_every_day_smoker || false,
    tobacco_smoking_status_Former_smoker: user?.tobacco_smoking_status_Former_smoker || false,
    tobacco_smoking_status_Never_smoker: user?.tobacco_smoking_status_Never_smoker || false,
    // Vitals & Clinical Measurements
    systolic_bp: user?.systolic_bp || "",
    diastolic_bp: user?.diastolic_bp || "",
    heart_rate: user?.heart_rate || "",
    respiratory_rate: user?.respiratory_rate || "",
    pain_severity: user?.pain_severity || "",
    // Lab Results
    bmi: user?.bmi || "",
    calcium: user?.calcium || "",
    carbon_dioxide: user?.carbon_dioxide || "",
    chloride: user?.chloride || "",
    creatinine: user?.creatinine || "",
    glucose: user?.glucose || "",
    potassium: user?.potassium || "",
    sodium: user?.sodium || "",
    urea_nitrogen: user?.urea_nitrogen || "",
    // Treatment-related
    medication_count: user?.medication_count || "",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    healthTips: false,
  })

  const [privacy, setPrivacy] = useState({
    shareDataWithDoctors: true,
    shareDataForResearch: false,
    allowDataExport: true,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSuccessMessage("")

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...user,
        ...formData,
        notifications,
        privacy,
      }
      onUpdateUser(updatedUser)
      setSuccessMessage("Profile updated successfully!")
      setIsLoading(false)
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 1000)
  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Information</h1>
          <p className="text-gray-600">Manage your personal and medical information for predictive health analysis</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-slate-800 hover:bg-slate-700 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? "Saving..." : "Save Changes"}</span>
        </Button>
      </div>

      {successMessage && (
        <Alert className="bg-slate-50 border-slate-200">
          <CheckCircle className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-slate-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Profile Overview Card */}
      <Card className="focus-within:ring-slate-500">
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={`Profile picture of ${user?.name}`} />
              <AvatarFallback className="text-lg" aria-label={`Initials for ${user?.name}`}>
                {user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm text-gray-700 font-medium">
                    Age: <span className="font-semibold">{formData.age || calculateAge(formData.dateOfBirth)}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm text-gray-700 font-medium">
                    {formData.gender_M ? "Male" : formData.gender_F ? "Female" : "Not specified"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm text-gray-700 font-medium">
                    BMI: <span className="font-semibold">{formData.bmi || "N/A"}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm text-gray-700 font-medium">{formData.phone || "Not provided"}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Camera className="h-4 w-4" />
              <span>Change Photo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="demographics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="vitals">Vitals & Labs</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Demographics</span>
              </CardTitle>
              <CardDescription>Basic demographic information for health analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <Label>Gender</Label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gender_M"
                      checked={formData.gender_M}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange("gender_M", checked as boolean)
                        if (checked) handleCheckboxChange("gender_F", false)
                      }}
                    />
                    <Label htmlFor="gender_M">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gender_F"
                      checked={formData.gender_F}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange("gender_F", checked as boolean)
                        if (checked) handleCheckboxChange("gender_M", false)
                      }}
                    />
                    <Label htmlFor="gender_F">Female</Label>
                  </div>
                </div>
              </div>

              {/* Race */}
              <div className="space-y-3">
                <Label>Race</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="race_asian"
                      checked={formData.race_asian}
                      onCheckedChange={(checked) => handleCheckboxChange("race_asian", checked as boolean)}
                    />
                    <Label htmlFor="race_asian">Asian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="race_black"
                      checked={formData.race_black}
                      onCheckedChange={(checked) => handleCheckboxChange("race_black", checked as boolean)}
                    />
                    <Label htmlFor="race_black">Black</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="race_white"
                      checked={formData.race_white}
                      onCheckedChange={(checked) => handleCheckboxChange("race_white", checked as boolean)}
                    />
                    <Label htmlFor="race_white">White</Label>
                  </div>
                </div>
              </div>

              {/* Ethnicity */}
              <div className="space-y-3">
                <Label>Ethnicity</Label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ethnicity_hispanic"
                      checked={formData.ethnicity_hispanic}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange("ethnicity_hispanic", checked as boolean)
                        if (checked) handleCheckboxChange("ethnicity_nonhispanic", false)
                      }}
                    />
                    <Label htmlFor="ethnicity_hispanic">Hispanic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ethnicity_nonhispanic"
                      checked={formData.ethnicity_nonhispanic}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange("ethnicity_nonhispanic", checked as boolean)
                        if (checked) handleCheckboxChange("ethnicity_hispanic", false)
                      }}
                    />
                    <Label htmlFor="ethnicity_nonhispanic">Non-Hispanic</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input
                    id="bloodType"
                    value={formData.bloodType}
                    onChange={(e) => handleInputChange("bloodType", e.target.value)}
                    placeholder="e.g., O+, A-, B+"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your full address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Name and phone number"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals & Labs Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Vitals & Clinical Measurements</span>
              </CardTitle>
              <CardDescription>Current vital signs and laboratory results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic_bp">Systolic BP (mmHg)</Label>
                    <Input
                      id="systolic_bp"
                      type="number"
                      value={formData.systolic_bp}
                      onChange={(e) => handleInputChange("systolic_bp", e.target.value)}
                      placeholder="120"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diastolic_bp">Diastolic BP (mmHg)</Label>
                    <Input
                      id="diastolic_bp"
                      type="number"
                      value={formData.diastolic_bp}
                      onChange={(e) => handleInputChange("diastolic_bp", e.target.value)}
                      placeholder="80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heart_rate">Heart Rate (BPM)</Label>
                    <Input
                      id="heart_rate"
                      type="number"
                      value={formData.heart_rate}
                      onChange={(e) => handleInputChange("heart_rate", e.target.value)}
                      placeholder="72"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="respiratory_rate">Respiratory Rate (breaths/min)</Label>
                    <Input
                      id="respiratory_rate"
                      type="number"
                      value={formData.respiratory_rate}
                      onChange={(e) => handleInputChange("respiratory_rate", e.target.value)}
                      placeholder="16"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pain_severity">Pain Severity (0-10)</Label>
                    <Input
                      id="pain_severity"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.pain_severity}
                      onChange={(e) => handleInputChange("pain_severity", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI</Label>
                    <Input
                      id="bmi"
                      type="number"
                      step="0.1"
                      value={formData.bmi}
                      onChange={(e) => handleInputChange("bmi", e.target.value)}
                      placeholder="23.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                    <Input
                      id="glucose"
                      type="number"
                      step="0.1"
                      value={formData.glucose}
                      onChange={(e) => handleInputChange("glucose", e.target.value)}
                      placeholder="95"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                    <Input
                      id="creatinine"
                      type="number"
                      step="0.01"
                      value={formData.creatinine}
                      onChange={(e) => handleInputChange("creatinine", e.target.value)}
                      placeholder="1.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urea_nitrogen">Urea Nitrogen (mg/dL)</Label>
                    <Input
                      id="urea_nitrogen"
                      type="number"
                      step="0.1"
                      value={formData.urea_nitrogen}
                      onChange={(e) => handleInputChange("urea_nitrogen", e.target.value)}
                      placeholder="15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sodium">Sodium (mEq/L)</Label>
                    <Input
                      id="sodium"
                      type="number"
                      step="0.1"
                      value={formData.sodium}
                      onChange={(e) => handleInputChange("sodium", e.target.value)}
                      placeholder="140"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (mEq/L)</Label>
                    <Input
                      id="potassium"
                      type="number"
                      step="0.1"
                      value={formData.potassium}
                      onChange={(e) => handleInputChange("potassium", e.target.value)}
                      placeholder="4.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chloride">Chloride (mEq/L)</Label>
                    <Input
                      id="chloride"
                      type="number"
                      step="0.1"
                      value={formData.chloride}
                      onChange={(e) => handleInputChange("chloride", e.target.value)}
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calcium">Calcium (mg/dL)</Label>
                    <Input
                      id="calcium"
                      type="number"
                      step="0.1"
                      value={formData.calcium}
                      onChange={(e) => handleInputChange("calcium", e.target.value)}
                      placeholder="10.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carbon_dioxide">Carbon Dioxide (mEq/L)</Label>
                    <Input
                      id="carbon_dioxide"
                      type="number"
                      step="0.1"
                      value={formData.carbon_dioxide}
                      onChange={(e) => handleInputChange("carbon_dioxide", e.target.value)}
                      placeholder="24"
                    />
                  </div>
                </div>
              </div>

              {/* Treatment-related */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication_count">Number of Medications</Label>
                    <Input
                      id="medication_count"
                      type="number"
                      value={formData.medication_count}
                      onChange={(e) => handleInputChange("medication_count", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      placeholder="List any allergies (medications, food, environmental, etc.)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      placeholder="List current medications with dosages"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <Textarea
                      id="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                      placeholder="List any chronic conditions or medical history"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lifestyle Tab */}
        <TabsContent value="lifestyle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Lifestyle Factors</span>
              </CardTitle>
              <CardDescription>Lifestyle information for health risk assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tobacco Smoking Status */}
              <div className="space-y-3">
                <Label>Tobacco Smoking Status</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tobacco_current"
                      checked={formData.tobacco_smoking_status_Current_every_day_smoker}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange("tobacco_smoking_status_Current_every_day_smoker", checked as boolean)
                        if (checked) {
                          handleCheckboxChange("tobacco_smoking_status_Former_smoker", false)
                          handleCheckboxChange("tobacco_smoking_status_Never_smoker", false)
                        }
                      }}
                    />
                    <Label htmlFor="tobacco_current">Current every day smoker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tobacco_former"
                      checked={formData.tobacco_smoking_status_Former_smoker}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange("tobacco_smoking_status_Former_smoker", checked as boolean)
                        if (checked) {
                          handleCheckboxChange("tobacco_smoking_status_Current_every_day_smoker", false)
                          handleCheckboxChange("tobacco_smoking_status_Never_smoker", false)
                        }
                      }}
                    />
                    <Label htmlFor="tobacco_former">Former smoker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tobacco_never"
                      checked={formData.tobacco_smoking_status_Never_smoker}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange("tobacco_smoking_status_Never_smoker", checked as boolean)
                        if (checked) {
                          handleCheckboxChange("tobacco_smoking_status_Current_every_day_smoker", false)
                          handleCheckboxChange("tobacco_smoking_status_Former_smoker", false)
                        }
                      }}
                    />
                    <Label htmlFor="tobacco_never">Never smoker</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <Button
                    variant={notifications.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("emailNotifications", !notifications.emailNotifications)}
                  >
                    {notifications.emailNotifications ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive text message alerts</p>
                  </div>
                  <Button
                    variant={notifications.smsNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("smsNotifications", !notifications.smsNotifications)}
                  >
                    {notifications.smsNotifications ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Appointment Reminders</h4>
                    <p className="text-sm text-gray-600">Get reminded about upcoming appointments</p>
                  </div>
                  <Button
                    variant={notifications.appointmentReminders ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      handleNotificationChange("appointmentReminders", !notifications.appointmentReminders)
                    }
                  >
                    {notifications.appointmentReminders ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Medication Reminders</h4>
                    <p className="text-sm text-gray-600">Never miss your medication schedule</p>
                  </div>
                  <Button
                    variant={notifications.medicationReminders ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("medicationReminders", !notifications.medicationReminders)}
                  >
                    {notifications.medicationReminders ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Health Tips</h4>
                    <p className="text-sm text-gray-600">Receive personalized health recommendations</p>
                  </div>
                  <Button
                    variant={notifications.healthTips ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("healthTips", !notifications.healthTips)}
                  >
                    {notifications.healthTips ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
              <CardDescription>Control how your data is used and shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Share Data with Healthcare Providers</h4>
                    <p className="text-sm text-gray-600">Allow your doctors to access your health records</p>
                  </div>
                  <Button
                    variant={privacy.shareDataWithDoctors ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePrivacyChange("shareDataWithDoctors", !privacy.shareDataWithDoctors)}
                  >
                    {privacy.shareDataWithDoctors ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Contribute to Medical Research</h4>
                    <p className="text-sm text-gray-600">Help improve healthcare through anonymized data</p>
                  </div>
                  <Button
                    variant={privacy.shareDataForResearch ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePrivacyChange("shareDataForResearch", !privacy.shareDataForResearch)}
                  >
                    {privacy.shareDataForResearch ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow Data Export</h4>
                    <p className="text-sm text-gray-600">Enable downloading your complete health records</p>
                  </div>
                  <Button
                    variant={privacy.allowDataExport ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePrivacyChange("allowDataExport", !privacy.allowDataExport)}
                  >
                    {privacy.allowDataExport ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
