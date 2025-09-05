"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

interface DoctorDashboardProps {
  user: any
}

export default function DoctorDashboard({ user }: DoctorDashboardProps) {
  const stats = [
    {
      title: "Total Patients",
      value: user?.patients?.length || 0,
      icon: Users,
      change: "+2 this week",
      changeType: "positive",
    },
    {
      title: "Today's Appointments",
      value: "8",
      icon: Calendar,
      change: "2 pending",
      changeType: "neutral",
    },
    {
      title: "Critical Cases",
      value: user?.patients?.filter((p: any) => p.status === "critical").length || 0,
      icon: AlertTriangle,
      change: "Requires attention",
      changeType: "negative",
    },
    {
      title: "Completed Today",
      value: "12",
      icon: CheckCircle,
      change: "+3 from yesterday",
      changeType: "positive",
    },
  ]

  const recentPatients = user?.patients?.slice(0, 5) || []

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

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">
            {user?.specialty} • {user?.hospital}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p
                    className={`text-sm ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Recent Patients</span>
            </CardTitle>
            <CardDescription>Patients seen in the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient: any) => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.condition}</p>
                    <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                  </div>
                  <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                </div>
              ))}
              {recentPatients.length === 0 && <p className="text-center text-gray-500 py-4">No recent patients</p>}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Schedule</span>
            </CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Follow-up consultation</p>
                  <p className="text-sm text-gray-500">9:00 AM - 9:30 AM</p>
                </div>
                <Badge className="bg-slate-100 text-slate-800">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Jane Smith</p>
                  <p className="text-sm text-gray-600">Cardiac evaluation</p>
                  <p className="text-sm text-gray-500">10:00 AM - 10:45 AM</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Robert Wilson</p>
                  <p className="text-sm text-gray-600">Emergency consultation</p>
                  <p className="text-sm text-gray-500">11:00 AM - 11:30 AM</p>
                </div>
                <Badge className="bg-red-100 text-red-800">Urgent</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
          <CardDescription>Your patient care metrics for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Appointments Completed</span>
                <span>42/45</span>
              </div>
              <Progress value={93} className="h-2" />
              <p className="text-xs text-gray-600">93% completion rate</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Patient Satisfaction</span>
                <span>4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
              <p className="text-xs text-gray-600">Based on 28 reviews</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span>12 min avg</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-600">15% faster than last week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
