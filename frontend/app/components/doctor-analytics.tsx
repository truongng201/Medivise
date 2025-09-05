"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, Clock, Star, Award, ThumbsUp, Calendar } from "lucide-react"

interface DoctorAnalyticsProps {
  user: any
}

export default function DoctorAnalytics({ user }: DoctorAnalyticsProps) {
  // Mock analytics data
  const monthlyAppointments = [
    { month: "Jan", appointments: 45, satisfaction: 4.8 },
    { month: "Feb", appointments: 52, satisfaction: 4.7 },
    { month: "Mar", appointments: 48, satisfaction: 4.9 },
    { month: "Apr", appointments: 61, satisfaction: 4.8 },
    { month: "May", appointments: 55, satisfaction: 4.9 },
    { month: "Jun", appointments: 67, satisfaction: 4.8 },
  ]

  const conditionDistribution = [
    { name: "Hypertension", value: 35, color: "#3b82f6" },
    { name: "Heart Disease", value: 25, color: "#ef4444" },
    { name: "Arrhythmia", value: 20, color: "#f59e0b" },
    { name: "Chest Pain", value: 15, color: "#10b981" },
    { name: "Other", value: 5, color: "#6b7280" },
  ]

  const performanceMetrics = [
    {
      title: "Patient Satisfaction",
      value: "4.8",
      unit: "/5.0",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Avg Response Time",
      value: "12",
      unit: "min",
      change: "-3",
      trend: "down",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Appointment Completion",
      value: "94",
      unit: "%",
      change: "+2",
      trend: "up",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Patient Retention",
      value: "89",
      unit: "%",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const achievements = [
    {
      title: "Top Rated Doctor",
      description: "Highest patient satisfaction this quarter",
      date: "Q1 2024",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      title: "Excellence in Care",
      description: "Outstanding patient care recognition",
      date: "March 2024",
      icon: ThumbsUp,
      color: "text-green-600",
    },
    {
      title: "Patient Champion",
      description: "100+ successful treatments this year",
      date: "2024",
      icon: Users,
      color: "text-blue-600",
    },
  ]

  const weeklyPerformance = [
    { day: "Mon", completed: 8, onTime: 7, followUp: 6 },
    { day: "Tue", completed: 10, onTime: 9, followUp: 8 },
    { day: "Wed", completed: 7, onTime: 6, followUp: 5 },
    { day: "Thu", completed: 9, onTime: 8, followUp: 7 },
    { day: "Fri", completed: 11, onTime: 10, followUp: 9 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your performance and patient care metrics</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <div className="flex items-baseline space-x-1">
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-500">{metric.unit}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-4 w-4 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                    <span
                      className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Appointments</CardTitle>
            <CardDescription>Appointment volume and satisfaction trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                appointments: {
                  label: "Appointments",
                  color: "hsl(var(--chart-1))",
                },
                satisfaction: {
                  label: "Satisfaction",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="appointments" fill="var(--color-appointments)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Patient Satisfaction Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Satisfaction Trend</CardTitle>
            <CardDescription>Monthly satisfaction ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                satisfaction: {
                  label: "Satisfaction",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[4.0, 5.0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="var(--color-satisfaction)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-satisfaction)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Condition Distribution and Weekly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Condition Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Condition Distribution</CardTitle>
            <CardDescription>Breakdown of treated conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Patients",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {conditionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance Summary</CardTitle>
            <CardDescription>This week's appointment metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyPerformance.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{day.day}</span>
                  <span className="text-sm text-gray-600">{day.completed} appointments</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>On-time completion</span>
                    <span>{Math.round((day.onTime / day.completed) * 100)}%</span>
                  </div>
                  <Progress value={(day.onTime / day.completed) * 100} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Follow-up completion</span>
                    <span>{Math.round((day.followUp / day.completed) * 100)}%</span>
                  </div>
                  <Progress value={(day.followUp / day.completed) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Achievements and Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Achievements & Recognition</span>
          </CardTitle>
          <CardDescription>Your recent accomplishments and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-full">
                  <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {achievement.date}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Feedback Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <span>Recent Patient Feedback</span>
          </CardTitle>
          <CardDescription>What your patients are saying about your care</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <p className="text-sm text-gray-700">
                `Dr. ${user?.name?.split(" ")[1] || "Johnson"} provided excellent care and took the time to explain my
                condition thoroughly. Highly recommend!`
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium">Jane Smith</span>
              </div>
              <p className="text-sm text-gray-700">
                "Professional, caring, and knowledgeable. The virtual consultation was seamless and very helpful."
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium">Robert Wilson</span>
              </div>
              <p className="text-sm text-gray-700">
                "Great bedside manner and very thorough in diagnosis. Made me feel comfortable throughout the entire
                process."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
