import { Chart } from "@/components/ui/chart"
// Main JavaScript file for MediRisk Indicator

document.addEventListener("DOMContentLoaded", () => {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Initialize popovers
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Form validation enhancement
  const forms = document.querySelectorAll(".needs-validation")
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()

          // Focus on first invalid field
          const firstInvalid = form.querySelector(":invalid")
          if (firstInvalid) {
            firstInvalid.focus()
          }
        }
        form.classList.add("was-validated")
      },
      false,
    )
  })

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert:not(.alert-permanent)")
  alerts.forEach((alert) => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert)
      bsAlert.close()
    }, 5000)
  })

  // Loading states for buttons
  document.querySelectorAll('.btn[type="submit"]').forEach((button) => {
    button.addEventListener("click", function () {
      const originalText = this.innerHTML
      this.innerHTML = '<span class="loading-spinner me-2"></span>Processing...'
      this.disabled = true

      // Re-enable after 10 seconds as fallback
      setTimeout(() => {
        this.innerHTML = originalText
        this.disabled = false
      }, 10000)
    })
  })

  // Real-time form progress
  function updateFormProgress(form) {
    const progressBar = form.querySelector(".progress-bar")
    if (!progressBar) return

    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea')
    let filledInputs = 0

    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        if (input.checked) filledInputs++
      } else if (input.value.trim() !== "") {
        filledInputs++
      }
    })

    const progress = (filledInputs / inputs.length) * 100
    progressBar.style.width = progress + "%"
    progressBar.setAttribute("aria-valuenow", progress)
  }

  // Apply progress tracking to forms with progress bars
  document.querySelectorAll("form .progress-bar").forEach((progressBar) => {
    const form = progressBar.closest("form")
    if (form) {
      const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea')
      inputs.forEach((input) => {
        input.addEventListener("input", () => updateFormProgress(form))
        input.addEventListener("change", () => updateFormProgress(form))
      })
      updateFormProgress(form)
    }
  })

  // Chart.js global defaults
  if (typeof Chart !== "undefined") {
    Chart.defaults.font.family = "'Inter', sans-serif"
    Chart.defaults.color = "#6b7280"
    Chart.defaults.plugins.legend.labels.usePointStyle = true
    Chart.defaults.plugins.legend.labels.padding = 20
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInUp")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .dashboard-card, .recommendation-card").forEach((el) => {
    observer.observe(el)
  })

  // Counter animation
  function animateCounter(element, target, duration = 2000) {
    const start = 0
    const increment = target / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = Math.floor(current)
    }, 16)
  }

  // Animate counters when they come into view
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number.parseInt(entry.target.getAttribute("data-count"))
        animateCounter(entry.target, target)
        counterObserver.unobserve(entry.target)
      }
    })
  })

  document.querySelectorAll("[data-count]").forEach((counter) => {
    counterObserver.observe(counter)
  })

  // BMI Calculator utility
  window.calculateBMI = (weight, height) => {
    if (!weight || !height) return 0
    const heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
  }

  // Risk level color utility
  window.getRiskLevelColor = (level) => {
    const colors = {
      low: "#10b981",
      moderate: "#f59e0b",
      high: "#f97316",
      very_high: "#ef4444",
    }
    return colors[level] || "#6b7280"
  }

  // Format number utility
  window.formatNumber = (num, decimals = 1) => Number.parseFloat(num).toFixed(decimals)

  // Date formatting utility
  window.formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
})

// Export utilities for use in other scripts
window.MediRisk = {
  calculateBMI: window.calculateBMI,
  getRiskLevelColor: window.getRiskLevelColor,
  formatNumber: window.formatNumber,
  formatDate: window.formatDate,
}
