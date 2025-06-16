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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  User,
  Calendar,
  Weight,
  Stethoscope,
  Shield,
  Target,
  Zap,
} from "lucide-react"

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
        return "from-emerald-500 to-green-600"
      case "Moderate":
        return "from-amber-500 to-yellow-600"
      case "High":
        return "from-orange-500 to-red-500"
      case "Very High":
        return "from-red-500 to-rose-600"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25"
      case "Moderate":
        return "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/25"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
      case "Very High":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const riskFactorsData = [
    { name: "Age", value: assessment.age > 45 ? 1 : 0, color: "#6366f1" },
    {
      name: "BMI",
      value:
        assessment.weight && assessment.height ? (assessment.weight / (assessment.height / 100) ** 2 > 25 ? 1 : 0) : 0,
      color: "#8b5cf6",
    },
    { name: "BP", value: assessment.bloodPressure === "high" ? 1 : 0, color: "#ec4899" },
    { name: "Cholesterol", value: assessment.cholesterol > 200 ? 1 : 0, color: "#f59e0b" },
    { name: "Smoking", value: assessment.smoking ? 1 : 0, color: "#ef4444" },
    { name: "Diabetes", value: assessment.diabetes ? 1 : 0, color: "#06b6d4" },
  ]

  const riskDistribution = [
    { name: "Low Risk", value: riskLevel === "Low" ? 100 : 0, color: "#10b981" },
    { name: "Moderate Risk", value: riskLevel === "Moderate" ? 100 : 0, color: "#f59e0b" },
    { name: "High Risk", value: riskLevel === "High" ? 100 : 0, color: "#f97316" },
    { name: "Very High Risk", value: riskLevel === "Very High" ? 100 : 0, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  const radialData = [
    {
      name: "Risk Score",
      value: (riskScore / 20) * 100,
      fill:
        riskLevel === "Low"
          ? "#10b981"
          : riskLevel === "Moderate"
            ? "#f59e0b"
            : riskLevel === "High"
              ? "#f97316"
              : "#ef4444",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-2xl shadow-red-500/25 mb-4">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            MediRisk Indicator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Advanced cardiovascular risk assessment with AI-powered insights and personalized recommendations
          </p>
        </div>

        <Tabs defaultValue="assessment" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-2">
            <TabsTrigger
              value="assessment"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <User className="h-4 w-4 mr-2" />
              Assessment
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Activity className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Target className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-blue-500/10 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <User className="h-6 w-6" />
                  </div>
                  Patient Information
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Complete the assessment form for comprehensive risk analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-slate-700 font-semibold">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      value={assessment.age || ""}
                      onChange={(e) => setAssessment({ ...assessment, age: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-slate-700 font-semibold">
                      Gender
                    </Label>
                    <Select
                      value={assessment.gender}
                      onValueChange={(value) => setAssessment({ ...assessment, gender: value })}
                    >
                      <SelectTrigger className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-all duration-300">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-2xl">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="weight" className="text-slate-700 font-semibold">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      value={assessment.weight || ""}
                      onChange={(e) => setAssessment({ ...assessment, weight: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="height" className="text-slate-700 font-semibold">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter height"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      value={assessment.height || ""}
                      onChange={(e) => setAssessment({ ...assessment, height: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bp" className="text-slate-700 font-semibold">
                      Blood Pressure
                    </Label>
                    <Select
                      value={assessment.bloodPressure}
                      onValueChange={(value) => setAssessment({ ...assessment, bloodPressure: value })}
                    >
                      <SelectTrigger className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-all duration-300">
                        <SelectValue placeholder="Select BP level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-2xl">
                        <SelectItem value="normal">Normal ({"<120/80"})</SelectItem>
                        <SelectItem value="elevated">Elevated (120-129/{"<80"})</SelectItem>
                        <SelectItem value="high">High ({"≥130/80"})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cholesterol" className="text-slate-700 font-semibold">
                      Cholesterol (mg/dL)
                    </Label>
                    <Input
                      id="cholesterol"
                      type="number"
                      placeholder="Enter cholesterol level"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      value={assessment.cholesterol || ""}
                      onChange={(e) =>
                        setAssessment({ ...assessment, cholesterol: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="exercise" className="text-slate-700 font-semibold">
                      Exercise Level
                    </Label>
                    <Select
                      value={assessment.exercise}
                      onValueChange={(value) => setAssessment({ ...assessment, exercise: value })}
                    >
                      <SelectTrigger className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-all duration-300">
                        <SelectValue placeholder="Select exercise level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-2xl">
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-4 days/week)</SelectItem>
                        <SelectItem value="intense">Intense (5+ days/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <Label className="text-slate-700 font-semibold text-lg">Risk Factors</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assessment.smoking}
                        onChange={(e) => setAssessment({ ...assessment, smoking: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500"
                      />
                      <span className="font-medium text-slate-700">Smoking</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assessment.diabetes}
                        onChange={(e) => setAssessment({ ...assessment, diabetes: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500"
                      />
                      <span className="font-medium text-slate-700">Diabetes</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assessment.familyHistory}
                        onChange={(e) => setAssessment({ ...assessment, familyHistory: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500"
                      />
                      <span className="font-medium text-slate-700">Family History</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={calculateRisk}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-lg rounded-2xl shadow-2xl shadow-blue-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Calculate Risk Score
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            {riskScore > 0 && (
              <>
                {/* Enhanced Risk Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-2xl shadow-blue-500/25 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 font-medium">Risk Score</p>
                          <p className="text-4xl font-bold">{riskScore}</p>
                          <p className="text-blue-200 text-sm">out of 20</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-2xl">
                          <TrendingUp className="h-8 w-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-slate-500/10 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-600 font-medium">Risk Level</p>
                          <Badge
                            className={`${getRiskBadgeColor(riskLevel)} px-4 py-2 text-sm font-semibold rounded-xl mt-2`}
                          >
                            {riskLevel}
                          </Badge>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl">
                          <AlertTriangle className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-2xl shadow-emerald-500/25 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-100 font-medium">BMI</p>
                          <p className="text-4xl font-bold">
                            {assessment.weight && assessment.height
                              ? (assessment.weight / (assessment.height / 100) ** 2).toFixed(1)
                              : "--"}
                          </p>
                          <p className="text-emerald-200 text-sm">kg/m²</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-2xl">
                          <Weight className="h-8 w-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/25 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 font-medium">Age</p>
                          <p className="text-4xl font-bold">{assessment.age}</p>
                          <p className="text-purple-200 text-sm">years</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-2xl">
                          <Calendar className="h-8 w-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Risk Level Alert */}
                <Alert
                  className={`border-0 rounded-3xl p-6 shadow-2xl ${
                    riskLevel === "Low"
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 shadow-emerald-500/20"
                      : riskLevel === "Moderate"
                        ? "bg-gradient-to-r from-amber-50 to-yellow-50 shadow-amber-500/20"
                        : riskLevel === "High"
                          ? "bg-gradient-to-r from-orange-50 to-red-50 shadow-orange-500/20"
                          : "bg-gradient-to-r from-red-50 to-rose-50 shadow-red-500/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-2xl ${
                        riskLevel === "Low"
                          ? "bg-emerald-500"
                          : riskLevel === "Moderate"
                            ? "bg-amber-500"
                            : riskLevel === "High"
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                    >
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <AlertTitle className="text-xl font-bold text-slate-800 mb-2">
                        Risk Assessment: {riskLevel} Risk
                      </AlertTitle>
                      <AlertDescription className="text-slate-700 text-lg leading-relaxed">
                        {riskLevel === "Low" &&
                          "Excellent! Your cardiovascular risk is low. Continue maintaining your healthy lifestyle habits to keep your heart strong."}
                        {riskLevel === "Moderate" &&
                          "Your cardiovascular risk is moderate. Consider implementing lifestyle modifications and schedule regular health monitoring."}
                        {riskLevel === "High" &&
                          "Your cardiovascular risk is elevated. We recommend consulting with a healthcare provider for a comprehensive evaluation and treatment plan."}
                        {riskLevel === "Very High" &&
                          "Your cardiovascular risk is very high. Immediate medical consultation is strongly recommended for proper assessment and intervention."}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>

                {/* Enhanced Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-slate-500/10 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Activity className="h-6 w-6" />
                        Risk Factors Analysis
                      </CardTitle>
                      <CardDescription className="text-indigo-100">
                        Individual risk factor contributions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
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
                            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-slate-500/10 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-700 text-white p-6">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Target className="h-6 w-6" />
                        Risk Score Meter
                      </CardTitle>
                      <CardDescription className="text-pink-100">Current risk level visualization</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Risk Score",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[300px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
                            <RadialBar dataKey="value" cornerRadius={10} fill={radialData[0]?.fill} />
                            <text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-slate-700 text-2xl font-bold"
                            >
                              {riskScore}/20
                            </text>
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Risk Progress */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-slate-500/10 rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Heart className="h-6 w-6" />
                      Comprehensive Risk Breakdown
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Detailed analysis of all risk components
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-700">Overall Risk Score</span>
                        <span className="text-2xl font-bold text-slate-800">{riskScore}/20</span>
                      </div>
                      <div className="relative">
                        <Progress value={(riskScore / 20) * 100} className="h-4 rounded-full" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                          Modifiable Risk Factors
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                            <div
                              className={`w-4 h-4 rounded-full ${assessment.smoking ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-emerald-500 to-green-600"}`}
                            />
                            <span className="font-medium text-slate-700">
                              Smoking: {assessment.smoking ? "Yes" : "No"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                            <div
                              className={`w-4 h-4 rounded-full ${assessment.weight && assessment.height && assessment.weight / (assessment.height / 100) ** 2 > 25 ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-emerald-500 to-green-600"}`}
                            />
                            <span className="font-medium text-slate-700">
                              BMI:{" "}
                              {assessment.weight && assessment.height
                                ? (assessment.weight / (assessment.height / 100) ** 2).toFixed(1)
                                : "Not calculated"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                            <div
                              className={`w-4 h-4 rounded-full ${assessment.exercise === "none" ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-emerald-500 to-green-600"}`}
                            />
                            <span className="font-medium text-slate-700">
                              Exercise: {assessment.exercise || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                          Non-modifiable Risk Factors
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                            <div
                              className={`w-4 h-4 rounded-full ${assessment.age > 45 ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-emerald-500 to-green-600"}`}
                            />
                            <span className="font-medium text-slate-700">Age: {assessment.age} years</span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                            <div
                              className={`w-4 h-4 rounded-full ${assessment.familyHistory ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-emerald-500 to-green-600"}`}
                            />
                            <span className="font-medium text-slate-700">
                              Family History: {assessment.familyHistory ? "Yes" : "No"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                            <div
                              className={`w-4 h-4 rounded-full ${assessment.diabetes ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-emerald-500 to-green-600"}`}
                            />
                            <span className="font-medium text-slate-700">
                              Diabetes: {assessment.diabetes ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-8">
            {riskScore > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-emerald-500/10 rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <CheckCircle className="h-6 w-6" />
                      Lifestyle Recommendations
                    </CardTitle>
                    <CardDescription className="text-emerald-100">
                      Evidence-based interventions to reduce your risk
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {assessment.smoking && (
                      <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl shadow-lg">
                        <h4 className="font-bold text-red-800 text-lg mb-2">🚭 Smoking Cessation</h4>
                        <p className="text-red-700 leading-relaxed">
                          Quitting smoking can reduce cardiovascular risk by 50% within one year. Consider nicotine
                          replacement therapy or consult your doctor about cessation programs.
                        </p>
                      </div>
                    )}

                    {assessment.weight &&
                      assessment.height &&
                      assessment.weight / (assessment.height / 100) ** 2 > 25 && (
                        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl shadow-lg">
                          <h4 className="font-bold text-orange-800 text-lg mb-2">⚖️ Weight Management</h4>
                          <p className="text-orange-700 leading-relaxed">
                            Losing 5-10% of body weight can significantly improve cardiovascular health. Focus on a
                            balanced diet and regular physical activity.
                          </p>
                        </div>
                      )}

                    {assessment.exercise === "none" && (
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg">
                        <h4 className="font-bold text-blue-800 text-lg mb-2">🏃‍♂️ Physical Activity</h4>
                        <p className="text-blue-700 leading-relaxed">
                          Aim for 150 minutes of moderate-intensity exercise per week. Start with walking and gradually
                          increase intensity.
                        </p>
                      </div>
                    )}

                    {assessment.bloodPressure === "high" && (
                      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-lg">
                        <h4 className="font-bold text-purple-800 text-lg mb-2">🩺 Blood Pressure Control</h4>
                        <p className="text-purple-700 leading-relaxed">
                          Monitor blood pressure regularly and follow medical advice. Reduce sodium intake and manage
                          stress levels.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-blue-500/10 rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Activity className="h-6 w-6" />
                      Medical Follow-up
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Recommended medical interventions and monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {riskLevel === "Very High" && (
                      <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl shadow-lg">
                        <h4 className="font-bold text-red-800 text-lg mb-2">🚨 Immediate Medical Consultation</h4>
                        <p className="text-red-700 leading-relaxed">
                          Schedule an appointment with a cardiologist within 1-2 weeks. Your risk level requires
                          immediate professional assessment.
                        </p>
                      </div>
                    )}

                    {riskLevel === "High" && (
                      <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl shadow-lg">
                        <h4 className="font-bold text-orange-800 text-lg mb-2">🔍 Comprehensive Evaluation</h4>
                        <p className="text-orange-700 leading-relaxed">
                          Consider stress testing, echocardiogram, and comprehensive lipid management with your
                          healthcare provider.
                        </p>
                      </div>
                    )}

                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl shadow-lg">
                      <h4 className="font-bold text-emerald-800 text-lg mb-3">📅 Regular Monitoring Schedule</h4>
                      <div className="space-y-2 text-emerald-700">
                        <p>
                          • <strong>Blood pressure:</strong> Monthly monitoring
                        </p>
                        <p>
                          • <strong>Cholesterol:</strong> Every 6 months
                        </p>
                        <p>
                          • <strong>Weight:</strong> Weekly tracking
                        </p>
                        <p>
                          • <strong>HbA1c (if diabetic):</strong> Every 3 months
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl shadow-lg">
                      <h4 className="font-bold text-indigo-800 text-lg mb-2">💊 Preventive Medications</h4>
                      <p className="text-indigo-700 leading-relaxed">
                        Discuss with your doctor about aspirin therapy, statins, or ACE inhibitors based on your
                        individual risk profile.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {riskScore === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-slate-500/10 rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-3xl shadow-2xl shadow-slate-500/25 mb-6">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-4">Complete Your Risk Assessment</h3>
                  <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                    Please complete the comprehensive risk assessment to receive personalized recommendations and
                    insights.
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
