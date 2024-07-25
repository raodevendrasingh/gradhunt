from django.urls import path, include
from .views import *

urlpatterns = [
    path('api/', HomeView.as_view(), name='home'),
    path('api/save-recruiter-form-data/', SaveRecruiterFormData.as_view(), name='create-recruiter'),
    path('api/check-username/', CheckUsernameView.as_view(), name='check-username'),
    path('api/check-email/', CheckEmailView.as_view(), name='check-email'),
    path('api/recruiter/<str:username>', GetRecruiterDetails.as_view(), name='get-recruiter'),
    path('api/recruiter/<str:username>/update-company-data', UpdateCompanyProfile.as_view(), name='update-company-profile'),
    path('api/recruiter/<str:username>/get-company-data', GetCompanyProfile.as_view(), name='get-company-profile'),
    path('api/recruiter/<str:username>/add-experience-data', AddExperienceData.as_view(), name='add-experience'),
    path('api/recruiter/<str:username>/add-education-data', AddEducationData.as_view(), name='add-education'),
    path('api/recruiters/all', GetAllRecruiters.as_view(), name='show-all-recruiters'),
]
