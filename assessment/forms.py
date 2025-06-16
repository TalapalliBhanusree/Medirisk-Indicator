from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Row, Column, Submit, HTML, Div
from crispy_forms.bootstrap import Field
from .models import Patient, RiskAssessment

class PatientRegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=100, required=True)
    last_name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('first_name', css_class='form-group col-md-6 mb-3'),
                Column('last_name', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            Row(
                Column('username', css_class='form-group col-md-6 mb-3'),
                Column('email', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            Row(
                Column('password1', css_class='form-group col-md-6 mb-3'),
                Column('password2', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            Submit('submit', 'Create Account', css_class='btn btn-primary btn-lg w-100')
        )

class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'gender']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            HTML('<h4 class="mb-4"><i class="fas fa-user-circle me-2"></i>Personal Information</h4>'),
            Row(
                Column('first_name', css_class='form-group col-md-6 mb-3'),
                Column('last_name', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            Row(
                Column('email', css_class='form-group col-md-6 mb-3'),
                Column('phone', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            Row(
                Column('date_of_birth', css_class='form-group col-md-6 mb-3'),
                Column('gender', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
        )

class RiskAssessmentForm(forms.ModelForm):
    class Meta:
        model = RiskAssessment
        fields = [
            'weight', 'height', 'systolic_bp', 'diastolic_bp', 'blood_pressure_category',
            'total_cholesterol', 'hdl_cholesterol', 'ldl_cholesterol', 'triglycerides',
            'blood_glucose', 'hba1c', 'smoking_status', 'smoking_years', 'alcohol_consumption',
            'exercise_frequency', 'stress_level', 'diabetes', 'hypertension', 'heart_disease',
            'stroke_history', 'family_heart_disease', 'family_diabetes', 'family_stroke',
            'on_blood_thinners', 'on_cholesterol_meds', 'on_bp_medication', 'on_diabetes_meds'
        ]
        widgets = {
            'stress_level': forms.NumberInput(attrs={'min': 1, 'max': 10, 'step': 1}),
            'smoking_years': forms.NumberInput(attrs={'min': 0, 'max': 80}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            # Physical Measurements
            HTML('<div class="assessment-section"><h4 class="section-title"><i class="fas fa-weight me-2"></i>Physical Measurements</h4>'),
            Row(
                Column('weight', css_class='form-group col-md-3 mb-3'),
                Column('height', css_class='form-group col-md-3 mb-3'),
                Column('systolic_bp', css_class='form-group col-md-3 mb-3'),
                Column('diastolic_bp', css_class='form-group col-md-3 mb-3'),
                css_class='form-row'
            ),
            'blood_pressure_category',
            HTML('</div>'),
            
            # Laboratory Values
            HTML('<div class="assessment-section"><h4 class="section-title"><i class="fas fa-vial me-2"></i>Laboratory Values</h4>'),
            Row(
                Column('total_cholesterol', css_class='form-group col-md-3 mb-3'),
                Column('hdl_cholesterol', css_class='form-group col-md-3 mb-3'),
                Column('ldl_cholesterol', css_class='form-group col-md-3 mb-3'),
                Column('triglycerides', css_class='form-group col-md-3 mb-3'),
                css_class='form-row'
            ),
            Row(
                Column('blood_glucose', css_class='form-group col-md-6 mb-3'),
                Column('hba1c', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            HTML('</div>'),
            
            # Lifestyle Factors
            HTML('<div class="assessment-section"><h4 class="section-title"><i class="fas fa-running me-2"></i>Lifestyle Factors</h4>'),
            Row(
                Column('exercise_frequency', css_class='form-group col-md-6 mb-3'),
                Column('stress_level', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            Row(
                Column('smoking_status', css_class='form-group col-md-6 mb-3'),
                Column('smoking_years', css_class='form-group col-md-6 mb-3'),
                css_class='form-row'
            ),
            'alcohol_consumption',
            HTML('</div>'),
            
            # Medical History
            HTML('<div class="assessment-section"><h4 class="section-title"><i class="fas fa-notes-medical me-2"></i>Medical History</h4>'),
            Row(
                Column('diabetes', css_class='form-group col-md-4 mb-3'),
                Column('hypertension', css_class='form-group col-md-4 mb-3'),
                Column('heart_disease', css_class='form-group col-md-4 mb-3'),
                css_class='form-row'
            ),
            'stroke_history',
            HTML('</div>'),
            
            # Family History
            HTML('<div class="assessment-section"><h4 class="section-title"><i class="fas fa-users me-2"></i>Family History</h4>'),
            Row(
                Column('family_heart_disease', css_class='form-group col-md-4 mb-3'),
                Column('family_diabetes', css_class='form-group col-md-4 mb-3'),
                Column('family_stroke', css_class='form-group col-md-4 mb-3'),
                css_class='form-row'
            ),
            HTML('</div>'),
            
            # Current Medications
            HTML('<div class="assessment-section"><h4 class="section-title"><i class="fas fa-pills me-2"></i>Current Medications</h4>'),
            Row(
                Column('on_blood_thinners', css_class='form-group col-md-3 mb-3'),
                Column('on_cholesterol_meds', css_class='form-group col-md-3 mb-3'),
                Column('on_bp_medication', css_class='form-group col-md-3 mb-3'),
                Column('on_diabetes_meds', css_class='form-group col-md-3 mb-3'),
                css_class='form-row'
            ),
            HTML('</div>'),
            
            Submit('submit', 'Calculate Risk Assessment', css_class='btn btn-primary btn-lg w-100 mt-4')
        )
