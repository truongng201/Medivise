"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Check,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react"

interface DoctorPatientRequestsProps {
  user: any
}

export default function DoctorPatientRequests({ user }: DoctorPatientRequestsProps) {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // Mock data for patient requests
  const patientRequests = [
    {
      id: 1,
      patientName: "Emily Rodriguez",
      age: 34,
      email: "emily.rodriguez@email.com",
      phone: "+1 (555) 234-5678",
      specialty: "Cardiology",
      reason: "Experiencing chest pain and shortness of breath during exercise. Family history of heart disease.",
      urgency: "urgent",
      requestDate: "2024-01-15",
      preferredDate: "2024-01-20",
      status: "pending",
      medicalHistory: ["Hypertension", "High Cholesterol"],
      currentMedications: ["Lisinopril 10mg", "Atorvastatin 20mg"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      patientName: "James Wilson",
      age: 28,
      email: "james.wilson@email.com",
      phone: "+1 (555) 345-6789",
      specialty: "Cardiology",
      reason: "Routine cardiac screening due to family history. Father had heart attack at age 45.",
      urgency: "routine",
      requestDate: "2024-01-14",
      preferredDate: "2024-01-25",
      status: "pending",
      medicalHistory: ["None"],
      currentMedications: ["None"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      patientName: "Sarah Thompson",
      age: 45,
      email: "sarah.thompson@email.com",
      phone: "+1 (555) 456-7890",
      specialty: "Cardiology",
      reason: "Follow-up care after recent cardiac catheterization. Need ongoing monitoring.",
      urgency: "urgent",
      requestDate: "2024-01-13",
      preferredDate: "2024-01-18",
      status: "accepted",
      medicalHistory: ["Coronary Artery Disease", "Diabetes Type 2"],
      currentMedications: ["Metformin 500mg", "Clopidogrel 75mg"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      patientName: "Michael Brown",
      age: 52,
      email: "michael.brown@email.com",
      phone: "+1 (555) 567-8901",
      specialty: "Cardiology",
      reason: "Requesting second opinion on treatment options for atrial fibrillation.",
      urgency: "routine",
      requestDate: "2024-01-12",
      preferredDate: "2024-01-30",
      status: "rejected",
      rejectionReason: "Patient requires specialized electrophysiology care not available in my practice.",
      medicalHistory: ["Atrial Fibrillation", "Hypertension"],
      currentMedications: ["Warfarin 5mg", "Metoprolol 50mg"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredRequests = patientRequests.filter((request) => {
    const matchesSearch =
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = request.status === activeTab
    return matchesSearch && matchesTab
  })

  const stats = {
    pending: patientRequests.filter((r) => r.status === "pending").length,
    accepted: patientRequests.filter((r) => r.status === "accepted").length,
    rejected: patientRequests.filter((r) => r.status === "rejected").length,
    total: patientRequests.length,
    responseRate: Math.round(
      (patientRequests.filter((r) => r.status !== "pending").length / patientRequests.length) * 100,
    ),
  }

  const handleAcceptRequest = (requestId: number) => {
    console.log("Accepting request:", requestId)
    // Handle accept logic here
  }

  const handleRejectRequest = () => {
    console.log("Rejecting request:", selectedRequest?.id, "Reason:", rejectReason)
    setShowRejectDialog(false)
    setRejectReason("")
    setSelectedRequest(null)
    // Handle reject logic here
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "destructive"
      case "urgent":
        return "default"
      case "routine":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "🚨"
      case "urgent":
        return "⚡"
      case "routine":
        return "📅"
      default:
        return "📅"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Requests</h1>
          <p className="text-gray-600">Manage incoming patient assignment requests</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.responseRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by patient name or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending ({stats.pending})</span>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Accepted ({stats.accepted})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center space-x-2">
            <UserX className="h-4 w-4" />
            <span>Rejected ({stats.rejected})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.patientName} />
                      <AvatarFallback>
                        {request.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{request.patientName}</h3>
                        <Badge variant="outline">Age {request.age}</Badge>
                        <Badge variant={getUrgencyColor(request.urgency)}>
                          {getUrgencyIcon(request.urgency)}{" "}
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{request.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{request.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>Requested: {request.requestDate}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p>
                            <strong>Specialty:</strong> {request.specialty}
                          </p>
                          <p>
                            <strong>Preferred Date:</strong> {request.preferredDate}
                          </p>
                          <p>
                            <strong>Medical History:</strong> {request.medicalHistory.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm">
                          <strong>Reason:</strong>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                      </div>
                      {request.currentMedications.length > 0 && request.currentMedications[0] !== "None" && (
                        <div className="mt-2">
                          <p className="text-sm">
                            <strong>Current Medications:</strong>
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.currentMedications.map((med, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {med}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowRejectDialog(true)
                      }}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Patient Profile - {request.patientName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.patientName} />
                              <AvatarFallback>
                                {request.patientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">{request.patientName}</h3>
                              <p className="text-gray-600">Age: {request.age}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Contact Information</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Email:</strong> {request.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {request.phone}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Request Details</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Specialty:</strong> {request.specialty}
                                </p>
                                <p>
                                  <strong>Urgency:</strong> {request.urgency}
                                </p>
                                <p>
                                  <strong>Preferred Date:</strong> {request.preferredDate}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Medical History</h4>
                            <div className="flex flex-wrap gap-2">
                              {request.medicalHistory.map((condition, index) => (
                                <Badge key={index} variant="secondary">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Current Medications</h4>
                            <div className="flex flex-wrap gap-2">
                              {request.currentMedications.map((med, index) => (
                                <Badge key={index} variant="outline">
                                  {med}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Reason for Request</h4>
                            <p className="text-sm text-gray-600">{request.reason}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.patientName} />
                      <AvatarFallback>
                        {request.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{request.patientName}</h3>
                        <Badge variant="outline">Age {request.age}</Badge>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accepted
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Specialty:</strong> {request.specialty}
                        </p>
                        <p>
                          <strong>Accepted on:</strong> {request.requestDate}
                        </p>
                        <p>
                          <strong>Reason:</strong> {request.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    View Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden border-red-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.patientName} />
                      <AvatarFallback>
                        {request.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{request.patientName}</h3>
                        <Badge variant="outline">Age {request.age}</Badge>
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Specialty:</strong> {request.specialty}
                        </p>
                        <p>
                          <strong>Rejected on:</strong> {request.requestDate}
                        </p>
                        <p>
                          <strong>Original Reason:</strong> {request.reason}
                        </p>
                        {request.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded">
                            <p>
                              <strong>Rejection Reason:</strong> {request.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Patient Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedRequest?.patientName}'s request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Explain why you cannot accept this patient (optional but recommended)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectRequest}>
              <X className="h-4 w-4 mr-2" />
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
