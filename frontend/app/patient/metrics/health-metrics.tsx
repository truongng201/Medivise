"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface HealthMetricsProps {
  user: any
}

export default function HealthMetrics({ user }: HealthMetricsProps) {
  const healthMetrics = [
    { name: "Blood Pressure", value: 85, status: "good", trend: "stable", unit: "mmHg", current: "120/80" },
    { name: "Cholesterol", value: 92, status: "excellent", trend: "improving", unit: "mg/dL", current: "180" },
    { name: "Blood Sugar", value: 78, status: "good", trend: "stable", unit: "mg/dL", current: "95" },
    { name: "BMI", value: 88, status: "good", trend: "stable", unit: "", current: "23.5" },
    { name: "Heart Rate", value: 90, status: "excellent", trend: "improving", unit: "BPM", current: "72" },
    { name: "Weight", value: 82, status: "good", trend: "decreasing", unit: "lbs", current: "145" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-slate-500" />
      case "good":
        return <CheckCircle className="h-4 w-4 text-slate-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-slate-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-400" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-slate-600"
      case "good":
        return "text-slate-500"
      case "warning":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600">Track your key health indicators over time</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <section aria-labelledby="health-metrics-heading">
        <h2 id="health-metrics-heading" className="sr-only">
          Health Metrics Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="focus-within:ring-slate-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">{metric.name}</CardTitle>
                  <div className="flex items-center space-x-2" aria-label={`${metric.name} status and trend`}>
                    {getStatusIcon(metric.status)}
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-2xl font-bold text-gray-900"
                      aria-label={`Current ${metric.name.toLowerCase()}: ${metric.current} ${metric.unit}`}
                    >
                      {metric.current} {metric.unit}
                    </span>
                    <Badge variant={metric.status === "excellent" ? "default" : "secondary"} className="text-xs">
                      {metric.status}
                    </Badge>
                  </div>
                  <Progress
                    value={metric.value}
                    className="h-2"
                    aria-label={`${metric.name} progress: ${metric.value}% of target`}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${getStatusColor(metric.status)}`}>{metric.value}% of target</span>
                    <span className="text-gray-600">
                      Trend: <span className="font-semibold">{metric.trend}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Health Score</CardTitle>
          <CardDescription>Based on your recent health metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="text-6xl font-bold text-slate-600">85/100</div>
            <div className="flex-1">
              <Progress value={85} className="h-4 mb-3" />
              <p className="text-gray-700 mb-2">
                Your health score is <strong className="text-slate-600">Good</strong>. Keep up with regular check-ups
                and follow the recommendations.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Strengths:</p>
                  <ul className="text-gray-600 mt-1">
                    <li>• Excellent cholesterol levels</li>
                    <li>• Good heart rate variability</li>
                    <li>• Stable blood sugar</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Areas for improvement:</p>
                  <ul className="text-gray-600 mt-1">
                    <li>• Monitor blood pressure</li>
                    <li>• Maintain current weight</li>
                    <li>• Regular exercise routine</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
