from django.urls import path
from .views import *

urlpatterns = [
    path('api/', HomeView.as_view(), name='home'),
    path('api/get-usertype/', GetUserType.as_view(), name='get-usertype'),
    path('api/check-email/', CheckEmailView.as_view(), name='check-email'),
    path('api/check-username/', CheckUsernameView.as_view(), name='check-username'),
    
    path('api/add-resume-link', AddResumeLink.as_view(), name='add-resume'),
    path('api/delete-resume/', DeleteResumeLink.as_view(), name='delete-resume'),

    path('api/get-completion-percentage/<str:username>', GetCompletionPercentage.as_view(), name='get-usertype'),

    path('api/add-user-data', AddUserData.as_view(), name='add-basic-data'),
    path('api/get-user-details/<str:username>', GetUserDetails.as_view(), name='get-user'),
    path('api/get-linguistics-data/<str:username>', GetLinguistsics.as_view(), name='get-linguistics'),
    path('api/get-social-data/<str:username>', GetSocials.as_view(), name='get-socials'),
    
    path('api/add-user-desc', SaveUserDesc.as_view(), name='save-user-desc'),
    path('api/get-user-desc/<str:username>', GetUserDescription.as_view(), name='get-user-desc'),

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
    path('api/get-experience-data/<str:username>', GetExperienceData.as_view(), name='get-experience'),
    path('api/get-experience-data/<str:username>/<str:id>', GetExperienceDataById.as_view(), name='get-experience-by-id'),
    path('api/update-experience-data/<str:id>', UpdateExperienceData.as_view(), name='update-experience'),
    path('api/delete-experience-data/<str:id>', DeleteExperienceData.as_view(), name='delete-experience'),
    
    # education section
    path('api/add-education-data', AddEducationData.as_view(), name='add-education'),
    path('api/get-education-data/<str:username>', GetEducationData.as_view(), name='get-experience'),
    path('api/get-education-data/<str:username>/<str:id>', GetEducationDataById.as_view(), name='get-experience-by-id'),
    path('api/update-education-data/<str:id>', UpdateEducationData.as_view(), name='update-education'),
    path('api/delete-education-data/<str:id>', DeleteEducationData.as_view(), name='delete-experience'),

    # project section
    path('api/add-project-data', AddProjectData.as_view(), name='add-project'),
    path('api/get-projects/<str:username>', GetProjects.as_view(), name='get-project'),

    # certificate section
    path('api/add-certificate-data', AddCertificateData.as_view(), name='add-certificate'),
    path('api/get-certificates/<str:username>', GetCertificates.as_view(), name='get-certificate'),

    # skills section
    path('api/add-skills', AddSkillData.as_view(), name='add-skills'),
    path('api/get-skills/<str:username>', GetSkill.as_view(), name='get-skills'),

    # skills section

    # image uploads 
    path('api/upload-profile-image', SetImageUrl.as_view(), name='set-profile-image'),
]
