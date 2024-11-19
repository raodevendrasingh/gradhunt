from django.urls import path
from .views import *

urlpatterns = [
    path('api', HomeView.as_view(), name='home'),

    path('api/company/', CompanyProfileView.as_view(), name='company'),
    path('api/company/<str:companyName>',
         GetCompanyProfile.as_view(), name='company'),

    path('api/company/<str:companyName>/jobs',
         ListJobPosts.as_view(), name='get-job-posts'),
    path('api/company/<str:companyName>/applicants/<str:jobId>',
         GetJobsApplications.as_view(), name='get-job-applicants'),

    path('api/jobs/list', JobListView.as_view(), name='list-jobs'),
    path('api/jobs/query', JobSearchView.as_view(), name='search-jobs'),

    path('api/jobs/save/<str:jobId>', SaveJobView.as_view(), name='save-jobs'),
    path('api/jobs/saved', GetSavedJobs.as_view(), name='saved-jobs'),

    path('api/jobs/apply/<str:jobId>', ApplyJobView.as_view(), name='saved-jobs'),
    path('api/jobs/applied', GetAppliedJobs.as_view(), name='applied-jobs'),

    path('api/jobs/post', JobPostingView.as_view(), name='post-job'),
    path('api/jobs/update/<str:jobId>',
         UpdateJobView.as_view(), name='update-job'),
    path('api/jobs/manage/<str:jobId>',
         ManageJobsView.as_view(), name='manage-job'),
    path('api/job/<str:jobId>', JobDetailsView.as_view(), name='show-job'),

    path('api/application/<str:applicationId>',
         UpdateApplicationStatus.as_view(), name='update-application-status'),

    path('api/users/check-company-slug/',
         CheckCompanySlug.as_view(), name='check-company-slug'),

    path('api/users/type', GetUserType.as_view(), name='get-usertype'),
    path('api/users/check-username/',
         CheckUsernameView.as_view(), name='check-username'),
    path('api/users/username',
         UpdateUsernameView.as_view(), name='update-username'),
    path('api/users/check-email/',
         CheckEmailView.as_view(), name='check-email'),
    path('api/users/email',
         UpdateEmailView.as_view(), name='update-email'),

    path('api/users/send-verification-email',
         SendVerifyEmailView.as_view(), name='send-verification-email'),

    path('api/users/verify-email',
         VerifyEmailView.as_view(), name='verify-email'),

    path('api/users', ManageUserData.as_view(), name='manage-user-data'),
    path('api/users/onboarding/', OnboardUser.as_view(), name='onboard-user'),
    path('api/users/visibility', SwitchUserVisibility.as_view(),
         name='switch-user-visibility'),
    path('api/users/notification/', ToggleNotifications.as_view(),
         name='toggle-notifications'),
    path('api/users/profile-image',
         SetImageUrl.as_view(), name='set-profile-image'),

    path('api/users/description', SaveUserDescription.as_view(),
         name='save-user-description'),
    path('api/users/skills', AddSkillData.as_view(), name='add-skills'),
    path('api/users/resume', ManageResumeLink.as_view(), name='manage-resume'),
    path('api/users/projects', AddProjectData.as_view(), name='add-project'),
    path('api/users/certificates',
         AddCertificateData.as_view(), name='add-certificate'),
    path('api/users/experiences', AddExperienceData.as_view(), name='add-experience'),
    path('api/users/education', AddEducationData.as_view(), name='add-education'),

    path('api/users/<str:username>',
         GetUserDetails.as_view(), name='get-user-details'),
    path('api/users/<str:username>/completion-percentage',
         GetCompletionPercentage.as_view(), name='get-completion-percentage'),
    path('api/users/<str:username>/linguistics',
         GetLinguistsics.as_view(), name='get-linguistics'),
    path('api/users/<str:username>/socials',
         GetSocials.as_view(), name='get-socials'),
    path('api/users/<str:username>/description',
         GetUserDescription.as_view(), name='get-user-description'),
    path('api/users/<str:username>/experiences',
         GetExperienceData.as_view(), name='list-experiences'),
    path('api/users/<str:username>/education',
         GetEducationData.as_view(), name='list-education'),
    path('api/users/<str:username>/projects',
         GetProjects.as_view(), name='list-projects'),
    path('api/users/<str:username>/certificates',
         GetCertificates.as_view(), name='list-certificates'),
    path('api/users/<str:username>/skills',
         GetSkill.as_view(), name='get-skills'),

    path('api/users/<str:username>/experiences/<str:id>',
         GetExperienceDataById.as_view(), name='get-experience'),
    path('api/users/<str:username>/education/<str:id>',
         GetEducationDataById.as_view(), name='get-education'),
    path('api/users/<str:username>/projects/<str:id>',
         GetProjectById.as_view(), name='get-project'),
    path('api/users/<str:username>/certificates/<str:id>',
         GetCertificateById.as_view(), name='get-certificate'),

    path('api/users/experiences/<str:id>',
         ManageExperienceData.as_view(), name='manage-experience'),
    path('api/users/education/<str:id>',
         ManageEducationData.as_view(), name='manage-education'),
    path('api/users/projects/<str:id>',
         ManageProjectData.as_view(), name='manage-project'),
    path('api/users/certificates/<str:id>',
         ManageCertificateData.as_view(), name='manage-certificate'),

]
