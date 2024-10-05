from django.urls import path
from .views import *

urlpatterns = [
    path('api', HomeView.as_view(), name='home'),
    path('api/users/type', GetUserType.as_view(), name='get-usertype'),
    path('api/users/check-username/', CheckUsernameView.as_view(), name='check-username'),
    
    path('api/users', AddUserData.as_view(), name='add-user-data'),
    path('api/users/onboarding', OnboardUser.as_view(), name='create-user'),
    path('api/users/profile-image', SetImageUrl.as_view(), name='set-profile-image'),

    path('api/users/description', SaveUserDescription.as_view(), name='save-user-description'),
    path('api/users/skills', AddSkillData.as_view(), name='add-skills'),
    path('api/users/resume', ManageResumeLink.as_view(), name='manage-resume'),
    path('api/users/projects', AddProjectData.as_view(), name='add-project'),
    path('api/users/certificates', AddCertificateData.as_view(), name='add-certificate'),
    path('api/users/experiences', AddExperienceData.as_view(), name='add-experience'),
    path('api/users/education', AddEducationData.as_view(), name='add-education'),

    path('api/users/<str:username>', GetUserDetails.as_view(), name='get-user-details'),
    path('api/users/<str:username>/completion-percentage', GetCompletionPercentage.as_view(), name='get-completion-percentage'),
    path('api/users/<str:username>/linguistics', GetLinguistsics.as_view(), name='get-linguistics'),
    path('api/users/<str:username>/socials', GetSocials.as_view(), name='get-socials'),
    path('api/users/<str:username>/description', GetUserDescription.as_view(), name='get-user-description'),
    path('api/users/<str:username>/experiences', GetExperienceData.as_view(), name='list-experiences'),
    path('api/users/<str:username>/education', GetEducationData.as_view(), name='list-education'),
    path('api/users/<str:username>/projects', GetProjects.as_view(), name='list-projects'),
    path('api/users/<str:username>/certificates', GetCertificates.as_view(), name='list-certificates'),
    path('api/users/<str:username>/skills', GetSkill.as_view(), name='get-skills'),

    path('api/users/<str:username>/experiences/<str:id>', GetExperienceDataById.as_view(), name='get-experience'),
    path('api/users/<str:username>/education/<str:id>', GetEducationDataById.as_view(), name='get-education'),
    path('api/users/<str:username>/projects/<str:id>', GetProjectById.as_view(), name='get-project'),
    path('api/users/<str:username>/certificates/<str:id>', GetCertificateById.as_view(), name='get-certificate'),

    path('api/users/experiences/<str:id>', ManageExperienceData.as_view(), name='manage-experience'),
    path('api/users/education/<str:id>', ManageEducationData.as_view(), name='manage-education'),
    path('api/users/projects/<str:id>', ManageProjectData.as_view(), name='manage-project'),
    path('api/users/certificates/<str:id>', ManageCertificateData.as_view(), name='manage-certificate'),
]