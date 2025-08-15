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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Activity,
  Heart,
  TestTube,
  ImageIcon,
  CheckCircle,
} from "lucide-react"

interface MedicalRecordsProps {
  user: any
  onUpdateUser: (userData: any) => void
}

export default function MedicalRecords({ user, onUpdateUser }: MedicalRecordsProps) {
  const [showNewRecordDialog, setShowNewRecordDialog] = useState(false)
  const [showRecordDetails, setShowRecordDetails] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [successMessage, setSuccessMessage] = useState("")

  const [records, setRecords] = useState([
    {
      id: 1,
      title: "Annual Physical Examination",
      type: "examination",
      date: "2024-01-10",
      doctor: "Dr. Michael Chen",
      facility: "Main Clinic",
      category: "Routine Care",
      summary: "Comprehensive annual physical examination with normal findings",
      details:
        "Patient underwent complete physical examination including vital signs, cardiovascular, respiratory, abdominal, and neurological assessments. All systems within normal limits.",
      attachments: ["physical_exam_2024.pdf"],
      priority: "normal",
    },
    {
      id: 2,
      title: "Blood Pressure Monitoring",
      type: "vital_signs",
      date: "2024-01-08",
      doctor: "Dr. Sarah Johnson",
      facility: "Heart Center",
      category: "Cardiovascular",
      summary: "Blood pressure reading: 125/82 mmHg - slightly elevated",
      details:
        "Patient's blood pressure measured at 125/82 mmHg. Slight elevation noted. Recommended lifestyle modifications and follow-up in 2 weeks.",
      attachments: [],
      priority: "medium",
    },
    {
      id: 3,
      title: "Laboratory Results - Comprehensive Metabolic Panel",
      type: "lab_results",
      date: "2024-01-05",
      doctor: "Dr. Emily Rodriguez",
      facility: "Lab Services",
      category: "Laboratory",
      summary: "CMP results showing normal glucose and kidney function",
      details:
        "Comprehensive metabolic panel results: Glucose 95 mg/dL, Creatinine 1.0 mg/dL, BUN 15 mg/dL, all electrolytes within normal range.",
      attachments: ["lab_results_cmp_2024.pdf"],
      priority: "normal",
    },
    {
      id: 4,
      title: "Prescription - Lisinopril",
      type: "prescription",
      date: "2024-01-03",
      doctor: "Dr. Sarah Johnson",
      facility: "Heart Center",
      category: "Medication",
      summary: "Prescribed Lisinopril 10mg daily for hypertension management",
      details:
        "Patient prescribed Lisinopril 10mg once daily for blood pressure management. Instructions provided for monitoring and potential side effects.",
      attachments: ["prescription_lisinopril.pdf"],
      priority: "high",
    },
  ])

  const [newRecord, setNewRecord] = useState({
    title: "",
    type: "",
    date: "",
    doctor: "",
    facility: "",
    category: "",
    summary: "",
    details: "",
    priority: "normal",
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "examination":
        return <Stethoscope className="h-5 w-5 text-slate-600" />
      case "lab_results":
        return <TestTube className="h-5 w-5 text-slate-600" />
      case "prescription":
        return <Pill className="h-5 w-5 text-slate-600" />
      case "vital_signs":
        return <Heart className="h-5 w-5 text-slate-600" />
      case "imaging":
        return <ImageIcon className="h-5 w-5 text-slate-600" />
      default:
        return <FileText className="h-5 w-5 text-slate-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "normal":
        return "bg-slate-100 text-slate-800 border-slate-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || record.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleNewRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const record = {
      id: records.length + 1,
      ...newRecord,
      attachments: [],
    }
    setRecords([...records, record])
    setNewRecord({
      title: "",
      type: "",
      date: "",
      doctor: "",
      facility: "",
      category: "",
      summary: "",
      details: "",
      priority: "normal",
    })
    setShowNewRecordDialog(false)
    setSuccessMessage("Medical record added successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record)
    setShowRecordDetails(true)
  }

  const handleDeleteRecord = (recordId: number) => {
    setRecords(records.filter((record) => record.id !== recordId))
    setSuccessMessage("Medical record deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600">Manage and view your complete medical history</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </Button>
          <Dialog open={showNewRecordDialog} onOpenChange={setShowNewRecordDialog}>
            <DialogTrigger asChild>
              <Button className="bg-slate-800 hover:bg-slate-700 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Record</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Medical Record</DialogTitle>
                <DialogDescription>Enter the details for the new medical record</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewRecordSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Record Title</Label>
                    <Input
                      id="title"
                      value={newRecord.title}
                      onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                      placeholder="e.g., Annual Physical Exam"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Record Type</Label>
                    <Select
                      value={newRecord.type}
                      onValueChange={(value) => setNewRecord({ ...newRecord, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="examination">Examination</SelectItem>
                        <SelectItem value="lab_results">Lab Results</SelectItem>
                        <SelectItem value="prescription">Prescription</SelectItem>
                        <SelectItem value="vital_signs">Vital Signs</SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor/Provider</Label>
                    <Input
                      id="doctor"
                      value={newRecord.doctor}
                      onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
                      placeholder="Dr. John Smith"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facility">Facility</Label>
                    <Input
                      id="facility"
                      value={newRecord.facility}
                      onChange={(e) => setNewRecord({ ...newRecord, facility: e.target.value })}
                      placeholder="Hospital/Clinic name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newRecord.category}
                      onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                      placeholder="e.g., Cardiology, Laboratory"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Input
                    id="summary"
                    value={newRecord.summary}
                    onChange={(e) => setNewRecord({ ...newRecord, summary: e.target.value })}
                    placeholder="Brief summary of the record"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Detailed Notes</Label>
                  <Textarea
                    id="details"
                    value={newRecord.details}
                    onChange={(e) => setNewRecord({ ...newRecord, details: e.target.value })}
                    placeholder="Detailed information about the medical record"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newRecord.priority}
                    onValueChange={(value) => setNewRecord({ ...newRecord, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowNewRecordDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-slate-800 hover:bg-slate-700">
                    Add Record
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {successMessage && (
        <Alert className="bg-slate-50 border-slate-200">
          <CheckCircle className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-slate-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medical records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="examination">Examinations</SelectItem>
            <SelectItem value="lab_results">Lab Results</SelectItem>
            <SelectItem value="prescription">Prescriptions</SelectItem>
            <SelectItem value="vital_signs">Vital Signs</SelectItem>
            <SelectItem value="imaging">Imaging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medical records found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} className="focus-within:ring-2 focus-within:ring-slate-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-slate-100 rounded-lg">{getTypeIcon(record.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        <Badge className={getPriorityColor(record.priority)}>
                          {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed">{record.summary}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{record.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{record.doctor}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Activity className="h-4 w-4" />
                          <span>{record.category}</span>
                        </span>
                        {record.attachments.length > 0 && (
                          <span className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{record.attachments.length} attachment(s)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(record)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Record Details Dialog */}
      <Dialog open={showRecordDetails} onOpenChange={setShowRecordDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>Complete information about this medical record</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Record Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Title:</strong> {selectedRecord.title}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedRecord.type.replace("_", " ").toUpperCase()}
                    </p>
                    <p>
                      <strong>Date:</strong> {selectedRecord.date}
                    </p>
                    <p>
                      <strong>Category:</strong> {selectedRecord.category}
                    </p>
                    <p>
                      <strong>Priority:</strong>
                      <Badge className={`ml-2 ${getPriorityColor(selectedRecord.priority)}`}>
                        {selectedRecord.priority.charAt(0).toUpperCase() + selectedRecord.priority.slice(1)}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Provider Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Doctor:</strong> {selectedRecord.doctor}
                    </p>
                    <p>
                      <strong>Facility:</strong> {selectedRecord.facility}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                  {selectedRecord.summary}
                </p>
              </div>

              {selectedRecord.details && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Detailed Notes</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {selectedRecord.details}
                  </p>
                </div>
              )}

              {selectedRecord.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Attachments</h4>
                  <div className="space-y-2">
                    {selectedRecord.attachments.map((attachment: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{attachment}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Record
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => {
                    handleDeleteRecord(selectedRecord.id)
                    setShowRecordDetails(false)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
