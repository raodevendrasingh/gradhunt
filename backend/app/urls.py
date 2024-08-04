from django.urls import path
from .views import *

urlpatterns = [
    path('api/', HomeView.as_view(), name='home'),
    path('api/get-usertype/', GetUserType.as_view(), name='get-usertype'),
    path('api/check-email/', CheckEmailView.as_view(), name='check-email'),
    path('api/check-username/', CheckUsernameView.as_view(), name='check-username'),
    # candidate data
    path('api/save-candidate-data/', SaveCandidateData.as_view(), name='create-candidate'),
    # recruiter data
    path('api/save-recruiter-form-data/', SaveRecruiterFormData.as_view(), name='create-recruiter'),
    path('api/recruiters/all', GetAllRecruiters.as_view(), name='show-all-recruiters'),
    path('api/recruiter/<str:username>', GetRecruiterDetails.as_view(), name='get-recruiter'),
    path('api/recruiter/<str:username>/get-company-data', GetCompanyProfile.as_view(), name='get-company-profile'),
    path('api/recruiter/<str:username>/update-company-data', UpdateCompanyProfile.as_view(), name='update-company-profile'),
    # experience section
    path('api/add-experience-data', AddExperienceData.as_view(), name='add-experience'),
    path('api/recruiter/<str:username>/get-experience-data/<str:id>', GetExperienceData.as_view(), name='get-experience'),
    path('api/recruiter/<str:username>/delete-experience-data/<str:id>', DeleteExperienceData.as_view(), name='get-experience'),
    path('api/recruiter/<str:username>/update-experience-data/<str:id>', UpdateExperienceData.as_view(), name='update-experience'),
    # education section
    path('api/add-education-data', AddEducationData.as_view(), name='add-education'),
    path('api/recruiter/<str:username>/get-education-data/<str:id>', GetEducationData.as_view(), name='get-experience'),
    path('api/recruiter/<str:username>/delete-education-data/<str:id>', DeleteEducationData.as_view(), name='get-experience'),
    path('api/recruiter/<str:username>/update-education-data/<str:id>', UpdateEducationData.as_view(), name='update-education'),
]
