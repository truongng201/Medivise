"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock3,
  CalendarIcon,
} from "lucide-react"

interface DoctorAppointmentsProps {
  user: any
}

export default function DoctorAppointments({ user }: DoctorAppointmentsProps) {
  const [selectedDate, setSelectedDate] = useState("today")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patient: {
        name: "John Doe",
        age: 34,
        avatar: "/placeholder.svg",
        phone: "+1 (555) 123-4567",
        condition: "Hypertension Follow-up",
      },
      date: "2024-01-15",
      time: "09:00 AM",
      duration: "30 min",
      type: "in-person",
      status: "confirmed",
      notes: "Regular blood pressure check and medication review",
    },
    {
      id: 2,
      patient: {
        name: "Jane Smith",
        age: 28,
        avatar: "/placeholder.svg",
        phone: "+1 (555) 234-5678",
        condition: "Chest Pain Consultation",
      },
      date: "2024-01-15",
      time: "10:30 AM",
      duration: "45 min",
      type: "virtual",
      status: "in-progress",
      notes: "Patient experiencing intermittent chest pain",
    },
    {
      id: 3,
      patient: {
        name: "Robert Wilson",
        age: 45,
        avatar: "/placeholder.svg",
        phone: "+1 (555) 345-6789",
        condition: "Heart Disease Management",
      },
      date: "2024-01-15",
      time: "02:00 PM",
      duration: "60 min",
      type: "in-person",
      status: "urgent",
      notes: "Emergency consultation for cardiac symptoms",
    },
    {
      id: 4,
      patient: {
        name: "Emily Johnson",
        age: 52,
        avatar: "/placeholder.svg",
        phone: "+1 (555) 456-7890",
        condition: "Routine Checkup",
      },
      date: "2024-01-15",
      time: "03:30 PM",
      duration: "30 min",
      type: "virtual",
      status: "confirmed",
      notes: "Annual cardiac health assessment",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock3 className="h-4 w-4" />
      case "urgent":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (selectedStatus !== "all" && appointment.status !== selectedStatus) {
      return false
    }
    return true
  })

  const appointmentStats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    inProgress: appointments.filter((a) => a.status === "in-progress").length,
    urgent: appointments.filter((a) => a.status === "urgent").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your patient appointments and schedule</p>
        </div>
        <Button>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Schedule New
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Today</p>
                <p className="text-2xl font-bold text-gray-900">{appointmentStats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{appointmentStats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{appointmentStats.inProgress}</p>
              </div>
              <Clock3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{appointmentStats.urgent}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={appointment.patient.avatar || "/placeholder.svg"}
                      alt={appointment.patient.name}
                    />
                    <AvatarFallback>
                      {appointment.patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
                      <span className="text-sm text-gray-500">({appointment.patient.age} years)</span>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.patient.condition}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {appointment.time} ({appointment.duration})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {appointment.type === "virtual" ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(appointment.status)} flex items-center space-x-1`}>
                    {getStatusIcon(appointment.status)}
                    <span className="capitalize">{appointment.status.replace("-", " ")}</span>
                  </Badge>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    {appointment.type === "virtual" && (
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Appointment Details</DialogTitle>
                          <DialogDescription>
                            {appointment.patient.name} - {appointment.time}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={appointment.patient.avatar || "/placeholder.svg"}
                                alt={appointment.patient.name}
                              />
                              <AvatarFallback>
                                {appointment.patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{appointment.patient.name}</h3>
                              <p className="text-sm text-gray-600">Age: {appointment.patient.age}</p>
                              <p className="text-sm text-gray-600">{appointment.patient.phone}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Condition:</span>
                              <span>{appointment.patient.condition}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Date & Time:</span>
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Duration:</span>
                              <span>{appointment.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Type:</span>
                              <span className="capitalize">{appointment.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Status:</span>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status.replace("-", " ")}
                              </Badge>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div>
                              <h4 className="font-medium mb-2">Notes:</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{appointment.notes}</p>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-4">
                            <Button className="flex-1">
                              <Phone className="h-4 w-4 mr-2" />
                              Call Patient
                            </Button>
                            {appointment.type === "virtual" && (
                              <Button variant="outline" className="flex-1 bg-transparent">
                                <Video className="h-4 w-4 mr-2" />
                                Video Call
                              </Button>
                            )}
                          </div>

                          <Button variant="outline" className="w-full bg-transparent">
                            Reschedule Appointment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600">No appointments match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
