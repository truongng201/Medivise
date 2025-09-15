"use client"

import { useState, useEffect } from "react"
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
  const [healthScore, setHealthScore] = useState<any>(null);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  const { post, loading } = useApi({ role: 'patient' });
  const { toast } = useToast();

  // Helper functions for data mapping
  const getMetricValue = (metricName: string, fallback: number) => {
    const metric = healthMetrics.find(m => 
      m?.name?.toLowerCase().replace(/\s+/g, '_') === metricName.toLowerCase().replace(/\s+/g, '_')
    );
    return metric?.value || user?.[metricName] || fallback;
  };

  const mapGender = (gender: string | undefined): "F" | "M" | "Other" => {
    if (!gender) return "F";
    const lowerGender = gender.toLowerCase();
    if (lowerGender === "female" || lowerGender === "f") return "F";
    if (lowerGender === "male" || lowerGender === "m") return "M";
    return "Other";
  };

  const mapRace = (race: string | undefined): "asian" | "black" | "white" | "other" => {
    if (!race) return "white";
    const lowerRace = race.toLowerCase();
    if (lowerRace.includes("asian")) return "asian";
    if (lowerRace.includes("black") || lowerRace.includes("african")) return "black";
    if (lowerRace.includes("white") || lowerRace.includes("caucasian")) return "white";
    return "other";
  };

  const mapEthnicity = (ethnicity: string | undefined): "hispanic" | "nonhispanic" => {
    if (!ethnicity) return "nonhispanic";
    const lowerEthnicity = ethnicity.toLowerCase();
    return lowerEthnicity.includes("hispanic") ? "hispanic" : "nonhispanic";
  };

  const mapSmokingStatus = (status: string | undefined): "current" | "former" | "never" => {
    if (!status) return "never";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("current") || lowerStatus.includes("yes")) return "current";
    if (lowerStatus.includes("former") || lowerStatus.includes("quit")) return "former";
    return "never";
  };

  const createPredictionPayload = () => {
    return {
      records: [{
        gender: mapGender(user?.gender),
        race: mapRace(user?.race),
        ethnicity: mapEthnicity(user?.ethnicity),
        tobacco_smoking_status: mapSmokingStatus(user?.tobacco_smoking_status),
        pain_severity: getMetricValue('pain_severity', 0),
        age: user?.age || 0,
        bmi: user?.bmi || 0,
        calcium: getMetricValue('calcium', 9.5),
        carbon_dioxide: getMetricValue('carbon_dioxide', 25.5),
        chloride: getMetricValue('chloride', 101),
        creatinine: getMetricValue('creatinine', 0.97),
        diastolic_bp: getMetricValue('diastolic_bp', 70),
        glucose: getMetricValue('glucose', 84.5),
        heart_rate: getMetricValue('heart_rate', 80),
        potassium: getMetricValue('potassium', 4.25),
        respiratory_rate: getMetricValue('respiratory_rate', 16),
        sodium: getMetricValue('sodium', 140),
        systolic_bp: getMetricValue('systolic_bp', 105),
        urea_nitrogen: getMetricValue('urea_nitrogen', 13.5)
      }]
    };
  };

  const getRecommendations = async (healthScoreResult: any, patientVitals: any) => {
    setIsLoadingRecommendations(true);
    try {
      const recommendationPayload = {
        model_prediction: healthScoreResult,
        patient_vitals: patientVitals
      };

      console.log('Sending recommendation payload:', recommendationPayload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/patient/get_recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${authData?.access_token || ""}`
        },
        body: JSON.stringify(recommendationPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const responseData = await response.json();
      console.log('Recommendations response:', responseData);

      if (responseData.status === 'success') {
        setRecommendations(responseData.data);
        
        toast({
          title: "Success",
          description: "AI recommendations generated successfully!",
        });
      } else {
        throw new Error('Invalid response from recommendation service');
      }

    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const calculateHealthScore = async () => {
    setIsCalculatingScore(true);
    try {
      // Prepare data for ML prediction
      const predictionPayload = createPredictionPayload();

      console.log('Sending prediction payload:', predictionPayload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ml/v1/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${authData?.access_token || ""}`
        },
        body: JSON.stringify(predictionPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate health score');
      }

      const responseData = await response.json();
      console.log('Prediction response:', responseData);

      if (responseData.status === 'success' && responseData.data?.results?.length > 0) {
        const result = responseData.data.results[0];
        setHealthScore(result);
        
        // Auto-fetch recommendations after getting health score
        getRecommendations(result, predictionPayload);
        
        toast({
          title: "Success",
          description: "Health score calculated successfully!",
        });
      } else {
        throw new Error('Invalid response from prediction service');
      }

    } catch (error) {
      console.error('Error calculating health score:', error);
      toast({
        title: "Error",
        description: "Failed to calculate health score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculatingScore(false);
    }
  };

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

        // Recalculate health score with updated metrics
        setTimeout(() => {
          calculateHealthScore();
        }, 1000);

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

      // Recalculate health score with updated metrics
      setTimeout(() => {
        calculateHealthScore();
      }, 1000);

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
        <div className="flex items-center gap-2">
          <Button 
            onClick={calculateHealthScore}
            disabled={isCalculatingScore}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isCalculatingScore ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Score
              </>
            )}
          </Button>
          <Button 
            onClick={handleUpdateAllMetrics}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Update All Values
          </Button>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Overall Health Score</CardTitle>
              <CardDescription>Based on your recent health metrics and AI analysis</CardDescription>
            </div>
            <Button 
              onClick={calculateHealthScore}
              disabled={isCalculatingScore}
              className="flex items-center gap-2"
            >
              {isCalculatingScore ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Calculate Score
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {healthScore ? (
            <div className="flex items-center space-x-6">
              <div className="text-6xl font-bold text-slate-600">
                {Math.round((healthScore.score_number || 0.5) * 100)}/100
              </div>
              <div className="flex-1">
                <Progress value={(healthScore.score_number || 0.5) * 100} className="h-4 mb-3" />
                <p className="text-gray-700 mb-2">
                  Your health status is{" "}
                  <strong className={`${
                    healthScore.health_score === 'good' ? 'text-green-600' : 
                    healthScore.risk_level === 'moderate' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {healthScore.health_score || healthScore.risk_level || 'Unknown'}
                  </strong>
                  {healthScore.health_score === 'good' 
                    ? '. Keep up with regular check-ups and follow the recommendations.' 
                    : '. Please consult with your healthcare provider for personalized advice.'
                  }
                </p>
                
                {/* Display prediction probabilities */}
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="font-medium text-green-700">Low Risk</p>
                    <p className="text-green-600">{Math.round((healthScore.proba_low || 0) * 100)}%</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <p className="font-medium text-yellow-700">Moderate Risk</p>
                    <p className="text-yellow-600">{Math.round((healthScore.proba_moderate || 0) * 100)}%</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="font-medium text-red-700">High Risk</p>
                    <p className="text-red-600">{Math.round((healthScore.proba_high || 0) * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">--/100</div>
                <p className="text-gray-500 mb-4">No health score calculated yet</p>
                <p className="text-sm text-gray-400">
                  Click "Calculate Score" to generate your health assessment based on current metrics
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Clinical Recommendations</CardTitle>
              <CardDescription>
                AI-generated suggestions based on your health score and vitals
              </CardDescription>
            </div>
            {healthScore && (
              <Button 
                onClick={() => getRecommendations(healthScore, createPredictionPayload())}
                disabled={isLoadingRecommendations}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isLoadingRecommendations ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Get New Recommendations
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recommendations ? (
            <div className="space-y-6">
              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">
                      Important Medical Disclaimer
                    </h4>
                    <p className="text-sm text-yellow-700">
                      These are AI-generated suggestions and must be reviewed by a licensed physician 
                      before any medical decisions are made. This information is not a substitute for 
                      professional medical advice, diagnosis, or treatment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggested Actions */}
              {recommendations.suggested_actions && recommendations.suggested_actions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Suggested Actions
                  </h3>
                  <ul className="space-y-2">
                    {recommendations.suggested_actions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Monitoring Requirements */}
              {recommendations.monitoring_requirements && recommendations.monitoring_requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
                    Monitoring Requirements
                  </h3>
                  <ul className="space-y-2">
                    {recommendations.monitoring_requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flags */}
              {recommendations.red_flags && recommendations.red_flags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Red Flags to Watch For
                  </h3>
                  <ul className="space-y-2">
                    {recommendations.red_flags.map((flag: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                </div>
                <p className="text-gray-500 mb-4">No AI recommendations available yet</p>
                <p className="text-sm text-gray-400">
                  {healthScore 
                    ? "Click 'Get New Recommendations' to generate AI-powered health insights"
                    : "Calculate your health score first to get personalized recommendations"
                  }
                </p>
              </div>
            </div>
          )}
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
