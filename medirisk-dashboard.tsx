"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Heart, Activity, AlertTriangle, CheckCircle, TrendingUp, User, Calendar, Weight } from "lucide-react"

interface RiskAssessment {
  age: number
  gender: string
  weight: number
  height: number
  bloodPressure: string
  cholesterol: number
  smoking: boolean
  diabetes: boolean
  familyHistory: boolean
  exercise: string
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"]

export default function MedRiskDashboard() {
  const [assessment, setAssessment] = useState<RiskAssessment>({
    age: 0,
    gender: "",
    weight: 0,
    height: 0,
    bloodPressure: "",
    cholesterol: 0,
    smoking: false,
    diabetes: false,
    familyHistory: false,
    exercise: "",
  })

  const [riskScore, setRiskScore] = useState(0)
  const [riskLevel, setRiskLevel] = useState("")

  const calculateRisk = () => {
    let score = 0

    // Age factor
    if (assessment.age > 65) score += 3
    else if (assessment.age > 45) score += 2
    else if (assessment.age > 35) score += 1

    // BMI calculation
    const bmi = assessment.weight / (assessment.height / 100) ** 2
    if (bmi > 30) score += 3
    else if (bmi > 25) score += 2
    else if (bmi > 18.5) score += 0
    else score += 1

    // Blood pressure
    if (assessment.bloodPressure === "high") score += 3
    else if (assessment.bloodPressure === "elevated") score += 2

    // Cholesterol
    if (assessment.cholesterol > 240) score += 3
    else if (assessment.cholesterol > 200) score += 2

    // Risk factors
    if (assessment.smoking) score += 3
    if (assessment.diabetes) score += 3
    if (assessment.familyHistory) score += 2

    // Exercise
    if (assessment.exercise === "none") score += 2
    else if (assessment.exercise === "light") score += 1

    setRiskScore(score)

    if (score <= 5) setRiskLevel("Low")
    else if (score <= 10) setRiskLevel("Moderate")
    else if (score <= 15) setRiskLevel("High")
    else setRiskLevel("Very High")
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500"
      case "Moderate":
        return "bg-yellow-500"
      case "High":
        return "bg-orange-500"
      case "Very High":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const riskFactorsData = [
    { name: "Age", value: assessment.age > 45 ? 1 : 0, color: "#ef4444" },
    {
      name: "BMI",
      value:
        assessment.weight && assessment.height ? (assessment.weight / (assessment.height / 100) ** 2 > 25 ? 1 : 0) : 0,
      color: "#f97316",
    },
    { name: "BP", value: assessment.bloodPressure === "high" ? 1 : 0, color: "#eab308" },
    { name: "Cholesterol", value: assessment.cholesterol > 200 ? 1 : 0, color: "#22c55e" },
    { name: "Smoking", value: assessment.smoking ? 1 : 0, color: "#8b5cf6" },
    { name: "Diabetes", value: assessment.diabetes ? 1 : 0, color: "#06b6d4" },
  ]

  const riskDistribution = [
    { name: "Low Risk", value: riskLevel === "Low" ? 100 : 0, color: "#22c55e" },
    { name: "Moderate Risk", value: riskLevel === "Moderate" ? 100 : 0, color: "#eab308" },
    { name: "High Risk", value: riskLevel === "High" ? 100 : 0, color: "#f97316" },
    { name: "Very High Risk", value: riskLevel === "Very High" ? 100 : 0, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            Medical Risk Indicator
          </h1>
          <p className="text-gray-600">Comprehensive health risk assessment and monitoring</p>
        </div>

        <Tabs defaultValue="assessment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
                <CardDescription>Enter patient details for risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={assessment.age || ""}
                      onChange={(e) => setAssessment({ ...assessment, age: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={assessment.gender}
                      onValueChange={(value) => setAssessment({ ...assessment, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight"
                      value={assessment.weight || ""}
                      onChange={(e) => setAssessment({ ...assessment, weight: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter height"
                      value={assessment.height || ""}
                      onChange={(e) => setAssessment({ ...assessment, height: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bp">Blood Pressure</Label>
                    <Select
                      value={assessment.bloodPressure}
                      onValueChange={(value) => setAssessment({ ...assessment, bloodPressure: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select BP level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal ({"<120/80"})</SelectItem>
                        <SelectItem value="elevated">Elevated (120-129/{"<80"})</SelectItem>
                        <SelectItem value="high">High ({"≥130/80"})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
                    <Input
                      id="cholesterol"
                      type="number"
                      placeholder="Enter cholesterol level"
                      value={assessment.cholesterol || ""}
                      onChange={(e) =>
                        setAssessment({ ...assessment, cholesterol: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exercise">Exercise Level</Label>
                    <Select
                      value={assessment.exercise}
                      onValueChange={(value) => setAssessment({ ...assessment, exercise: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-4 days/week)</SelectItem>
                        <SelectItem value="intense">Intense (5+ days/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Risk Factors</Label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={assessment.smoking}
                        onChange={(e) => setAssessment({ ...assessment, smoking: e.target.checked })}
                        className="rounded"
                      />
                      <span>Smoking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={assessment.diabetes}
                        onChange={(e) => setAssessment({ ...assessment, diabetes: e.target.checked })}
                        className="rounded"
                      />
                      <span>Diabetes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={assessment.familyHistory}
                        onChange={(e) => setAssessment({ ...assessment, familyHistory: e.target.checked })}
                        className="rounded"
                      />
                      <span>Family History of Heart Disease</span>
                    </label>
                  </div>
                </div>

                <Button onClick={calculateRisk} className="w-full">
                  Calculate Risk Score
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {riskScore > 0 && (
              <>
                {/* Risk Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Risk Score</p>
                          <p className="text-3xl font-bold">{riskScore}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Risk Level</p>
                          <Badge className={`${getRiskColor(riskLevel)} text-white`}>{riskLevel}</Badge>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">BMI</p>
                          <p className="text-3xl font-bold">
                            {assessment.weight && assessment.height
                              ? (assessment.weight / (assessment.height / 100) ** 2).toFixed(1)
                              : "--"}
                          </p>
                        </div>
                        <Weight className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Age Group</p>
                          <p className="text-3xl font-bold">{assessment.age}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Level Alert */}
                <Alert
                  className={`border-l-4 ${
                    riskLevel === "Low"
                      ? "border-green-500 bg-green-50"
                      : riskLevel === "Moderate"
                        ? "border-yellow-500 bg-yellow-50"
                        : riskLevel === "High"
                          ? "border-orange-500 bg-orange-50"
                          : "border-red-500 bg-red-50"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Risk Assessment: {riskLevel} Risk</AlertTitle>
                  <AlertDescription>
                    {riskLevel === "Low" &&
                      "Your cardiovascular risk is low. Continue maintaining healthy lifestyle habits."}
                    {riskLevel === "Moderate" &&
                      "Your cardiovascular risk is moderate. Consider lifestyle modifications and regular monitoring."}
                    {riskLevel === "High" &&
                      "Your cardiovascular risk is high. Consult with a healthcare provider for comprehensive evaluation."}
                    {riskLevel === "Very High" &&
                      "Your cardiovascular risk is very high. Immediate medical consultation is recommended."}
                  </AlertDescription>
                </Alert>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Factors Analysis</CardTitle>
                      <CardDescription>Individual risk factor contributions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          value: {
                            label: "Risk Factor",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={riskFactorsData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Level Distribution</CardTitle>
                      <CardDescription>Current risk category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          value: {
                            label: "Risk Level",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={riskDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {riskDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Score Breakdown</CardTitle>
                    <CardDescription>Detailed analysis of risk components</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Risk Score</span>
                        <span>{riskScore}/20</span>
                      </div>
                      <Progress value={(riskScore / 20) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Modifiable Risk Factors</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${assessment.smoking ? "bg-red-500" : "bg-green-500"}`}
                            />
                            Smoking: {assessment.smoking ? "Yes" : "No"}
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${assessment.weight && assessment.height && assessment.weight / (assessment.height / 100) ** 2 > 25 ? "bg-orange-500" : "bg-green-500"}`}
                            />
                            BMI:{" "}
                            {assessment.weight && assessment.height
                              ? (assessment.weight / (assessment.height / 100) ** 2).toFixed(1)
                              : "Not calculated"}
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${assessment.exercise === "none" ? "bg-red-500" : "bg-green-500"}`}
                            />
                            Exercise: {assessment.exercise || "Not specified"}
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Non-modifiable Risk Factors</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${assessment.age > 45 ? "bg-orange-500" : "bg-green-500"}`}
                            />
                            Age: {assessment.age} years
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${assessment.familyHistory ? "bg-orange-500" : "bg-green-500"}`}
                            />
                            Family History: {assessment.familyHistory ? "Yes" : "No"}
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${assessment.diabetes ? "bg-red-500" : "bg-green-500"}`}
                            />
                            Diabetes: {assessment.diabetes ? "Yes" : "No"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {riskScore > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Lifestyle Recommendations
                    </CardTitle>
                    <CardDescription>Evidence-based interventions to reduce risk</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {assessment.smoking && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="font-semibold text-red-800">Smoking Cessation</h4>
                          <p className="text-sm text-red-700">
                            Quitting smoking can reduce cardiovascular risk by 50% within one year.
                          </p>
                        </div>
                      )}

                      {assessment.weight &&
                        assessment.height &&
                        assessment.weight / (assessment.height / 100) ** 2 > 25 && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-800">Weight Management</h4>
                            <p className="text-sm text-orange-700">
                              Losing 5-10% of body weight can significantly improve cardiovascular health.
                            </p>
                          </div>
                        )}

                      {assessment.exercise === "none" && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-800">Physical Activity</h4>
                          <p className="text-sm text-blue-700">
                            Aim for 150 minutes of moderate-intensity exercise per week.
                          </p>
                        </div>
                      )}

                      {assessment.bloodPressure === "high" && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-semibold text-purple-800">Blood Pressure Control</h4>
                          <p className="text-sm text-purple-700">
                            Monitor blood pressure regularly and follow medical advice for management.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Medical Follow-up
                    </CardTitle>
                    <CardDescription>Recommended medical interventions and monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {riskLevel === "Very High" && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="font-semibold text-red-800">Immediate Medical Consultation</h4>
                          <p className="text-sm text-red-700">
                            Schedule an appointment with a cardiologist within 1-2 weeks.
                          </p>
                        </div>
                      )}

                      {riskLevel === "High" && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <h4 className="font-semibold text-orange-800">Comprehensive Evaluation</h4>
                          <p className="text-sm text-orange-700">
                            Consider stress testing, echocardiogram, and lipid management.
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800">Regular Monitoring</h4>
                        <p className="text-sm text-green-700">
                          • Blood pressure: Monthly
                          <br />• Cholesterol: Every 6 months
                          <br />• Weight: Weekly
                          <br />• HbA1c (if diabetic): Every 3 months
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Preventive Medications</h4>
                        <p className="text-sm text-blue-700">
                          Discuss with your doctor about aspirin, statins, or ACE inhibitors if appropriate.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {riskScore === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Complete Risk Assessment</h3>
                  <p className="text-gray-500">
                    Please complete the risk assessment to view personalized recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
