from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
import io
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from .models import RiskRecommendation

def generate_pdf_report(assessment):
    """Generate comprehensive PDF report"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.darkblue,
        alignment=1  # Center alignment
    )
    
    story.append(Paragraph("Cardiovascular Risk Assessment Report", title_style))
    story.append(Spacer(1, 20))
    
    # Patient Information
    patient_info = [
        ['Patient Name:', f"{assessment.patient.first_name} {assessment.patient.last_name}"],
        ['Age:', f"{assessment.patient.age} years"],
        ['Gender:', assessment.patient.get_gender_display()],
        ['Assessment Date:', assessment.created_at.strftime('%B %d, %Y')],
        ['Assessment ID:', str(assessment.assessment_id)[:8]],
    ]
    
    patient_table = Table(patient_info, colWidths=[2*inch, 3*inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(Paragraph("Patient Information", styles['Heading2']))
    story.append(patient_table)
    story.append(Spacer(1, 20))
    
    # Risk Assessment Results
    risk_color = colors.green
    if assessment.risk_level == 'moderate':
        risk_color = colors.orange
    elif assessment.risk_level == 'high':
        risk_color = colors.red
    elif assessment.risk_level == 'very_high':
        risk_color = colors.darkred
    
    risk_results = [
        ['Risk Score:', f"{assessment.risk_score}/40"],
        ['Risk Level:', assessment.get_risk_level_display()],
        ['10-Year Risk:', f"{assessment.ten_year_risk_percentage:.1f}%"],
        ['BMI:', f"{assessment.bmi:.1f} kg/m²"],
    ]
    
    risk_table = Table(risk_results, colWidths=[2*inch, 3*inch])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightblue),
        ('BACKGROUND', (1, 1), (1, 1), risk_color),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('TEXTCOLOR', (1, 1), (1, 1), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(Paragraph("Risk Assessment Results", styles['Heading2']))
    story.append(risk_table)
    story.append(Spacer(1, 20))
    
    # Clinical Measurements
    measurements = [
        ['Weight:', f"{assessment.weight} kg"],
        ['Height:', f"{assessment.height} cm"],
        ['Blood Pressure:', f"{assessment.systolic_bp}/{assessment.diastolic_bp} mmHg"],
        ['Total Cholesterol:', f"{assessment.total_cholesterol} mg/dL"],
        ['HDL Cholesterol:', f"{assessment.hdl_cholesterol} mg/dL"],
        ['LDL Cholesterol:', f"{assessment.ldl_cholesterol} mg/dL"],
        ['Blood Glucose:', f"{assessment.blood_glucose} mg/dL"],
    ]
    
    measurements_table = Table(measurements, colWidths=[2.5*inch, 2.5*inch])
    measurements_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(Paragraph("Clinical Measurements", styles['Heading2']))
    story.append(measurements_table)
    story.append(Spacer(1, 20))
    
    # Recommendations
    recommendations = assessment.recommendations.all()
    if recommendations:
        story.append(Paragraph("Personalized Recommendations", styles['Heading2']))
        
        for rec in recommendations:
            priority_color = colors.green
            if rec.priority == 'medium':
                priority_color = colors.orange
            elif rec.priority == 'high':
                priority_color = colors.red
            elif rec.priority == 'urgent':
                priority_color = colors.darkred
            
            rec_style = ParagraphStyle(
                'RecommendationStyle',
                parent=styles['Normal'],
                fontSize=11,
                spaceAfter=10,
                leftIndent=20
            )
            
            title_style = ParagraphStyle(
                'RecTitleStyle',
                parent=styles['Normal'],
                fontSize=12,
                textColor=priority_color,
                fontName='Helvetica-Bold',
                spaceAfter=5
            )
            
            story.append(Paragraph(f"• {rec.title}", title_style))
            story.append(Paragraph(rec.description, rec_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

def generate_recommendations(assessment):
    """Generate personalized recommendations based on assessment"""
    recommendations = []
    
    # Clear existing recommendations
    RiskRecommendation.objects.filter(assessment=assessment).delete()
    
    # Smoking recommendations
    if assessment.smoking_status:
        recommendations.append({
            'category': 'lifestyle',
            'priority': 'urgent',
            'title': 'Smoking Cessation Program',
            'description': 'Quitting smoking is the single most important step you can take to reduce your cardiovascular risk. Consider nicotine replacement therapy, prescription medications, or counseling programs. Your risk can decrease by 50% within one year of quitting.',
            'icon': 'fas fa-smoking-ban'
        })
    
    # BMI recommendations
    if assessment.bmi and assessment.bmi > 25:
        priority = 'high' if assessment.bmi > 30 else 'medium'
        recommendations.append({
            'category': 'lifestyle',
            'priority': priority,
            'title': 'Weight Management Program',
            'description': f'Your BMI is {assessment.bmi:.1f}. Losing 5-10% of your body weight can significantly reduce cardiovascular risk. Focus on a balanced diet with reduced calories and increased physical activity.',
            'icon': 'fas fa-weight'
        })
    
    # Exercise recommendations
    if assessment.exercise_frequency in ['none', 'light']:
        recommendations.append({
            'category': 'exercise',
            'priority': 'high',
            'title': 'Increase Physical Activity',
            'description': 'Aim for at least 150 minutes of moderate-intensity aerobic activity per week. Start gradually with walking and progressively increase intensity. Include strength training exercises twice per week.',
            'icon': 'fas fa-running'
        })
    
    # Blood pressure recommendations
    if assessment.blood_pressure_category in ['high_stage1', 'high_stage2']:
        priority = 'urgent' if assessment.blood_pressure_category == 'high_stage2' else 'high'
        recommendations.append({
            'category': 'medical',
            'priority': priority,
            'title': 'Blood Pressure Management',
            'description': 'Your blood pressure requires immediate attention. Follow up with your healthcare provider for medication adjustment. Reduce sodium intake, maintain healthy weight, and monitor blood pressure regularly.',
            'icon': 'fas fa-heartbeat'
        })
    
    # Cholesterol recommendations
    if assessment.total_cholesterol > 200:
        priority = 'high' if assessment.total_cholesterol > 240 else 'medium'
        recommendations.append({
            'category': 'dietary',
            'priority': priority,
            'title': 'Cholesterol Management',
            'description': 'Your cholesterol levels are elevated. Adopt a heart-healthy diet low in saturated fats and trans fats. Consider statin therapy if recommended by your doctor. Include omega-3 rich foods in your diet.',
            'icon': 'fas fa-apple-alt'
        })
    
    # Diabetes recommendations
    if assessment.diabetes or assessment.blood_glucose > 126:
        recommendations.append({
            'category': 'medical',
            'priority': 'urgent',
            'title': 'Diabetes Management',
            'description': 'Proper diabetes management is crucial for cardiovascular health. Monitor blood glucose regularly, take medications as prescribed, and maintain HbA1c below 7%. Regular eye and foot examinations are essential.',
            'icon': 'fas fa-syringe'
        })
    
    # Stress management
    if assessment.stress_level >= 7:
        recommendations.append({
            'category': 'lifestyle',
            'priority': 'medium',
            'title': 'Stress Management',
            'description': 'High stress levels can contribute to cardiovascular risk. Practice stress-reduction techniques such as meditation, deep breathing, yoga, or regular physical activity. Consider counseling if stress is overwhelming.',
            'icon': 'fas fa-leaf'
        })
    
    # Regular monitoring
    recommendations.append({
        'category': 'monitoring',
        'priority': 'medium',
        'title': 'Regular Health Monitoring',
        'description': 'Schedule regular check-ups with your healthcare provider. Monitor blood pressure monthly, cholesterol every 6 months, and maintain a health diary. Early detection and management of risk factors is key.',
        'icon': 'fas fa-calendar-check'
    })
    
    # Create recommendation objects
    for rec_data in recommendations:
        RiskRecommendation.objects.create(
            assessment=assessment,
            **rec_data
        )
