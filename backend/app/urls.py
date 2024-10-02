from django.urls import path
from .views import *

urlpatterns = [
    path('api/', HomeView.as_view(), name='home'),
    path('api/users/type/', GetUserType.as_view(), name='get-usertype'),
    path('api/users/check-username/', CheckUsernameView.as_view(), name='check-username'),
    
    path('api/users/resume/', AddResumeLink.as_view(), name='add-resume'),
    path('api/users/resume/', DeleteResumeLink.as_view(), name='delete-resume'),

    path('api/users/<str:username>/completion-percentage/', GetCompletionPercentage.as_view(), name='get-completion-percentage'),

    path('api/users/onboarding/', OnboardUser.as_view(), name='create-user'),

    path('api/users/', AddUserData.as_view(), name='add-user-data'),
    path('api/users/<str:username>/', GetUserDetails.as_view(), name='get-user-details'),
    path('api/users/<str:username>/linguistics/', GetLinguistsics.as_view(), name='get-linguistics'),
    path('api/users/<str:username>/socials/', GetSocials.as_view(), name='get-socials'),
    
    path('api/users/description/', SaveUserDescription.as_view(), name='save-user-description'),
    path('api/users/<str:username>/description/', GetUserDescription.as_view(), name='get-user-description'),

    # experience section
    path('api/users/experiences/', AddExperienceData.as_view(), name='add-experience'),
    path('api/users/<str:username>/experiences/', GetExperienceData.as_view(), name='list-experiences'),
    path('api/users/<str:username>/experiences/<str:id>/', GetExperienceDataById.as_view(), name='get-experience'),
    path('api/users/experiences/<str:id>/', UpdateExperienceData.as_view(), name='update-experience'),
    path('api/users/experiences/<str:id>/', DeleteExperienceData.as_view(), name='delete-experience'),
    
    # education section
    path('api/users/education/', AddEducationData.as_view(), name='add-education'),
    path('api/users/<str:username>/education/', GetEducationData.as_view(), name='list-education'),
    path('api/users/<str:username>/education/<str:id>/', GetEducationDataById.as_view(), name='get-education'),
    path('api/users/education/<str:id>/', UpdateEducationData.as_view(), name='update-education'),
    path('api/users/education/<str:id>/', DeleteEducationData.as_view(), name='delete-education'),

    # project section
    path('api/users/projects/', AddProjectData.as_view(), name='add-project'),
    path('api/users/<str:username>/projects/', GetProjects.as_view(), name='list-projects'),
    path('api/users/<str:username>/projects/<str:id>/', GetProjectById.as_view(), name='get-project'),
    path('api/users/projects/<str:id>/', UpdateProjectData.as_view(), name='update-project'),
    path('api/users/projects/<str:id>/', DeleteProjectData.as_view(), name='delete-project'),

    # certificate section
    path('api/users/certificates/', AddCertificateData.as_view(), name='add-certificate'),
    path('api/users/<str:username>/certificates/', GetCertificates.as_view(), name='list-certificates'),
    path('api/users/<str:username>/certificates/<str:id>/', GetCertificateById.as_view(), name='get-certificate'),
    path('api/users/certificates/<str:id>/', UpdateCertificateData.as_view(), name='update-certificate'),
    path('api/users/certificates/<str:id>/', DeleteCertificateData.as_view(), name='delete-certificate'),

    # skills section
    path('api/users/skills/', AddSkillData.as_view(), name='add-skills'),
    path('api/users/<str:username>/skills/', GetSkill.as_view(), name='get-skills'),

    # image uploads 
    path('api/users/profile-image/', SetImageUrl.as_view(), name='set-profile-image'),
]