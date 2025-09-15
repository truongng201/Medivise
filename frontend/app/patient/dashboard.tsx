"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertTriangle, Edit, RefreshCw } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

interface DashboardProps {
  user: any,
  authData?: any,
  onUserUpdate?: (updatedUser: any) => void
}

export default function Dashboard({ user, authData, onUserUpdate }: DashboardProps) {
  const [healthMetrics, setHealthMetrics] = useState<any[]>(Array.isArray(user?.health_metrics) ? user?.health_metrics : []);
  const [editingMetric, setEditingMetric] = useState<{ index: number; value: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateAllDialogOpen, setIsUpdateAllDialogOpen] = useState(false);
  const [allMetricsValues, setAllMetricsValues] = useState<{ [key: number]: string }>({});
  const [isSavingMetric, setIsSavingMetric] = useState(false);
  
  const { post, loading } = useApi({ role: 'patient' });
  const { toast } = useToast();

  const refreshUserInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/patient/get_patient_info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${authData?.access_token || ""}`
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedUser = responseData.data;
        
        // Update local health metrics state
        if (Array.isArray(updatedUser?.health_metrics)) {
          setHealthMetrics(updatedUser.health_metrics);
        }
        
        // Call parent component's update function if provided
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error refreshing user info:', error);
    }
  };

  const handleUpdateMetric = (index: number) => {
    const metric = healthMetrics[index];
    setEditingMetric({ index, value: metric?.value?.toString() || "" });
    setIsDialogOpen(true);
  }

  const handleSaveMetric = async () => {
    if (editingMetric) {
      setIsSavingMetric(true);
      try {
        const updatedMetrics = [...healthMetrics];
        updatedMetrics[editingMetric.index] = {
          ...updatedMetrics[editingMetric.index],
          value: parseFloat(editingMetric.value) || 0
        };

        // Prepare the payload for the API - send only the edited field
        const fieldMapping: { [key: string]: string } = {
          'diastolic blood pressure': 'diastolic_bp',
          'systolic blood pressure': 'systolic_bp',
          'urea nitrogen': 'urea_nitrogen',
          'carbon dioxide': 'carbon_dioxide',
          'heart rate': 'heart_rate',
          'respiratory rate': 'respiratory_rate',
        };

        const payload: { [key: string]: number } = {};
        const editedMetric = updatedMetrics[editingMetric.index];
        if (editedMetric?.name) {
          const normalizedName = editedMetric.name.toLowerCase();
          const fieldName = fieldMapping[normalizedName] || normalizedName.replace(/\s+/g, '_');
          payload[fieldName] = editedMetric.value || 0;
        }

        console.log('Single metric payload being sent:', payload); // Debug log

        // Call the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/patient/update_patient_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `${authData?.access_token || ""}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update health metric');
        }

        // Update local state
        setHealthMetrics(updatedMetrics);
        setIsDialogOpen(false);
        setEditingMetric(null);

        // Refresh user info to get updated data
        await refreshUserInfo();

        toast({
          title: "Success",
          description: `${healthMetrics[editingMetric.index]?.name} has been updated successfully.`,
        });

      } catch (error) {
        console.error('Error updating metric:', error);
        toast({
          title: "Error",
          description: "Failed to update health metric. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSavingMetric(false);
      }
    }
  }

  const handleCancelEdit = () => {
    setIsDialogOpen(false);
    setEditingMetric(null);
  }

  const handleUpdateAllMetrics = () => {
    // Initialize form values with current metric values
    const initialValues: { [key: number]: string } = {};
    healthMetrics.forEach((metric, index) => {
      initialValues[index] = metric?.value?.toString() || "";
    });
    setAllMetricsValues(initialValues);
    setIsUpdateAllDialogOpen(true);
  }

  const handleSaveAllMetrics = async () => {
    try {
      // Prepare the updated metrics data
      const updatedMetrics = healthMetrics.map((metric, index) => ({
        ...metric,
        value: parseFloat(allMetricsValues[index]) || metric.value || 0
      }));

        // Prepare the payload for the API - send only fields that were changed
        const fieldMapping: { [key: string]: string } = {
          'diastolic blood pressure': 'diastolic_bp',
          'systolic blood pressure': 'systolic_bp',
          'urea nitrogen': 'urea_nitrogen',
          'carbon dioxide': 'carbon_dioxide',
          'heart rate': 'heart_rate',
          'respiratory rate': 'respiratory_rate',
          'tobacco smoking status': 'tobacco_smoking_status',
          'pain severity': 'pain_severity'
        };

        const payload: { [key: string]: number } = {};
        updatedMetrics.forEach((metric, index) => {
          // Only include fields that have been edited (have a value in allMetricsValues)
          if (metric?.name && allMetricsValues[index] !== undefined && allMetricsValues[index] !== '') {
            const normalizedName = metric.name.toLowerCase();
            const fieldName = fieldMapping[normalizedName] || normalizedName.replace(/\s+/g, '_');
            payload[fieldName] = metric.value || 0;
          }
        });      console.log('Payload being sent:', payload); // Debug log

      // Call the API using fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/patient/update_patient_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${authData?.access_token || ""}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to update health metrics');
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      // Update local state
      setHealthMetrics(updatedMetrics);
      setIsUpdateAllDialogOpen(false);
      setAllMetricsValues({});

      // Refresh user info to get updated data
      await refreshUserInfo();

      toast({
        title: "Success",
        description: "All health metrics have been updated successfully.",
      });

    } catch (error) {
      console.error('Error updating metrics:', error);
      toast({
        title: "Error",
        description: "Failed to update health metrics. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleCancelUpdateAll = () => {
    setIsUpdateAllDialogOpen(false);
    setAllMetricsValues({});
  }

  const handleMetricValueChange = (index: number, value: string) => {
    setAllMetricsValues(prev => ({
      ...prev,
      [index]: value
    }));
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullname}</h1>
          <p className="text-gray-600">Track your key health indicators over time. Current update: {user?.recorded_time ? (() => {
            const date = new Date(user.recorded_time);
            // Add 7 hours to the date if it's not already in the correct timezone
            const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
            return vietnamTime.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' }) + ' (UTC+7)';
          })() : "No updates available"}</p>
        </div>
        <Button 
          onClick={handleUpdateAllMetrics}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Update All Values
        </Button>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateMetric(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Update {metric?.name}</span>
                  </Button>
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
                    <Badge 
                      variant={
                        metric?.status === "excellent" || metric?.status === "good" ? "default" : 
                        metric?.status === "warning" ? "destructive" : "secondary"
                      } 
                      className={`text-xs ${
                        metric?.status === "excellent" || metric?.status === "good" ? "bg-green-500 hover:bg-green-600" :
                        metric?.status === "warning" ? "bg-yellow-500 hover:bg-yellow-600" : ""
                      }`}
                    >
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

      {/* Update Metric Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Health Metric</DialogTitle>
            <DialogDescription>
              Update the current value for {editingMetric ? healthMetrics[editingMetric.index]?.name : ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="metric-value" className="text-sm font-medium text-gray-700">
                New Value ({editingMetric ? healthMetrics[editingMetric.index]?.unit : ""})
              </label>
              <Input
                id="metric-value"
                type="number"
                step="0.1"
                value={editingMetric?.value || ""}
                onChange={(e) => setEditingMetric(prev => prev ? { ...prev, value: e.target.value } : null)}
                placeholder="Enter new value"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveMetric} disabled={isSavingMetric}>
              {isSavingMetric ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Value"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update All Metrics Modal */}
      <Dialog open={isUpdateAllDialogOpen} onOpenChange={setIsUpdateAllDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update All Health Metrics</DialogTitle>
            <DialogDescription>
              Update all your current health metric values at once. Changes will be saved to your profile.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <label 
                  htmlFor={`metric-${index}`} 
                  className="text-sm font-medium text-gray-700 flex items-center justify-between"
                >
                  <span>{metric?.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {metric?.status}
                  </Badge>
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={`metric-${index}`}
                    type="number"
                    step="0.1"
                    value={allMetricsValues[index] || ""}
                    onChange={(e) => handleMetricValueChange(index, e.target.value)}
                    placeholder={`Current: ${metric?.value || "N/A"}`}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 min-w-[60px]">
                    {metric?.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUpdateAll}>
              Cancel
            </Button>
            <Button onClick={handleSaveAllMetrics} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save All Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
