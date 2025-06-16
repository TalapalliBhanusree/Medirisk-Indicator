from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q
import json
from datetime import datetime, timedelta
from .models import Patient, RiskAssessment, RiskRecommendation
from .forms import PatientRegistrationForm, PatientForm, RiskAssessmentForm
from .utils import generate_pdf_report, generate_recommendations

def home(request):
    """Home page with interactive dashboard"""
    context = {
        'total_assessments': RiskAssessment.objects.count(),
        'high_risk_patients': RiskAssessment.objects.filter(risk_level__in=['high', 'very_high']).count(),
        'recent_assessments': RiskAssessment.objects.select_related('patient').order_by('-created_at')[:5]
    }
    return render(request, 'assessment/home.html', context)

def register(request):
    """User registration"""
    if request.method == 'POST':
        form = PatientRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('patient_profile')
    else:
        form = PatientRegistrationForm()
    return render(request, 'registration/register.html', {'form': form})

@login_required
def patient_profile(request):
    """Patient profile management"""
    try:
        patient = Patient.objects.get(user=request.user)
        form = PatientForm(instance=patient)
    except Patient.DoesNotExist:
        patient = None
        form = PatientForm()
    
    if request.method == 'POST':
        if patient:
            form = PatientForm(request.POST, instance=patient)
        else:
            form = PatientForm(request.POST)
        
        if form.is_valid():
            patient = form.save(commit=False)
            patient.user = request.user
            patient.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('assessment_form')
    
    return render(request, 'assessment/patient_profile.html', {'form': form, 'patient': patient})

@login_required
def assessment_form(request):
    """Risk assessment form"""
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        messages.error(request, 'Please complete your profile first.')
        return redirect('patient_profile')
    
    if request.method == 'POST':
        form = RiskAssessmentForm(request.POST)
        if form.is_valid():
            assessment = form.save(commit=False)
            assessment.patient = patient
            assessment.save()
            
            # Generate recommendations
            generate_recommendations(assessment)
            
            messages.success(request, 'Risk assessment completed successfully!')
            return redirect('assessment_results', assessment_id=assessment.assessment_id)
    else:
        form = RiskAssessmentForm()
    
    return render(request, 'assessment/assessment_form.html', {'form': form, 'patient': patient})

@login_required
def assessment_results(request, assessment_id):
    """Display assessment results with interactive dashboard"""
    assessment = get_object_or_404(RiskAssessment, assessment_id=assessment_id)
    
    # Ensure user can only view their own assessments
    if assessment.patient.user != request.user:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    recommendations = assessment.recommendations.all()
    
    # Prepare chart data
    risk_factors_data = {
        'Age': 1 if assessment.patient.age > 45 else 0,
        'BMI': 1 if assessment.bmi and assessment.bmi > 25 else 0,
        'Blood Pressure': 1 if assessment.blood_pressure_category in ['high_stage1', 'high_stage2'] else 0,
        'Cholesterol': 1 if assessment.total_cholesterol > 200 else 0,
        'Smoking': 1 if assessment.smoking_status else 0,
        'Diabetes': 1 if assessment.diabetes else 0,
        'Family History': 1 if assessment.family_heart_disease else 0,
        'Exercise': 1 if assessment.exercise_frequency == 'none' else 0,
    }
    
    context = {
        'assessment': assessment,
        'recommendations': recommendations,
        'risk_factors_data': json.dumps(risk_factors_data),
        'risk_percentage': assessment.ten_year_risk_percentage,
    }
    
    return render(request, 'assessment/results.html', context)

@login_required
def dashboard(request):
    """Patient dashboard with assessment history"""
    try:
        patient = Patient.objects.get(user=request.user)
        assessments = RiskAssessment.objects.filter(patient=patient).order_by('-created_at')
        
        # Pagination
        paginator = Paginator(assessments, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        # Statistics
        total_assessments = assessments.count()
        latest_assessment = assessments.first()
        risk_trend = []
        
        if assessments.count() >= 2:
            recent_assessments = assessments[:5]
            for assessment in reversed(recent_assessments):
                risk_trend.append({
                    'date': assessment.created_at.strftime('%Y-%m-%d'),
                    'score': assessment.risk_score,
                    'percentage': assessment.ten_year_risk_percentage
                })
        
        context = {
            'patient': patient,
            'page_obj': page_obj,
            'total_assessments': total_assessments,
            'latest_assessment': latest_assessment,
            'risk_trend': json.dumps(risk_trend),
        }
        
    except Patient.DoesNotExist:
        messages.error(request, 'Please complete your profile first.')
        return redirect('patient_profile')
    
    return render(request, 'assessment/dashboard.html', context)

@login_required
def generate_report(request, assessment_id):
    """Generate PDF report"""
    assessment = get_object_or_404(RiskAssessment, assessment_id=assessment_id)
    
    # Ensure user can only generate reports for their own assessments
    if assessment.patient.user != request.user:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    try:
        pdf_buffer = generate_pdf_report(assessment)
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="risk_assessment_{assessment.patient.first_name}_{assessment.created_at.strftime("%Y%m%d")}.pdf"'
        return response
    except Exception as e:
        messages.error(request, f'Error generating report: {str(e)}')
        return redirect('assessment_results', assessment_id=assessment_id)

@csrf_exempt
def real_time_risk_calculation(request):
    """AJAX endpoint for real-time risk calculation"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Create temporary assessment object for calculation
            temp_assessment = RiskAssessment()
            
            # Set values from form data
            temp_assessment.weight = float(data.get('weight', 0))
            temp_assessment.height = float(data.get('height', 0))
            temp_assessment.total_cholesterol = int(data.get('total_cholesterol', 0))
            temp_assessment.blood_pressure_category = data.get('blood_pressure_category', 'normal')
            temp_assessment.smoking_status = data.get('smoking_status', False)
            temp_assessment.diabetes = data.get('diabetes', False)
            temp_assessment.exercise_frequency = data.get('exercise_frequency', 'moderate')
            
            # Create temporary patient for age calculation
            from datetime import date
            birth_date = data.get('date_of_birth')
            if birth_date:
                birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
                age = date.today().year - birth_date.year
            else:
                age = 30
            
            class TempPatient:
                def __init__(self, age, gender):
                    self.age = age
                    self.gender = gender
            
            temp_assessment.patient = TempPatient(age, data.get('gender', 'M'))
            
            # Calculate risk
            temp_assessment.calculate_risk()
            
            return JsonResponse({
                'risk_score': temp_assessment.risk_score,
                'risk_level': temp_assessment.risk_level,
                'ten_year_risk': temp_assessment.ten_year_risk_percentage,
                'bmi': temp_assessment.bmi
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def assessment_history_api(request):
    """API endpoint for assessment history charts"""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    try:
        patient = Patient.objects.get(user=request.user)
        assessments = RiskAssessment.objects.filter(patient=patient).order_by('created_at')
        
        data = []
        for assessment in assessments:
            data.append({
                'date': assessment.created_at.strftime('%Y-%m-%d'),
                'risk_score': assessment.risk_score,
                'ten_year_risk': assessment.ten_year_risk_percentage,
                'bmi': assessment.bmi,
                'risk_level': assessment.risk_level
            })
        
        return JsonResponse({'data': data})
        
    except Patient.DoesNotExist:
        return JsonResponse({'error': 'Patient profile not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
