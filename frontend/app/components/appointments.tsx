"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Video,
} from "lucide-react"

interface AppointmentsProps {
  user: any
}

export default function Appointments({ user }: AppointmentsProps) {
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "30 minutes",
      type: "Follow-up",
      status: "confirmed",
      location: "Heart Center, Room 205",
      phone: "+1 (555) 123-4567",
      notes: "Follow-up for blood pressure monitoring",
      reason: "Hypertension follow-up",
      isVirtual: false,
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "General Practice",
      date: "2024-01-22",
      time: "2:30 PM",
      duration: "45 minutes",
      type: "Annual Physical",
      status: "confirmed",
      location: "Main Clinic, Room 101",
      phone: "+1 (555) 987-6543",
      notes: "Annual comprehensive physical examination",
      reason: "Routine checkup",
      isVirtual: false,
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Endocrinologist",
      date: "2024-01-28",
      time: "11:15 AM",
      duration: "30 minutes",
      type: "Consultation",
      status: "pending",
      location: "Virtual Appointment",
      phone: "+1 (555) 456-7890",
      notes: "Diabetes management consultation",
      reason: "Diabetes follow-up",
      isVirtual: true,
    },
    {
      id: 4,
      doctor: "Dr. James Wilson",
      specialty: "Orthopedist",
      date: "2024-02-05",
      time: "9:00 AM",
      duration: "60 minutes",
      type: "Treatment",
      status: "scheduled",
      location: "Orthopedic Center, Room 302",
      phone: "+1 (555) 321-0987",
      notes: "Physical therapy session for knee rehabilitation",
      reason: "Knee injury follow-up",
      isVirtual: false,
    },
  ])

  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    type: "",
    reason: "",
    notes: "",
    isVirtual: false,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-slate-100 text-slate-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-slate-600" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || appointment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleNewAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const appointment = {
      id: appointments.length + 1,
      ...newAppointment,
      status: "pending",
      duration: "30 minutes",
      location: newAppointment.isVirtual ? "Virtual Appointment" : "TBD",
      phone: "+1 (555) 000-0000",
    }
    setAppointments([...appointments, appointment])
    setNewAppointment({
      doctor: "",
      specialty: "",
      date: "",
      time: "",
      type: "",
      reason: "",
      notes: "",
      isVirtual: false,
    })
    setShowNewAppointmentDialog(false)
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowAppointmentDetails(true)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your medical appointments and consultations</p>
        </div>
        <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
          <DialogTrigger asChild>
            <Button className="bg-slate-800 hover:bg-slate-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Fill in the details for your new appointment</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewAppointmentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input
                  id="doctor"
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select
                  value={newAppointment.specialty}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, specialty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Practice">General Practice</SelectItem>
                    <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="Endocrinologist">Endocrinologist</SelectItem>
                    <SelectItem value="Orthopedist">Orthopedist</SelectItem>
                    <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select
                  value={newAppointment.type}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Annual Physical">Annual Physical</SelectItem>
                    <SelectItem value="Treatment">Treatment</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                  placeholder="Brief description of the reason"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="Any additional information"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVirtual"
                  checked={newAppointment.isVirtual}
                  onChange={(e) => setNewAppointment({ ...newAppointment, isVirtual: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isVirtual">Virtual appointment</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-800 hover:bg-slate-700">
                  Schedule Appointment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search appointments..."
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
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No appointments found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="focus-within:ring-2 focus-within:ring-slate-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      {appointment.isVirtual ? (
                        <Video className="h-6 w-6 text-slate-600" />
                      ) : (
                        <Stethoscope className="h-6 w-6 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                      <p className="text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(appointment.status)}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(appointment.status)}
                        <span>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                      </span>
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Complete information about your appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Doctor Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedAppointment.doctor}
                    </p>
                    <p>
                      <strong>Specialty:</strong> {selectedAppointment.specialty}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedAppointment.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Appointment Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Date:</strong> {selectedAppointment.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {selectedAppointment.time}
                    </p>
                    <p>
                      <strong>Duration:</strong> {selectedAppointment.duration}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedAppointment.type}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedAppointment.location}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reason for Visit</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.reason}</p>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge className={getStatusColor(selectedAppointment.status)}>
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(selectedAppointment.status)}
                    <span>
                      {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                    </span>
                  </span>
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    Cancel
                  </Button>
                  {selectedAppointment.isVirtual && (
                    <Button size="sm" className="bg-slate-800 hover:bg-slate-700">
                      Join Virtual Meeting
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
