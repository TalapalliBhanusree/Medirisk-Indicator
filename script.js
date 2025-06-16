import { Chart } from "@/components/ui/chart"
// Global variables
let riskScore = 0
let riskLevel = ""
const assessment = {
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
}

// Chart instances
let riskFactorsChart = null
let riskMeterChart = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeTabs()
  initializeForm()
})

// Tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab")

      // Remove active class from all tabs and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      button.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })
}

// Form functionality
function initializeForm() {
  const form = document.getElementById("riskForm")
  form.addEventListener("submit", handleFormSubmit)

  // Add input event listeners for real-time updates
  const inputs = form.querySelectorAll("input, select")
  inputs.forEach((input) => {
    input.addEventListener("change", updateAssessment)
  })
}

function updateAssessment() {
  assessment.age = Number.parseInt(document.getElementById("age").value) || 0
  assessment.gender = document.getElementById("gender").value
  assessment.weight = Number.parseFloat(document.getElementById("weight").value) || 0
  assessment.height = Number.parseFloat(document.getElementById("height").value) || 0
  assessment.bloodPressure = document.getElementById("bloodPressure").value
  assessment.cholesterol = Number.parseInt(document.getElementById("cholesterol").value) || 0
  assessment.smoking = document.getElementById("smoking").checked
  assessment.diabetes = document.getElementById("diabetes").checked
  assessment.familyHistory = document.getElementById("familyHistory").checked
  assessment.exercise = document.getElementById("exercise").value
}

function handleFormSubmit(e) {
  e.preventDefault()
  updateAssessment()
  calculateRisk()
  updateDashboard()
  updateRecommendations()

  // Switch to dashboard tab
  document.querySelector('[data-tab="dashboard"]').click()
}

function calculateRisk() {
  let score = 0

  // Age factor
  if (assessment.age > 65) score += 3
  else if (assessment.age > 45) score += 2
  else if (assessment.age > 35) score += 1

  // BMI calculation
  if (assessment.weight && assessment.height) {
    const bmi = assessment.weight / (assessment.height / 100) ** 2
    if (bmi > 30) score += 3
    else if (bmi > 25) score += 2
    else if (bmi < 18.5) score += 1
  }

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

  riskScore = score

  if (score <= 5) riskLevel = "Low"
  else if (score <= 10) riskLevel = "Moderate"
  else if (score <= 15) riskLevel = "High"
  else riskLevel = "Very High"
}

function updateDashboard() {
  const dashboardContent = document.getElementById("dashboardContent")

  if (riskScore === 0) {
    dashboardContent.className = "dashboard-hidden"
    dashboardContent.innerHTML = `
            <p class="no-data-message">
                <i class="fas fa-heart"></i>
                Please complete the risk assessment to view your dashboard
            </p>
        `
    return
  }

  dashboardContent.className = ""

  const bmi =
    assessment.weight && assessment.height ? (assessment.weight / (assessment.height / 100) ** 2).toFixed(1) : "--"

  const riskClass = riskLevel.toLowerCase().replace(" ", "-")

  dashboardContent.innerHTML = `
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card gradient-bg blue">
                <div class="stat-content">
                    <div class="stat-info">
                        <h3>Risk Score</h3>
                        <div class="value">${riskScore}</div>
                        <div class="unit">out of 20</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-content">
                    <div class="stat-info">
                        <h3>Risk Level</h3>
                        <div class="risk-badge ${riskClass}">${riskLevel}</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-exclamation-triangle" style="color: #f97316;"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card gradient-bg emerald">
                <div class="stat-content">
                    <div class="stat-info">
                        <h3>BMI</h3>
                        <div class="value">${bmi}</div>
                        <div class="unit">kg/m²</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-weight"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card gradient-bg purple">
                <div class="stat-content">
                    <div class="stat-info">
                        <h3>Age</h3>
                        <div class="value">${assessment.age}</div>
                        <div class="unit">years</div>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-calendar"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Risk Alert -->
        <div class="alert ${riskClass}">
            <div class="alert-icon ${riskClass}">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="alert-content">
                <h4>Risk Assessment: ${riskLevel} Risk</h4>
                <p>${getRiskMessage(riskLevel)}</p>
            </div>
        </div>

        <!-- Charts -->
        <div class="charts-grid">
            <div class="card">
                <div class="card-header gradient-indigo">
                    <div class="card-header-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <div>
                        <h2 class="card-title">Risk Factors Analysis</h2>
                        <p class="card-description">Individual risk factor contributions</p>
                    </div>
                </div>
                <div class="card-content">
                    <div class="chart-container">
                        <canvas id="riskFactorsChart"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header gradient-pink">
                    <div class="card-header-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div>
                        <h2 class="card-title">Risk Score Meter</h2>
                        <p class="card-description">Current risk level visualization</p>
                    </div>
                </div>
                <div class="card-content">
                    <div class="chart-container">
                        <canvas id="riskMeterChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Risk Breakdown -->
        <div class="card">
            <div class="card-header gradient-slate">
                <div class="card-header-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <div>
                    <h2 class="card-title">Comprehensive Risk Breakdown</h2>
                    <p class="card-description">Detailed analysis of all risk components</p>
                </div>
            </div>
            <div class="card-content">
                <div class="progress-container">
                    <div class="progress-header">
                        <span style="font-size: 1.125rem; font-weight: 600; color: #374151;">Overall Risk Score</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">${riskScore}/20</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(riskScore / 20) * 100}%"></div>
                    </div>
                </div>
                
                <div class="risk-breakdown">
                    <div class="risk-section modifiable">
                        <h4>Modifiable Risk Factors</h4>
                        ${generateRiskItems("modifiable")}
                    </div>
                    <div class="risk-section non-modifiable">
                        <h4>Non-modifiable Risk Factors</h4>
                        ${generateRiskItems("non-modifiable")}
                    </div>
                </div>
            </div>
        </div>
    `

  // Initialize charts after DOM is updated
  setTimeout(() => {
    initializeCharts()
  }, 100)
}

function getRiskMessage(level) {
  const messages = {
    Low: "Excellent! Your cardiovascular risk is low. Continue maintaining your healthy lifestyle habits to keep your heart strong.",
    Moderate:
      "Your cardiovascular risk is moderate. Consider implementing lifestyle modifications and schedule regular health monitoring.",
    High: "Your cardiovascular risk is elevated. We recommend consulting with a healthcare provider for a comprehensive evaluation and treatment plan.",
    "Very High":
      "Your cardiovascular risk is very high. Immediate medical consultation is strongly recommended for proper assessment and intervention.",
  }
  return messages[level] || ""
}

function generateRiskItems(type) {
  let items = ""

  if (type === "modifiable") {
    items += `
            <div class="risk-item">
                <div class="risk-indicator ${assessment.smoking ? "danger" : "good"}"></div>
                <span>Smoking: ${assessment.smoking ? "Yes" : "No"}</span>
            </div>
        `

    const bmi = assessment.weight && assessment.height ? assessment.weight / (assessment.height / 100) ** 2 : 0
    const bmiStatus = bmi > 25 ? "warning" : "good"
    const bmiValue = bmi > 0 ? bmi.toFixed(1) : "Not calculated"

    items += `
            <div class="risk-item">
                <div class="risk-indicator ${bmiStatus}"></div>
                <span>BMI: ${bmiValue}</span>
            </div>
        `

    items += `
            <div class="risk-item">
                <div class="risk-indicator ${assessment.exercise === "none" ? "danger" : "good"}"></div>
                <span>Exercise: ${assessment.exercise || "Not specified"}</span>
            </div>
        `
  } else {
    items += `
            <div class="risk-item">
                <div class="risk-indicator ${assessment.age > 45 ? "warning" : "good"}"></div>
                <span>Age: ${assessment.age} years</span>
            </div>
        `

    items += `
            <div class="risk-item">
                <div class="risk-indicator ${assessment.familyHistory ? "warning" : "good"}"></div>
                <span>Family History: ${assessment.familyHistory ? "Yes" : "No"}</span>
            </div>
        `

    items += `
            <div class="risk-item">
                <div class="risk-indicator ${assessment.diabetes ? "danger" : "good"}"></div>
                <span>Diabetes: ${assessment.diabetes ? "Yes" : "No"}</span>
            </div>
        `
  }

  return items
}

function initializeCharts() {
  // Destroy existing charts
  if (riskFactorsChart) {
    riskFactorsChart.destroy()
  }
  if (riskMeterChart) {
    riskMeterChart.destroy()
  }

  // Risk Factors Chart
  const riskFactorsCtx = document.getElementById("riskFactorsChart")
  if (riskFactorsCtx) {
    const bmi = assessment.weight && assessment.height ? assessment.weight / (assessment.height / 100) ** 2 : 0

    const riskFactorsData = {
      labels: ["Age", "BMI", "BP", "Cholesterol", "Smoking", "Diabetes"],
      datasets: [
        {
          label: "Risk Factor Present",
          data: [
            assessment.age > 45 ? 1 : 0,
            bmi > 25 ? 1 : 0,
            assessment.bloodPressure === "high" ? 1 : 0,
            assessment.cholesterol > 200 ? 1 : 0,
            assessment.smoking ? 1 : 0,
            assessment.diabetes ? 1 : 0,
          ],
          backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444", "#06b6d4"],
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }

    riskFactorsChart = new Chart(riskFactorsCtx, {
      type: "bar",
      data: riskFactorsData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              stepSize: 1,
              callback: (value) => (value === 1 ? "Present" : "Absent"),
            },
          },
        },
      },
    })
  }

  // Risk Meter Chart
  const riskMeterCtx = document.getElementById("riskMeterChart")
  if (riskMeterCtx) {
    const riskPercentage = (riskScore / 20) * 100
    const remainingPercentage = 100 - riskPercentage

    const riskColor =
      riskLevel === "Low"
        ? "#10b981"
        : riskLevel === "Moderate"
          ? "#f59e0b"
          : riskLevel === "High"
            ? "#f97316"
            : "#ef4444"

    riskMeterChart = new Chart(riskMeterCtx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [riskPercentage, remainingPercentage],
            backgroundColor: [riskColor, "#e5e7eb"],
            borderWidth: 0,
            cutout: "70%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
      plugins: [
        {
          id: "centerText",
          beforeDraw: (chart) => {
            const ctx = chart.ctx
            ctx.save()
            const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2
            const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2

            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.font = "bold 24px Arial"
            ctx.fillStyle = "#374151"
            ctx.fillText(`${riskScore}/20`, centerX, centerY)
            ctx.restore()
          },
        },
      ],
    })
  }
}

function updateRecommendations() {
  const recommendationsContent = document.getElementById("recommendationsContent")

  if (riskScore === 0) {
    recommendationsContent.className = "recommendations-hidden"
    recommendationsContent.innerHTML = `
            <div class="card">
                <div class="card-content no-data">
                    <div class="no-data-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>Complete Your Risk Assessment</h3>
                    <p>Please complete the comprehensive risk assessment to receive personalized recommendations and insights.</p>
                </div>
            </div>
        `
    return
  }

  recommendationsContent.className = ""

  let lifestyleRecommendations = ""
  let medicalRecommendations = ""

  // Lifestyle recommendations
  if (assessment.smoking) {
    lifestyleRecommendations += `
            <div class="recommendation-item smoking">
                <h4>🚭 Smoking Cessation</h4>
                <p>Quitting smoking can reduce cardiovascular risk by 50% within one year. Consider nicotine replacement therapy or consult your doctor about cessation programs.</p>
            </div>
        `
  }

  const bmi = assessment.weight && assessment.height ? assessment.weight / (assessment.height / 100) ** 2 : 0
  if (bmi > 25) {
    lifestyleRecommendations += `
            <div class="recommendation-item weight">
                <h4>⚖️ Weight Management</h4>
                <p>Losing 5-10% of body weight can significantly improve cardiovascular health. Focus on a balanced diet and regular physical activity.</p>
            </div>
        `
  }

  if (assessment.exercise === "none") {
    lifestyleRecommendations += `
            <div class="recommendation-item exercise">
                <h4>🏃‍♂️ Physical Activity</h4>
                <p>Aim for 150 minutes of moderate-intensity exercise per week. Start with walking and gradually increase intensity.</p>
            </div>
        `
  }

  if (assessment.bloodPressure === "high") {
    lifestyleRecommendations += `
            <div class="recommendation-item bp">
                <h4>🩺 Blood Pressure Control</h4>
                <p>Monitor blood pressure regularly and follow medical advice. Reduce sodium intake and manage stress levels.</p>
            </div>
        `
  }

  // Medical recommendations
  if (riskLevel === "Very High") {
    medicalRecommendations += `
            <div class="recommendation-item urgent">
                <h4>🚨 Immediate Medical Consultation</h4>
                <p>Schedule an appointment with a cardiologist within 1-2 weeks. Your risk level requires immediate professional assessment.</p>
            </div>
        `
  }

  if (riskLevel === "High") {
    medicalRecommendations += `
            <div class="recommendation-item urgent">
                <h4>🔍 Comprehensive Evaluation</h4>
                <p>Consider stress testing, echocardiogram, and comprehensive lipid management with your healthcare provider.</p>
            </div>
        `
  }

  medicalRecommendations += `
        <div class="recommendation-item medical">
            <h4>📅 Regular Monitoring Schedule</h4>
            <p>• <strong>Blood pressure:</strong> Monthly monitoring<br>
            • <strong>Cholesterol:</strong> Every 6 months<br>
            • <strong>Weight:</strong> Weekly tracking<br>
            • <strong>HbA1c (if diabetic):</strong> Every 3 months</p>
        </div>
    `

  medicalRecommendations += `
        <div class="recommendation-item medical">
            <h4>💊 Preventive Medications</h4>
            <p>Discuss with your doctor about aspirin therapy, statins, or ACE inhibitors based on your individual risk profile.</p>
        </div>
    `

  recommendationsContent.innerHTML = `
        <div class="recommendations-grid">
            <div class="card">
                <div class="card-header gradient-emerald">
                    <div class="card-header-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div>
                        <h2 class="card-title">Lifestyle Recommendations</h2>
                        <p class="card-description">Evidence-based interventions to reduce your risk</p>
                    </div>
                </div>
                <div class="card-content">
                    ${lifestyleRecommendations || '<p style="color: #10b981; font-weight: 600;">Great job! Continue maintaining your current healthy lifestyle.</p>'}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header gradient-blue">
                    <div class="card-header-icon">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <div>
                        <h2 class="card-title">Medical Follow-up</h2>
                        <p class="card-description">Recommended medical interventions and monitoring</p>
                    </div>
                </div>
                <div class="card-content">
                    ${medicalRecommendations}
                </div>
            </div>
        </div>
    `
}
