"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Users, Eye, Phone, Mail } from "lucide-react"

interface PatientListProps {
  user: any
  onSelectPatient: (patient: any) => void
}

export default function PatientList({ user, onSelectPatient }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock expanded patient data
  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 34,
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-01-15",
      condition: "Hypertension",
      status: "stable",
      avatar: "/placeholder.svg",
      // Full patient data
      gender_M: true,
      gender_F: false,
      systolic_bp: 125,
      diastolic_bp: 82,
      heart_rate: 72,
      bmi: 23.5,
      glucose: 95,
      medications: "Lisinopril 10mg daily",
      allergies: "Penicillin",
      assignedDoctors: [{ id: user?.id, name: user?.name, specialty: user?.specialty }],
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 28,
      email: "jane.smith@email.com",
      phone: "+1 (555) 234-5678",
      lastVisit: "2024-01-08",
      nextAppointment: "2024-01-18",
      condition: "Arrhythmia",
      status: "monitoring",
      avatar: "/placeholder.svg",
      gender_M: false,
      gender_F: true,
      systolic_bp: 118,
      diastolic_bp: 75,
      heart_rate: 88,
      bmi: 22.1,
      glucose: 92,
      medications: "Metoprolol 25mg twice daily",
      allergies: "None known",
      assignedDoctors: [{ id: user?.id, name: user?.name, specialty: user?.specialty }],
    },
    {
      id: 3,
      name: "Robert Wilson",
      age: 45,
      email: "robert.wilson@email.com",
      phone: "+1 (555) 345-6789",
      lastVisit: "2024-01-05",
      nextAppointment: "2024-01-12",
      condition: "Heart Disease",
      status: "critical",
      avatar: "/placeholder.svg",
      gender_M: true,
      gender_F: false,
      systolic_bp: 145,
      diastolic_bp: 95,
      heart_rate: 95,
      bmi: 28.3,
      glucose: 110,
      medications: "Atorvastatin 40mg, Carvedilol 12.5mg",
      allergies: "Shellfish, Aspirin",
      assignedDoctors: [{ id: user?.id, name: user?.name, specialty: user?.specialty }],
    },
    {
      id: 4,
      name: "Maria Garcia",
      age: 52,
      email: "maria.garcia@email.com",
      phone: "+1 (555) 456-7890",
      lastVisit: "2024-01-03",
      nextAppointment: "2024-01-20",
      condition: "Diabetes Type 2",
      status: "stable",
      avatar: "/placeholder.svg",
      gender_M: false,
      gender_F: true,
      systolic_bp: 130,
      diastolic_bp: 85,
      heart_rate: 78,
      bmi: 26.7,
      glucose: 145,
      medications: "Metformin 1000mg twice daily",
      allergies: "Sulfa drugs",
      assignedDoctors: [{ id: user?.id, name: user?.name, specialty: user?.specialty }],
    },
  ]

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return "🔴"
      case "monitoring":
        return "🟡"
      case "stable":
        return "🟢"
      default:
        return "⚪"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage and monitor your assigned patients</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{filteredPatients.length} Patients</span>
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="stable">Stable</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                    <AvatarFallback>
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      Age {patient.age} • {patient.condition}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  <span className="flex items-center space-x-1">
                    <span>{getStatusIcon(patient.status)}</span>
                    <span>{patient.status}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Visit</p>
                    <p className="font-medium">{patient.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Appointment</p>
                    <p className="font-medium">{patient.nextAppointment}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{patient.phone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-600">Vitals</p>
                      <p className="font-medium">
                        BP: {patient.systolic_bp}/{patient.diastolic_bp} • HR: {patient.heart_rate}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectPatient(patient)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No patients found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
