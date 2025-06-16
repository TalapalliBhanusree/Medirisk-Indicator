from django.contrib import admin
from .models import Patient, RiskAssessment, RiskRecommendation

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'age', 'gender', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['first_name', 'last_name', 'email']
    readonly_fields = ['patient_id', 'created_at', 'updated_at']

class RiskRecommendationInline(admin.TabularInline):
    model = RiskRecommendation
    extra = 0
    readonly_fields = ['created_at']

@admin.register(RiskAssessment)
class RiskAssessmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'risk_level', 'risk_score', 'ten_year_risk_percentage', 'created_at']
    list_filter = ['risk_level', 'created_at', 'smoking_status', 'diabetes']
    search_fields = ['patient__first_name', 'patient__last_name']
    readonly_fields = ['assessment_id', 'bmi', 'risk_score', 'risk_level', 'ten_year_risk_percentage', 'created_at', 'updated_at']
    inlines = [RiskRecommendationInline]
    
    fieldsets = (
        ('Patient Information', {
            'fields': ('patient', 'assessment_id')
        }),
        ('Physical Measurements', {
            'fields': ('weight', 'height', 'bmi', 'systolic_bp', 'diastolic_bp', 'blood_pressure_category')
        }),
        ('Laboratory Values', {
            'fields': ('total_cholesterol', 'hdl_cholesterol', 'ldl_cholesterol', 'triglycerides', 'blood_glucose', 'hba1c')
        }),
        ('Lifestyle Factors', {
            'fields': ('smoking_status', 'smoking_years', 'alcohol_consumption', 'exercise_frequency', 'stress_level')
        }),
        ('Medical History', {
            'fields': ('diabetes', 'hypertension', 'heart_disease', 'stroke_history')
        }),
        ('Family History', {
            'fields': ('family_heart_disease', 'family_diabetes', 'family_stroke')
        }),
        ('Current Medications', {
            'fields': ('on_blood_thinners', 'on_cholesterol_meds', 'on_bp_medication', 'on_diabetes_meds')
        }),
        ('Risk Assessment Results', {
            'fields': ('risk_score', 'risk_level', 'ten_year_risk_percentage'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(RiskRecommendation)
class RiskRecommendationAdmin(admin.ModelAdmin):
    list_display = ['title', 'assessment', 'category', 'priority', 'created_at']
    list_filter = ['category', 'priority', 'created_at']
    search_fields = ['title', 'description', 'assessment__patient__first_name']
