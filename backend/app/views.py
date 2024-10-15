from .models import *
from .serializers import *
from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from .permission import IsClerkAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
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


class CheckUsernameView(APIView):
    def get(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response({'error': 'Missing username parameter.'}, status=status.HTTP_400_BAD_REQUEST)

        exists = UserDetails.objects.filter(username__iexact=username).exists()
        if not exists:
            message = "This username is available! 🎉"
        else:
            message = "This username is already taken, choose something else.😞"
        return Response({'exists': exists, 'message': message})


class GetCompletionPercentage(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = get_object_or_404(UserDetails, username=username)
            social = SocialLinks.objects.filter(user=user).first()
            about = UserDescription.objects.filter(user=user).first()

            tasks = [
                {"label": "Add a Profile Picture", "value": 10,
                    "completed": bool(user.profilePicture)},
                {"label": "Add a Bio", "value": 10,
                    "completed": bool(user.bio)},
                {"label": "Add your Location", "value": 5,
                    "completed": bool(user.location)},
                {"label": "Add at least one Language", "value": 5,
                    "completed": Linguistics.objects.filter(user=user).exists()},
                {"label": "Add at least one Education", "value": 15,
                    "completed": Education.objects.filter(user=user).exists()},
                {"label": "Add at least one Experience", "value": 15,
                    "completed": Experience.objects.filter(user=user).exists()},
                {"label": "Add at least one Project", "value": 10,
                    "completed": Projects.objects.filter(user=user).exists()},
                {
                    "label": "Add at least one Social link", "value": 10,
                    "completed": any([
                        bool(social.github) if social else False,
                        bool(social.linkedin) if social else False,
                        bool(social.leetcode) if social else False,
                        bool(social.twitter) if social else False
                    ])
                },
                {"label": "Add About Section", "value": 20, "completed": bool(
                    about.description) if about else False},
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


class OnboardUser(APIView):
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


class SaveUserDescription(APIView):
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
                return Response({"message": "Description not found"}, status=status.HTTP_404_NOT_FOUND)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_400_BAD_REQUEST)


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


class ManageExperienceData(APIView):
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


class ManageEducationData(APIView):
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


class ManageProjectData(APIView):
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


class ManageCertificateData(APIView):
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
    def patch(self, request):
        user = request.user
        data = request.data.get('skills_list', [])

        if not isinstance(data, list):
            return Response({"error": "Invalid data format. Expected a list of skills."}, status=status.HTTP_400_BAD_REQUEST)

        skills, created = Skills.objects.get_or_create(user=user)
        serializer = SkillsSerializer(
            skills, data={'skills_list': data}, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class ManageResumeLink(APIView):
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


class CompanyProfileView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)

            user.isCompanyAdmin = True
            user.save()

            data = request.data.copy()
            data['user'] = user.id

            serializer = CompanyProfileSerializer(data=data)
            if serializer.is_valid():
                company = serializer.save()
                return Response(CompanyProfileSerializer(company).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            try:
                user = UserDetails.objects.get(
                    clerk_user_id=request.user.clerk_user_id)
            except UserDetails.DoesNotExist:
                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                company = CompanyProfile.objects.get(user=user)
            except CompanyProfile.DoesNotExist:
                return Response(
                    {"error": "Company profile not found for this user"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = CompanyProfileSerializer(company)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetCompanyProfile(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, companyName):
        try:
            company = CompanyProfile.objects.get(
                companyName__iexact=companyName)
            serializer = CompanyProfileSerializer(company)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CompanyProfile.DoesNotExist:
            return Response(
                {"error": "Company not found!"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobPostingView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            company_profile = CompanyProfile.objects.get(user=user)

            request.data['company'] = company_profile.id

            serializer = JobPostingSerializer(data=request.data)
            if serializer.is_valid():
                job_posting = serializer.save()
                return Response({'message': 'Job posted successfully'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListJobPosts(APIView):

    @transaction.atomic
    def get(self, request, companyName):
        try:
            company_profile = CompanyProfile.objects.get(
                companyName__iexact=companyName)

            job_posts = JobPostings.objects.filter(company=company_profile)
            serializer = JobPostingSerializer(job_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobDetailsView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def get(self, request, jobId):
        try:
            job_post = JobPostings.objects.get(jobId__iexact=jobId)
            serializer = JobPostingSerializer(job_post)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except JobPostings.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobSearchView(APIView):

    @transaction.atomic
    def get(self, request):
        try:
            position = request.query_params.get('position')
            experience = request.query_params.get('experience')
            location = request.query_params.get('location')

            if not position:
                return Response({'error': 'Position is required'}, status=status.HTTP_400_BAD_REQUEST)

            exact_match_jobs = JobPostings.objects.filter(
                jobTitle__icontains=position,
                experience__icontains=experience,
                jobLocation__icontains=location
            )

            individual_jobs_set = set()

            if position:
                position_jobs = JobPostings.objects.filter(
                    jobTitle__icontains=position)
                individual_jobs_set.update(position_jobs)

            if experience:
                experience_jobs = JobPostings.objects.filter(
                    experience__icontains=experience)
                individual_jobs_set.update(experience_jobs)

            if location:
                location_jobs = JobPostings.objects.filter(
                    jobLocation__icontains=location)
                individual_jobs_set.update(location_jobs)

            individual_jobs_list = list(individual_jobs_set)

            exact_match_serializer = JobPostingSerializer(
                exact_match_jobs, many=True)
            individual_jobs_serializer = JobPostingSerializer(
                individual_jobs_list, many=True)

            return Response({
                'exact_matches': exact_match_serializer.data,
                'related_matches': individual_jobs_serializer.data
            }, status=status.HTTP_200_OK)
        except JobPostings.DoesNotExist:
            return Response({"error": "No Jobs found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
