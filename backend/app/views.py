import json
from .models import *
from .serializers import *
from .permission import IsClerkAuthenticated
from rest_framework.exceptions import NotFound
import json
from django.views import View
from django.db import transaction
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied


# add clerk permission classes

class HomeView(APIView):
    def get(self, request):
        return Response('This is the API home page', status=status.HTTP_200_OK)


class GetUserType(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_details = UserDetails.objects.get(email=email)
            userType = user_details.usertype
            return Response({'usertype': userType}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class GetCompanyProfile(APIView):
    def get(self, request, username):
        try:
            company_profile = CompanyProfile.objects.get(
                recruiter__user__username=username)
            serializer = CompanyProfileSerializer(company_profile)

            return Response(serializer.data)

        except CompanyProfile.DoesNotExist:
            return Response(
                {"error": "Company profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class CheckUsernameView(APIView):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        if not username:
            return Response({'error': 'Missing username parameter.'}, status=status.HTTP_400_BAD_REQUEST)

        exists = UserDetails.objects.filter(username__iexact=username).exists()
        if not exists:
            message = "This username is available! 🎉"
        else:
            message = "This username is already taken, choose something else.😞"
        return Response({'exists': exists, 'message': message})


class CheckEmailView(View):
    def get(self, request, *args, **kwargs):
        email = request.GET.get('email', None)
        if email is None:
            return JsonResponse({'error': 'Missing email parameter.'}, status=400)

        exists = UserDetails.objects.filter(email__iexact=email).exists()
        return JsonResponse({'exists': exists})


class GetCompletionPercentage(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            social = SocialLinks.objects.get(user=user)
            about = UserDescription.objects.get(user=user)

            tasks = [
                {"label": "Add a Profile Picture", "value": 10,
                    "completed": bool(user.profilePicture)},
                {"label": "Add a Bio", "value": 10,
                    "completed": bool(user.bio)},
                {"label": "Add your Location", "value": 5, "completed": bool(user.location)}, {
                    "label": "Add at least one Language", "value": 5, "completed": Linguistics.objects.filter(user=user).exists()},
                {"label": "Add at least one Education", "value": 15,
                    "completed": Education.objects.filter(user=user).exists()},
                {"label": "Add at least one Experience", "value": 15,
                    "completed": Experience.objects.filter(user=user).exists()},
                {"label": "Add at least one Project", "value": 10,
                    "completed": Projects.objects.filter(user=user).exists()},
                {
                    "label": "Connect at least one featured social", "value": 10,
                    "completed": any([
                        bool(social.github),
                        bool(social.linkedin),
                        bool(social.leetcode),
                        bool(social.twitter)
                    ])
                },
                {"label": "Add About Section", "value": 20,
                    "completed": bool(about.description)},
            ]

            total_value = sum(task['value'] for task in tasks)
            completed_value = sum(task['value']
                                  for task in tasks if task['completed'])
            completion_percentage = (completed_value / total_value) * 100

            return Response({
                "tasks": tasks,
                "completion_percentage": completion_percentage
            }, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SaveCandidateData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        data = request.data.copy()

        if hasattr(request.user, 'clerk_user_id'):
            data['clerk_user_id'] = request.user.clerk_user_id

        user_serializer = UserSerializer(data=data)
        if not user_serializer.is_valid():
            return Response({'status': 'error', 'errors': user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        user_instance = user_serializer.save()

        response_data = {
            'status': 'success',
            'message': 'Candidate Details Saved Successfully',
            'id': user_instance.id,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class SaveUserDesc(APIView):
    @transaction.atomic
    def post(self, request):
        user = request.user
        data = request.data

        description = data.get('description', '')

        if not description:
            return Response({'error': 'Description is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            about_data = UserDescription.objects.get(user=user)
            about_data.description = description
        except UserDescription.DoesNotExist:
            about_data = UserDescription(user=user, description=description)

        about_data.save()

        serializer = UserDescriptionSerializer(about_data)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SaveRecruiterFormData(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data

        user_serializer = UserSerializer(data=data['userDetails'])
        if not user_serializer.is_valid():
            return Response({'status': 'error', 'errors': user_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        user_instance = user_serializer.save()

        recruiter_data = data['recruiterDetails']
        recruiter_data['user'] = user_instance.id
        recruiter_serializer = RecruiterSerializer(data=recruiter_data)
        if not recruiter_serializer.is_valid():
            return Response({'status': 'error', 'errors': recruiter_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        recruiter_instance = recruiter_serializer.save()

        hiring_pref_data = data['hiringPreferences']
        hiring_pref_data['recruiter'] = recruiter_instance.id
        hiring_pref_serializer = HiringPreferenceSerializer(
            data=hiring_pref_data)
        if not hiring_pref_serializer.is_valid():
            return Response({'status': 'error', 'errors': hiring_pref_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        hiring_pref_instance = hiring_pref_serializer.save()

        return Response(
            {
                'status': 'success',
                'message': 'Recruiter Details Saved Successfully',
                'id': user_instance.id,
                'username': user_instance.username,
                'usertype': user_instance.usertype
            },
            status=status.HTTP_200_OK
        )


class GetRecruiterDetails(APIView):
    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username__iexact=username)
            recruiter = Recruiter.objects.get(user__exact=user.id)
            hiring_preferences = HiringPreferences.objects.get(
                recruiter__exact=recruiter.id)
            company_profile = CompanyProfile.objects.get(
                recruiter__exact=recruiter.id)
            experience_data = Experience.objects.filter(user=user)
            education_data = Education.objects.filter(user=user)
            job_postings = JobPostings.objects.filter(
                recruiter__exact=recruiter.id).first()

            data = {
                'user_details': user,
                'recruiter_details': recruiter,
                'hiring_preference': hiring_preferences,
                'company_profile': company_profile,
                'experience_data': experience_data,
                'education_data': education_data,
                'job_postings': job_postings,
            }
            serializer = RecruiterDataSerializer(data)

            return Response(serializer.data)

        except UserDetails.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Recruiter.DoesNotExist:
            return JsonResponse({'error': 'Recruiter details not found'}, status=404)
        except HiringPreferences.DoesNotExist:
            return JsonResponse({'error': 'Hiring preferences not found'}, status=404)


class GetAllRecruiters(APIView):
    def get(self, request):
        try:
            recruiters = Recruiter.objects.all()

            data = []
            for recruiter in recruiters:
                user_serializer = UserSerializer(recruiter.user)
                recruiter_serializer = RecruiterSerializer(recruiter)
                hiring_preference_serializer = HiringPreferenceSerializer(
                    HiringPreferences.objects.filter(recruiter=recruiter).first())

                company_profile = CompanyProfile.objects.filter(
                    recruiter=recruiter).first()
                company_profile_serializer = CompanyProfileSerializer(
                    company_profile) if company_profile else None

                experience_data = Experience.objects.filter(
                    user=recruiter.user)
                experience_data_serializer = ExperienceSerializer(
                    experience_data, many=True)

                education_data = Education.objects.filter(
                    user=recruiter.user)
                education_data_serializer = EducationSerializer(
                    education_data, many=True)

                job_posting = JobPostings.objects.filter(
                    recruiter=recruiter).first()
                job_posting_serializer = PostingSerializer(
                    job_posting) if job_posting else None

                recruiter_data = {
                    'user_details': user_serializer.data,
                    'recruiter_details': recruiter_serializer.data,
                    'hiring_preference': hiring_preference_serializer.data,
                    'company_profile': company_profile_serializer.data if company_profile_serializer else None,
                    'experience_data': experience_data_serializer.data,
                    'education_data': education_data_serializer.data,
                    'job_postings': job_posting_serializer.data if job_posting_serializer else None,
                }
                data.append(recruiter_data)

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateCompanyProfile(APIView):
    @transaction.atomic
    def post(self, request, username):
        data = request.data

        recruiter = get_object_or_404(Recruiter, user__username=username)
        company_profile, created = CompanyProfile.objects.get_or_create(
            recruiter=recruiter)

        if not created:
            existing_data = CompanyProfileSerializer(company_profile).data
            updated_data = {}
            for key, value in data.items():
                if key == 'companySize':
                    if 'employeeSize' not in existing_data or existing_data['employeeSize'] != value['value']:
                        updated_data['employeeSize'] = value['value']
                elif key not in existing_data or existing_data[key] != value:
                    updated_data[key] = value

            if not updated_data:
                return Response({'status': 'success', 'message': 'No changes detected'}, status=status.HTTP_200_OK)
        else:
            updated_data = data
            if 'companySize' in updated_data:
                updated_data['employeeSize'] = updated_data.pop('companySize')[
                    'value']

        if 'companyWebsite' in data:
            updated_data['website'] = data['companyWebsite']

        if 'branch' in data and isinstance(data['branch'], list):
            branches_info = [{'city': branch['city'], 'state': branch['state'],
                              'country': branch['country']} for branch in data['branch']]
            updated_data['branches'] = json.dumps(branches_info)

        serializer = CompanyProfileSerializer(
            company_profile, data=updated_data, partial=not created)

        if not serializer.is_valid():
            return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        company_profile = serializer.save()

        return Response(
            {
                'status': 'success',
                'message': 'Profile Created Successfully' if created else 'Profile Updated Successfully',
                'id': company_profile.recruiter_id,
            },
            status=status.HTTP_200_OK
        )


class AddExperienceData(APIView):
    permission_classes = [IsClerkAuthenticated]

    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)

            data = request.data.copy()
            data['user'] = user.id

            serializer = ExperienceSerializer(data=data)
            if serializer.is_valid():
                experience = serializer.save()
                return Response(ExperienceSerializer(experience).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetExperienceData(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            experiences = Experience.objects.filter(
                user=user).order_by('-startYear', '-startMonth')
            serializer = ExperienceSerializer(experiences, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetExperienceDataById(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username, id):
        try:
            user = get_object_or_404(UserDetails, username=username)
            experience = get_object_or_404(Experience, user=user, id=id)
            serializer = ExperienceSerializer(experience)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateExperienceData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, id):
        try:
            experience = Experience.objects.get(
                id=id,
                user__clerk_user_id=request.user.clerk_user_id
            )
        except Experience.DoesNotExist:
            return Response(
                {"error": "Experience not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ExperienceSerializer(
            experience, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Experience updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteExperienceData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def delete(self, request, id):
        try:
            user = get_object_or_404(
                UserDetails, clerk_user_id=request.user.clerk_user_id)
            experience_data = get_object_or_404(Experience, id=id, user=user)

            if experience_data.user != user:
                raise PermissionDenied(
                    "You don't have permission to perform this action.")

            experience_data.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Experience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)


class AddEducationData(APIView):
    permission_classes = [IsClerkAuthenticated]

    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)

            data = request.data.copy()
            data['user'] = user.id

            serializer = EducationSerializer(data=data)
            if serializer.is_valid():
                education = serializer.save()
                return Response(EducationSerializer(education).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetEducationData(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            education = Education.objects.filter(
                user=user).order_by('-startYear', '-startMonth')
            serializer = EducationSerializer(education, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetEducationDataById(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username, id):
        try:
            user = get_object_or_404(UserDetails, username=username)
            education = get_object_or_404(Education, user=user, id=id)
            serializer = EducationSerializer(education)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateEducationData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, id):
        try:
            education = Education.objects.get(
                id=id,
                user__clerk_user_id=request.user.clerk_user_id
            )
        except Education.DoesNotExist:
            return Response(
                {"error": "Education not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = EducationSerializer(
            education, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Education updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteEducationData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def delete(self, request, id):
        try:
            user = get_object_or_404(
                UserDetails, clerk_user_id=request.user.clerk_user_id)
            education_data = get_object_or_404(Education, id=id, user=user)

            if education_data.user != user:
                raise PermissionDenied(
                    "You don't have permission to perform this action.")

            education_data.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Education.DoesNotExist:
            return Response({"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND)


class AddProjectData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)

            data = request.data.copy()
            data['user'] = user.id

            serializer = ProjectSerializer(data=data)
            if serializer.is_valid():
                project = serializer.save()
                return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetProjects(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            projects = Projects.objects.filter(
                user=user).order_by('-startYear', '-startMonth')
            serializer = ProjectSerializer(projects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetProjectById(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username, id):
        try:
            user = get_object_or_404(UserDetails, username=username)
            project = get_object_or_404(Projects, user=user, id=id)
            serializer = ProjectSerializer(project)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateProjectData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, id):
        try:
            project = Projects.objects.get(
                id=id,
                user__clerk_user_id=request.user.clerk_user_id
            )
        except Projects.DoesNotExist:
            return Response(
                {"error": "Project not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProjectSerializer(
            project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Project updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteProjectData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def delete(self, request, id):
        try:
            user = get_object_or_404(
                UserDetails, clerk_user_id=request.user.clerk_user_id)
            project = get_object_or_404(Projects, id=id, user=user)

            if project.user != user:
                raise PermissionDenied(
                    "You don't have permission to perform this action.")

            project.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Projects.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)


class AddCertificateData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)

            data = request.data.copy()
            data['user'] = user.id

            serializer = CertificateSerializer(data=data)
            if serializer.is_valid():
                cerificate = serializer.save()
                return Response(CertificateSerializer(cerificate).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetCertificates(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            certificates = Certifications.objects.filter(
                user=user).order_by('-startYear', '-startMonth')
            serializer = CertificateSerializer(certificates, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetCertificateById(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username, id):
        try:
            user = get_object_or_404(UserDetails, username=username)
            certificate = get_object_or_404(Certifications, user=user, id=id)
            serializer = CertificateSerializer(certificate)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateCertificateData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, id):
        try:
            cerificate = Certifications.objects.get(
                id=id,
                user__clerk_user_id=request.user.clerk_user_id
            )
        except Certifications.DoesNotExist:
            return Response(
                {"error": "Certificate not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CertificateSerializer(
            cerificate, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Certificate updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCertificateData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def delete(self, request, id):
        try:
            user = get_object_or_404(
                UserDetails, clerk_user_id=request.user.clerk_user_id)
            certificate = get_object_or_404(Certifications, id=id, user=user)

            if certificate.user != user:
                raise PermissionDenied(
                    "You don't have permission to perform this action.")

            certificate.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Certifications.DoesNotExist:
            return Response({"error": "Certificate not found"}, status=status.HTTP_404_NOT_FOUND)


class AddSkillData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user

        data = request.data.get('skills', [])

        if not isinstance(data, list):
            return Response({"error": "Invalid data format. Expected a list of skills."}, status=status.HTTP_400_BAD_REQUEST)

        # Delete to overwrite existing skills for the user
        Skills.objects.filter(user=user).delete()

        skills = []
        for skill in data:
            skill_data = {}
            for field in Skills._meta.fields:
                field_name = field.name

                if field_name == 'user':
                    skill_data[field_name] = user
                elif field_name in skill:
                    if isinstance(skill[field_name], dict) and 'value' in skill[field_name]:
                        skill_data[field_name] = skill[field_name]['value']
                    else:
                        skill_data[field_name] = skill[field_name]

            try:
                skill_instance = Skills.objects.create(**skill_data)
                skills.append(skill_instance)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Skills added successfully."}, status=status.HTTP_201_CREATED)


class AddUserData(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        clerk_user_id = request.user.clerk_user_id
        data = request.data

        user_data = {
            'firstname': data.get('firstname'),
            'lastname': data.get('lastname'),
            'bio': data.get('bio'),
            'location': data.get('location'),
        }

        social_links_data = data.get('socialLinks', {})
        languages_data = data.get('languages', [])

        try:
            user_details, created = UserDetails.objects.update_or_create(
                clerk_user_id=clerk_user_id, defaults=user_data
            )

            social_links, created = SocialLinks.objects.update_or_create(
                user=user_details, defaults=social_links_data
            )

            Linguistics.objects.filter(user=user_details).delete()
            for language in languages_data:
                Linguistics.objects.create(user=user_details, **language)

            return Response({
                'message': 'User Details Updated Successfully',
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SetImageUrl(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        clerk_user_id = request.user.clerk_user_id
        data = request.data

        if 'profilePicture' not in data:
            return Response({'error': 'profilePicture field is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_details = UserDetails.objects.get(clerk_user_id=clerk_user_id)
            user_details.profilePicture = data['profilePicture']
            user_details.save()

            return Response({
                'message': 'Image Uploaded Successfully',
            }, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'error': 'User details not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetUserDetails(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def get(self, request, username):
        try:
            user = get_object_or_404(UserDetails, username=username)
            user_serializer = UserSerializer(user)

            social_links = SocialLinks.objects.filter(user=user)
            social_serializer = SocialLinksSerializer(social_links, many=True)

            linguistics = Linguistics.objects.filter(user=user)
            linguistics_serializer = LinguisticsSerializer(
                linguistics, many=True)

            user_data = {
                'user_details': user_serializer.data,
                'social_links': social_serializer.data,
                'linguistics': linguistics_serializer.data
            }

            return Response(user_data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            raise NotFound('User not found')
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetSkill(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            skills = Skills.objects.filter(user=user)
            serializer = SkillsSerializer(skills, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetLinguistsics(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            linguistics = Linguistics.objects.filter(user=user)
            serializer = LinguisticsSerializer(linguistics, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetSocials(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            socials = SocialLinks.objects.filter(user=user)
            serializer = SocialLinksSerializer(socials, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetUserDescription(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
            desc = UserDescription.objects.filter(user=user).first()
            if desc:
                serializer = UserDescriptionSerializer(desc)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Description not found"}, status=status.HTTP_404_NOT_FOUND)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AddResumeLink(APIView):
    permission_classes = [IsClerkAuthenticated]

    def post(self, request):
        try:
            clerk_user_id = request.user.clerk_user_id
            resume_link = request.data

            if not resume_link:
                return Response({'error': 'Resume link is required'}, status=status.HTTP_400_BAD_REQUEST)

            user = UserDetails.objects.get(clerk_user_id=clerk_user_id)

            user.resumeLink = resume_link
            user.save()

            return Response({'message': 'Resume link added successfully'}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteResumeLink(APIView):
    permission_classes = [IsClerkAuthenticated]

    def delete(self, request):
        try:
            clerk_user_id = request.user.clerk_user_id
            user = UserDetails.objects.get(clerk_user_id=clerk_user_id)

            user.resumeLink = ""
            user.save()

            return Response({'message': 'Resume deleted successfully'}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
