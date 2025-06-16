from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('profile/', views.patient_profile, name='patient_profile'),
    path('assessment/', views.assessment_form, name='assessment_form'),
    path('results/<uuid:assessment_id>/', views.assessment_results, name='assessment_results'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('report/<uuid:assessment_id>/', views.generate_report, name='generate_report'),
    path('api/real-time-risk/', views.real_time_risk_calculation, name='real_time_risk'),
    path('api/assessment-history/', views.assessment_history_api, name='assessment_history_api'),
]
