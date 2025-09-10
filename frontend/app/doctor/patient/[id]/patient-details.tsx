"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, User, Heart, FileText, Calendar, Phone, Mail, AlertTriangle, Pill } from "lucide-react"

interface PatientDetailsProps {
  patient: any
  doctor: any
  onBack: () => void
}

export default function PatientDetails({ patient, doctor, onBack }: PatientDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "monitoring":
        return "bg-yellow-100 text-yellow-800"
      case "stable":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const vitals = [
    { name: "Blood Pressure", value: `${patient.systolic_bp}/${patient.diastolic_bp}`, unit: "mmHg", status: "normal" },
    { name: "Heart Rate", value: patient.heart_rate, unit: "BPM", status: "normal" },
    { name: "BMI", value: patient.bmi, unit: "", status: "normal" },
    { name: "Glucose", value: patient.glucose, unit: "mg/dL", status: "normal" },
  ]

  const recentVisits = [
    {
      date: "2024-01-10",
      type: "Follow-up",
      notes: "Blood pressure stable, continue current medication",
      doctor: doctor.name,
    },
    {
      date: "2024-01-03",
      type: "Consultation",
      notes: "Initial assessment for hypertension management",
      doctor: doctor.name,
    },
    {
      date: "2023-12-20",
      type: "Lab Results",
      notes: "Comprehensive metabolic panel - all values within normal range",
      doctor: doctor.name,
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Patients</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
            <p className="text-gray-600">Comprehensive patient information and medical history</p>
          </div>
        </div>
        <Badge className={getStatusColor(patient.status)}>
          <span className="flex items-center space-x-1">
            <span>{patient.status === "critical" ? "🔴" : patient.status === "monitoring" ? "🟡" : "🟢"}</span>
            <span>{patient.status}</span>
          </span>
        </Badge>
      </div>

      {/* Patient Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback className="text-lg">
                {patient.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{patient.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">Age: {patient.age}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">Last: {patient.lastVisit}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vitals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vitals">Vitals & Labs</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="visits">Visit History</TabsTrigger>
        </TabsList>

        {/* Vitals & Labs Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vitals.map((vital, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Heart className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{vital.name}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {vital.value} {vital.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge className="bg-slate-100 text-slate-800">Normal</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vital Signs Trend</CardTitle>
              <CardDescription>Patient's vital signs over the last 3 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Blood Pressure Control</span>
                  <span className="text-sm text-gray-600">85% in target range</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Heart Rate Variability</span>
                  <span className="text-sm text-gray-600">92% normal</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Medical Conditions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{patient.condition}</h4>
                  <p className="text-sm text-gray-600 mt-1">Primary diagnosis - Currently {patient.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {patient.allergies.split(", ").map((allergy: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">{allergy}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Current Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.medications.split(", ").map((medication: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{medication}</p>
                      <p className="text-sm text-gray-600">Active prescription</p>
                    </div>
                    <Badge className="bg-slate-100 text-slate-800">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visit History Tab */}
        <TabsContent value="visits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Visits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVisits.map((visit, index) => (
                  <div key={index} className="border-l-4 border-slate-200 pl-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{visit.type}</h4>
                      <span className="text-sm text-gray-500">{visit.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{visit.notes}</p>
                    <p className="text-xs text-gray-500">Seen by: {visit.doctor}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
