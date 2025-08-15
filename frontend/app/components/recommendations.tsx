"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Activity,
  Pill,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
} from "lucide-react"

interface RecommendationsProps {
  user: any
}

export default function Recommendations({ user }: RecommendationsProps) {
  const recommendations = [
    {
      id: 1,
      title: "Schedule Annual Physical Exam",
      description:
        "It's been over a year since your last comprehensive physical examination. Regular check-ups help detect health issues early.",
      priority: "high",
      category: "Preventive Care",
      icon: Calendar,
      dueDate: "Within 2 weeks",
      progress: 0,
      actionRequired: true,
    },
    {
      id: 2,
      title: "Blood Pressure Monitoring",
      description:
        "Your recent readings show slightly elevated blood pressure. Consider daily monitoring and lifestyle modifications.",
      priority: "medium",
      category: "Cardiovascular",
      icon: Heart,
      dueDate: "Daily",
      progress: 65,
      actionRequired: true,
    },
    {
      id: 3,
      title: "Increase Physical Activity",
      description:
        "Based on your health metrics, increasing moderate exercise to 150 minutes per week could improve your overall health score.",
      priority: "medium",
      category: "Lifestyle",
      icon: Activity,
      dueDate: "Ongoing",
      progress: 40,
      actionRequired: false,
    },
    {
      id: 4,
      title: "Medication Review",
      description:
        "Schedule a medication review with your pharmacist to ensure optimal dosing and check for interactions.",
      priority: "low",
      category: "Medication",
      icon: Pill,
      dueDate: "Next month",
      progress: 80,
      actionRequired: false,
    },
    {
      id: 5,
      title: "Cholesterol Management",
      description: "Your cholesterol levels are excellent! Continue your current diet and exercise routine.",
      priority: "low",
      category: "Cardiovascular",
      icon: TrendingUp,
      dueDate: "Continue current plan",
      progress: 95,
      actionRequired: false,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-slate-100 text-slate-800 border-slate-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-slate-600" />
      default:
        return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const highPriorityCount = recommendations.filter((r) => r.priority === "high").length
  const actionRequiredCount = recommendations.filter((r) => r.actionRequired).length

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Recommendations</h1>
          <p className="text-gray-600">Personalized suggestions to improve your health and wellness</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>AI-Powered</span>
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
                <p className="text-sm text-gray-600">High Priority Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Target className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
                <p className="text-sm text-gray-600">Actions Required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-sm text-gray-600">Overall Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Priority Alert */}
      {highPriorityCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You have {highPriorityCount} high-priority health recommendation{highPriorityCount > 1 ? "s" : ""} that
            require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Recommendations</h2>

        {recommendations.map((recommendation) => {
          const IconComponent = recommendation.icon

          return (
            <Card key={recommendation.id} className="focus-within:ring-2 focus-within:ring-slate-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        {getPriorityIcon(recommendation.priority)}
                      </div>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {recommendation.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Progress</span>
                      <span className="text-gray-600">{recommendation.progress}%</span>
                    </div>
                    <Progress value={recommendation.progress} className="h-2" />
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>Category: {recommendation.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {recommendation.dueDate}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {recommendation.actionRequired && (
                        <Button size="sm" className="bg-slate-800 hover:bg-slate-700">
                          Take Action
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Health Score Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Potential Health Score Impact</CardTitle>
          <CardDescription>Completing these recommendations could improve your overall health score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">85</p>
              <p className="text-sm text-gray-600">Current Score</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Potential improvement:</span>
                <TrendingUp className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-600">+8 points</span>
              </div>
              <Progress value={85} className="h-3" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-600">93</p>
              <p className="text-sm text-gray-600">Potential Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
