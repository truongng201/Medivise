"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Heart,
  Activity,
  Calendar,
  FileText,
  TrendingUp,
  CheckCircle,
  Plus,
  Bell,
  Pill,
  TestTube,
  Save,
} from "lucide-react"

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [showQuickActionDialog, setShowQuickActionDialog] = useState(false)
  const [quickActionType, setQuickActionType] = useState("")
  const [quickActionData, setQuickActionData] = useState({
    title: "",
    value: "",
    notes: "",
  })
  const [successMessage, setSuccessMessage] = useState("")

  const healthMetrics = [
    {
      name: "Blood Pressure",
      value: user?.systolic_bp && user?.diastolic_bp ? `${user.systolic_bp}/${user.diastolic_bp}` : "120/80",
      status: "normal",
      icon: Heart,
    },
    {
      name: "Heart Rate",
      value: user?.heart_rate ? `${user.heart_rate} BPM` : "72 BPM",
      status: "normal",
      icon: Activity,
    },
    {
      name: "BMI",
      value: user?.bmi ? user.bmi.toString() : "23.5",
      status: "normal",
      icon: TrendingUp,
    },
    {
      name: "Glucose",
      value: user?.glucose ? `${user.glucose} mg/dL` : "95 mg/dL",
      status: "normal",
      icon: TestTube,
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "Follow-up",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "General Practice",
      date: "2024-01-22",
      time: "2:30 PM",
      type: "Annual Physical",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "medication",
      description: "Recorded medication intake",
      time: "2 hours ago",
      icon: Pill,
    },
    {
      id: 2,
      type: "appointment",
      description: "Scheduled appointment with Dr. Johnson",
      time: "1 day ago",
      icon: Calendar,
    },
    {
      id: 3,
      type: "record",
      description: "Updated vital signs",
      time: "2 days ago",
      icon: FileText,
    },
  ]

  const quickActionTypes = [
    { value: "vital_signs", label: "Record Vital Signs", icon: Heart },
    { value: "medication", label: "Log Medication", icon: Pill },
    { value: "symptom", label: "Report Symptom", icon: Activity },
    { value: "lab_result", label: "Add Lab Result", icon: TestTube },
    { value: "appointment", label: "Schedule Appointment", icon: Calendar },
    { value: "note", label: "Add Health Note", icon: FileText },
  ]

  const handleQuickAction = () => {
    if (quickActionType && quickActionData.title) {
      setSuccessMessage(`${quickActionType.replace("_", " ")} recorded successfully!`)
      setShowQuickActionDialog(false)
      setQuickActionType("")
      setQuickActionData({ title: "", value: "", notes: "" })
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-slate-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-slate-100 text-slate-800">Normal</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's your health overview for today</p>
        </div>
        <Dialog open={showQuickActionDialog} onOpenChange={setShowQuickActionDialog}>
          <DialogTrigger asChild>
            <Button className="bg-slate-800 hover:bg-slate-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Quick Action</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Quick Health Action</DialogTitle>
              <DialogDescription>Quickly record health data or schedule an action</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="action-type">Action Type</Label>
                <Select value={quickActionType} onValueChange={setQuickActionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action type" />
                  </SelectTrigger>
                  <SelectContent>
                    {quickActionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {quickActionType && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title/Description</Label>
                    <Input
                      id="title"
                      value={quickActionData.title}
                      onChange={(e) => setQuickActionData({ ...quickActionData, title: e.target.value })}
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Value/Measurement</Label>
                    <Input
                      id="value"
                      value={quickActionData.value}
                      onChange={(e) => setQuickActionData({ ...quickActionData, value: e.target.value })}
                      placeholder="e.g., 120/80, 72 BPM, 98.6°F"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={quickActionData.notes}
                      onChange={(e) => setQuickActionData({ ...quickActionData, notes: e.target.value })}
                      placeholder="Any additional information"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQuickActionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleQuickAction}
                className="bg-slate-800 hover:bg-slate-700"
                disabled={!quickActionType || !quickActionData.title}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {successMessage && (
        <Alert className="bg-slate-50 border-slate-200">
          <CheckCircle className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-slate-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Health Alerts */}
      <Alert className="bg-slate-50 border-slate-200">
        <CheckCircle className="h-4 w-4 text-slate-600" />
        <AlertDescription className="text-slate-800">
          All your vital signs are within normal ranges. Keep up the great work!
        </AlertDescription>
      </Alert>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index} className="focus-within:ring-2 focus-within:ring-slate-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                      <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>{metric.value}</p>
                    </div>
                  </div>
                  {getStatusBadge(metric.status)}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Appointments</span>
            </CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <Badge variant="outline">{appointment.type}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Appointments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Your latest health-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <IconComponent className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
              <Button variant="outline" className="w-full bg-transparent">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Health Score</CardTitle>
          <CardDescription>Based on your recent health data and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="text-6xl font-bold text-slate-600">85/100</div>
            <div className="flex-1">
              <Progress value={85} className="h-4 mb-3" />
              <p className="text-gray-700">
                Your health score is <strong className="text-slate-600">Good</strong>. Continue following your treatment
                plan and maintaining healthy habits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
