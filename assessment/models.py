from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    patient_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))

class RiskAssessment(models.Model):
    BLOOD_PRESSURE_CHOICES = [
        ('normal', 'Normal (<120/80)'),
        ('elevated', 'Elevated (120-129/<80)'),
        ('high_stage1', 'High Stage 1 (130-139/80-89)'),
        ('high_stage2', 'High Stage 2 (≥140/90)'),
    ]
    
    EXERCISE_CHOICES = [
        ('none', 'None'),
        ('light', 'Light (1-2 days/week)'),
        ('moderate', 'Moderate (3-4 days/week)'),
        ('intense', 'Intense (5+ days/week)'),
    ]
    
    RISK_LEVEL_CHOICES = [
        ('low', 'Low Risk'),
        ('moderate', 'Moderate Risk'),
        ('high', 'High Risk'),
        ('very_high', 'Very High Risk'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    assessment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Physical measurements
    weight = models.FloatField(validators=[MinValueValidator(1), MaxValueValidator(500)])
    height = models.FloatField(validators=[MinValueValidator(50), MaxValueValidator(300)])
    systolic_bp = models.IntegerField(validators=[MinValueValidator(70), MaxValueValidator(250)])
    diastolic_bp = models.IntegerField(validators=[MinValueValidator(40), MaxValueValidator(150)])
    blood_pressure_category = models.CharField(max_length=20, choices=BLOOD_PRESSURE_CHOICES)
    
    # Lab values
    total_cholesterol = models.IntegerField(validators=[MinValueValidator(100), MaxValueValidator(500)])
    hdl_cholesterol = models.IntegerField(validators=[MinValueValidator(20), MaxValueValidator(100)])
    ldl_cholesterol = models.IntegerField(validators=[MinValueValidator(50), MaxValueValidator(300)])
    triglycerides = models.IntegerField(validators=[MinValueValidator(50), MaxValueValidator(1000)])
    blood_glucose = models.IntegerField(validators=[MinValueValidator(70), MaxValueValidator(400)])
    hba1c = models.FloatField(validators=[MinValueValidator(4.0), MaxValueValidator(15.0)], null=True, blank=True)
    
    # Lifestyle factors
    smoking_status = models.BooleanField(default=False)
    smoking_years = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(80)])
    alcohol_consumption = models.CharField(max_length=20, default='none')
    exercise_frequency = models.CharField(max_length=20, choices=EXERCISE_CHOICES)
    stress_level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], default=5)
    
    # Medical history
    diabetes = models.BooleanField(default=False)
    hypertension = models.BooleanField(default=False)
    heart_disease = models.BooleanField(default=False)
    stroke_history = models.BooleanField(default=False)
    family_heart_disease = models.BooleanField(default=False)
    family_diabetes = models.BooleanField(default=False)
    family_stroke = models.BooleanField(default=False)
    
    # Medications
    on_blood_thinners = models.BooleanField(default=False)
    on_cholesterol_meds = models.BooleanField(default=False)
    on_bp_medication = models.BooleanField(default=False)
    on_diabetes_meds = models.BooleanField(default=False)
    
    # Calculated results
    bmi = models.FloatField(null=True, blank=True)
    risk_score = models.IntegerField(default=0)
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES, default='low')
    ten_year_risk_percentage = models.FloatField(default=0.0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Assessment for {self.patient} - {self.created_at.strftime('%Y-%m-%d')}"
    
    def save(self, *args, **kwargs):
        # Calculate BMI
        if self.weight and self.height:
            height_m = self.height / 100
            self.bmi = round(self.weight / (height_m ** 2), 1)
        
        # Calculate risk score and level
        self.calculate_risk()
        super().save(*args, **kwargs)
    
    def calculate_risk(self):
        """Advanced cardiovascular risk calculation"""
        score = 0
        
        # Age factor (using patient's age)
        age = self.patient.age
        if age >= 75:
            score += 5
        elif age >= 65:
            score += 4
        elif age >= 55:
            score += 3
        elif age >= 45:
            score += 2
        elif age >= 35:
            score += 1
        
        # Gender factor
        if self.patient.gender == 'M' and age >= 45:
            score += 1
        elif self.patient.gender == 'F' and age >= 55:
            score += 1
        
        # BMI factor
        if self.bmi:
            if self.bmi >= 35:
                score += 4
            elif self.bmi >= 30:
                score += 3
            elif self.bmi >= 25:
                score += 2
            elif self.bmi < 18.5:
                score += 1
        
        # Blood pressure factor
        if self.blood_pressure_category == 'high_stage2':
            score += 4
        elif self.blood_pressure_category == 'high_stage1':
            score += 3
        elif self.blood_pressure_category == 'elevated':
            score += 2
        
        # Cholesterol factors
        if self.total_cholesterol >= 280:
            score += 4
        elif self.total_cholesterol >= 240:
            score += 3
        elif self.total_cholesterol >= 200:
            score += 2
        
        if self.hdl_cholesterol < 35:
            score += 2
        elif self.hdl_cholesterol < 45:
            score += 1
        
        if self.ldl_cholesterol >= 190:
            score += 3
        elif self.ldl_cholesterol >= 160:
            score += 2
        elif self.ldl_cholesterol >= 130:
            score += 1
        
        # Diabetes and glucose
        if self.diabetes:
            score += 4
        elif self.blood_glucose >= 126:
            score += 3
        elif self.blood_glucose >= 100:
            score += 1
        
        # Smoking
        if self.smoking_status:
            if self.smoking_years >= 20:
                score += 4
            elif self.smoking_years >= 10:
                score += 3
            else:
                score += 2
        
        # Exercise
        if self.exercise_frequency == 'none':
            score += 3
        elif self.exercise_frequency == 'light':
            score += 1
        
        # Medical history
        if self.heart_disease:
            score += 5
        if self.stroke_history:
            score += 4
        if self.hypertension:
            score += 2
        
        # Family history
        if self.family_heart_disease:
            score += 2
        if self.family_diabetes:
            score += 1
        if self.family_stroke:
            score += 1
        
        # Stress level
        if self.stress_level >= 8:
            score += 2
        elif self.stress_level >= 6:
            score += 1
        
        self.risk_score = score
        
        # Determine risk level
        if score <= 8:
            self.risk_level = 'low'
            self.ten_year_risk_percentage = min(score * 1.5, 10)
        elif score <= 15:
            self.risk_level = 'moderate'
            self.ten_year_risk_percentage = 10 + (score - 8) * 2.5
        elif score <= 25:
            self.risk_level = 'high'
            self.ten_year_risk_percentage = 25 + (score - 15) * 3
        else:
            self.risk_level = 'very_high'
            self.ten_year_risk_percentage = min(55 + (score - 25) * 2, 85)

class RiskRecommendation(models.Model):
    CATEGORY_CHOICES = [
        ('lifestyle', 'Lifestyle'),
        ('medical', 'Medical'),
        ('dietary', 'Dietary'),
        ('exercise', 'Exercise'),
        ('monitoring', 'Monitoring'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    assessment = models.ForeignKey(RiskAssessment, on_delete=models.CASCADE, related_name='recommendations')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='fas fa-heart')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['priority', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.assessment.patient}"
