"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle } from "lucide-react"
interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const healthMetrics: any[] = Array.isArray(user?.health_metrics) ? user?.health_metrics : [];
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-slate-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullname}</h1>
          <p className="text-gray-600">Track your key health indicators over time. Current update: {user?.recorded_time || "No updates available"}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <section aria-labelledby="health-metrics-heading">
        <h2 id="health-metrics-heading" className="sr-only">
          Health Metrics Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthMetrics?.map((metric: any, index: number) => (
            <Card key={index} className="focus-within:ring-slate-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">{metric?.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-2xl font-bold text-gray-900"
                      aria-label={`Current ${metric?.name.toLowerCase()}: ${metric?.current} ${metric?.unit}`}
                    >
                      {metric?.value} {metric?.unit}
                    </span>
                    <Badge variant={metric?.status === "excellent" ? "default" : "secondary"} className="text-xs">
                      {metric?.status}
                    </Badge>
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
