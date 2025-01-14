import os
import re
import resend
import random
import logging
import dns.resolver
import traceback
from .models import *
from .serializers import *
from django.db.models import Q
from urllib.parse import urlparse
from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from .permission import IsClerkAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from .utils.verify_work_email import verify_work_email


logger = logging.getLogger('app')

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
        try:
            # Log incoming request details
            logger.info(f"Received username check request")
            logger.debug(f"Request method: {request.method}")
            logger.debug(f"Request path: {request.path}")
            logger.debug(f"Request query parameters: {request.query_params}")

            # Extract username
            username = request.query_params.get('username')

            # Log username being checked
            logger.info(f"Checking username: {username}")

            # Validate username parameter
            if not username:
                logger.warning(
                    "Username check failed: Missing username parameter")
                return Response(
                    {'error': 'Missing username parameter.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check username existence
            exists = UserDetails.objects.filter(
                username__iexact=username).exists()

            # Log check result
            logger.info(f"Username '{username}' exists: {exists}")

            # Prepare response
            if not exists:
                message = "This username is available! 🎉"
                logger.info(f"Username '{username}' is available")
            else:
                message = "This username is already taken, choose something else.😞"
                logger.info(f"Username '{username}' is already taken")

            return Response({
                'exists': exists,
                'message': message
            })

        except Exception as e:
            # Log any unexpected errors
            logger.error(f"Unexpected error in username check: {str(e)}")
            logger.error(traceback.format_exc())

            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class CheckCompanySlug(APIView):
    def get(self, request):
        company_slug = request.query_params.get('companySlug')
        if not company_slug:
            return Response({'error': 'Missing companySlug parameter.'}, status=status.HTTP_400_BAD_REQUEST)

        exists = CompanyProfile.objects.filter(
            companySlug__iexact=company_slug).exists()
        if not exists:
            message = "This URL is available!"
        else:
            message = "This URL is already taken, choose something else"
        return Response({'exists': exists, 'message': message})


class UpdateUsernameView(APIView):
    permission_classes = [IsClerkAuthenticated]

    def patch(self, request):
        try:
            new_username = request.data.get('username')
            if not new_username:
                return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            user_details = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            user_details.username = new_username
            user_details.save()
            return Response({'message': 'Username updated successfully'}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CheckEmailView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Missing email parameter.'}, status=status.HTTP_400_BAD_REQUEST)

        exists = UserDetails.objects.filter(email__iexact=email).exists()
        if not exists:
            message = "This email is available!"
        else:
            message = "This email is already registered"
        return Response({'exists': exists, 'message': message})


class UpdateEmailView(APIView):
    permission_classes = [IsClerkAuthenticated]

    def patch(self, request):
        try:
            new_email = request.data.get('email')
            if not new_email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            user_details = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            user_details.email = new_email
            user_details.save()
            return Response({'message': 'Email updated successfully'}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SendVerifyEmailView(APIView):
    permission_classes = [IsClerkAuthenticated]

    def generate_otp(self):
        return str(random.randint(100000, 999999))

    @transaction.atomic
    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            name = user.firstname
            current_employment = Experience.objects.get(user=user)

            work_email = request.data.get('email')
            company_website = request.data.get('website')
            if not work_email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

            otp = self.generate_otp()
            html_content = verify_work_email(name=name, otp=otp)

            resend.api_key = os.environ["RESEND_API_KEY"]
            default_email = os.getenv('EMAIL_HOST_USER_DEFAULT')

            params = {
                "from": default_email,
                "to": work_email,
                "subject": "Verify Work Email | Gradhunt",
                "html": html_content,
            }

            resend.Emails.send(params)

            current_employment.workEmail = work_email
            current_employment.verificationCode = otp
            current_employment.companyWebsite = company_website
            current_employment.save()

            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyEmailView(APIView):
    permission_classes = [IsClerkAuthenticated]

    def extract_domain_from_email(self, email):
        """Extract domain from email address."""
        try:
            return email.split('@')[1].lower()
        except (IndexError, AttributeError):
            return None

    def extract_domain_from_url(self, url):
        """Extract domain from URL."""
        try:
            # Add https:// if no scheme is present
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            return urlparse(url).netloc.lower()
        except Exception:
            return None

    def is_valid_domain(self, domain):
        """Verify if domain exists using DNS lookup."""
        try:
            # Try to resolve the MX records
            dns.resolver.resolve(domain, 'MX')
            return True
        except dns.resolver.NXDOMAIN:
            # Try A records if MX records don't exist
            try:
                dns.resolver.resolve(domain, 'A')
                return True
            except dns.resolver.NXDOMAIN:
                return False
        except Exception:
            return False

    def post(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            current_employment = Experience.objects.get(user=user)

            # Extract domains
            website_domain = self.extract_domain_from_url(
                current_employment.companyWebsite)
            email_domain = self.extract_domain_from_email(
                current_employment.workEmail)

            if not website_domain or not email_domain:
                return Response(
                    {'error': 'Invalid website URL or email format'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Remove 'www.' prefix if present for consistent comparison
            website_domain = website_domain.replace('www.', '')

            verification_code_array = request.data.get('verificationCode')

            if isinstance(verification_code_array, list):
                verification_code = ''.join(verification_code_array)
            else:
                verification_code = None

            if not verification_code:
                return Response({'error': 'Verification code is required'}, status=status.HTTP_400_BAD_REQUEST)

            if verification_code == current_employment.verificationCode:
                if website_domain != email_domain:
                    return Response(
                        {'error': 'Couldn\'t verify email. Please recheck the organization\'s website URL and email domain'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if not self.is_valid_domain(website_domain):
                    return Response(
                        {'error': 'Couldn\'t verify email. Invalid domain'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                current_employment.verificationCode = None
                current_employment.isVerified = True
                current_employment.save()

                user.isVerified = True
                user.save()

                return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            traceback.print_exc()
            return Response({'error': f'Failed to verify work email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetCompletionPercentage(APIView):
    permission_classes = [IsClerkAuthenticated]

    def get(self, request, username):
        try:
            user = get_object_or_404(UserDetails, username=username)
            social = SocialLinks.objects.filter(user=user).first()
            about = UserDescription.objects.filter(user=user).first()
            resumeLink = user.resumeLink

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
                {"label": "Add About Section", "value": 10, "completed": bool(
                    about.description) if about else False},
                {"label": "Upload a Resume", "value": 10, "completed": bool(
                    resumeLink) if resumeLink else False},
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
        try:
           # More detailed request logging
            logger.info(f"Received POST request to {request.path}")
            logger.debug(f"Full request headers: {dict(request.headers)}")
            logger.debug(f"Request content type: {request.content_type}")
            logger.debug(f"Request method: {request.method}")

            # Log request data, but be careful with sensitive information
            safe_data = {k: '***' if k in ['password']
                         else v for k, v in request.data.items()}
            logger.debug(f"Request data (sensitive info masked): {safe_data}")

            data = request.data.copy()

            if hasattr(request.user, 'clerk_user_id'):
                data['clerk_user_id'] = request.user.clerk_user_id
            else:
                logger.error("User does not have clerk_user_id")
                return Response(
                    {'status': 'error', 'message': 'Invalid user authentication'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            user_serializer = UserSerializer(data=data)
            if not user_serializer.is_valid():
                logger.error(f"Serializer validation failed: {user_serializer.errors}")
                return Response(
                    {'status': 'error', 'errors': user_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user_instance = user_serializer.save()

            response_data = {
                'status': 'success',
                'message': 'Candidate Details Saved Successfully',
                'id': user_instance.id,
            }

            logger.info("User onboarded successfully")
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in OnboardUser: {str(e)}")
            logger.error(
                f"Unexpected error in OnboardUser view", exc_info=True)
            logger.error(traceback.format_exc())
            traceback.print_exc()

            return Response(
                {'status': 'error', 'message': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SwitchUserVisibility(APIView):
    permission_classes = [IsClerkAuthenticated]

    def patch(self, request):
        user = UserDetails.objects.get(
            clerk_user_id=request.user.clerk_user_id)
        isProfilePrivate = request.data.get('isProfilePrivate')

        if isProfilePrivate is None:
            return Response({'error': 'isProfilePrivate field is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.isProfilePrivate = isProfilePrivate
            user.save()

        return Response({'message': 'User visibility updated successfully'}, status=status.HTTP_200_OK)


class ToggleNotifications(APIView):
    permission_classes = [IsClerkAuthenticated]

    def patch(self, request):
        user = UserDetails.objects.get(
            clerk_user_id=request.user.clerk_user_id)
        notificationType = request.query_params.get('notificationType')
        isNotificationEnabled = request.data.get('isNotificationEnabled')

        if isNotificationEnabled is None:
            return Response({'error': 'isNotificationEnabled field is required'}, status=status.HTTP_400_BAD_REQUEST)

        if notificationType is None:
            return Response({'error': 'notificationType param is required'}, status=status.HTTP_400_BAD_REQUEST)
        elif notificationType == 'web':
            user.isWebNotificationEnabled = isNotificationEnabled
            user.save()
        elif notificationType == 'email':
            user.isEmailNotificationEnabled = isNotificationEnabled
            user.save()

        return Response({'message': 'Notifications updated successfully'}, status=status.HTTP_200_OK)


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


class ManageUserData(APIView):
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

    def get(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


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
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
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
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
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
            traceback.print_exc()
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    def patch(self, request):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            company = CompanyProfile.objects.get(user=user)
            serializer = CompanyProfileSerializer(
                company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetCompanyProfile(APIView):
    @transaction.atomic
    def get(self, request, companyslug):
        try:
            company = CompanyProfile.objects.get(
                companySlug__iexact=companyslug)
            serializer = CompanyProfileSerializer(company)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CompanyProfile.DoesNotExist:
            return Response(
                {"error": "Company not found!"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            traceback.print_exc()
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
            serializer = JobPostingSerializer(data=request.data)
            if serializer.is_valid():
                job_posting = serializer.save(company=company_profile)
                return Response({'message': 'Job posted successfully'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateJobView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, jobId):
        try:
            user = UserDetails.objects.get(
                clerk_user_id=request.user.clerk_user_id)
            company_profile = CompanyProfile.objects.get(user=user)
            job_posting = JobPostings.objects.get(jobId__iexact=jobId)
            serializer = JobPostingSerializer(
                job_posting, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(company=company_profile)
                return Response({'message': 'Job updated successfully'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except JobPostings.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ManageJobsView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, jobId):
        try:
            job_posting = JobPostings.objects.get(jobId__iexact=jobId)
            job_posting.isArchived = request.data.get("isArchived")
            job_posting.isActive = request.data.get("isActive")
            job_posting.save()
            if request.data.get("isArchived"):
                message = "archived"
            else:
                message = "unarchived"
            return Response({"success": f"Job post {message} successfully"}, status=status.HTTP_200_OK)
        except JobPostings.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    def delete(self, request, jobId):
        try:
            job_posting = JobPostings.objects.get(jobId__iexact=jobId)
            job_posting.delete()
            return Response({"success": "Job post deleted successfully"}, status=status.HTTP_200_OK)
        except JobPostings.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListJobPosts(APIView):

    @transaction.atomic
    def get(self, request, companyslug):
        try:
            company_profile = CompanyProfile.objects.get(
                companySlug__iexact=companyslug)

            job_posts = JobPostings.objects.filter(
                company=company_profile).order_by('-postedDate')
            serializer = JobPostingSerializer(job_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobDetailsView(APIView):
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
            position = request.query_params.get(
                'position', '').replace('+', ' ')
            experience = request.query_params.get(
                'experience', '').replace('+', ' ')
            location = request.query_params.get(
                'location', '').replace('+', ' ')

            if not position:
                return Response({'error': 'Position is required'}, status=status.HTTP_400_BAD_REQUEST)

            queryset = JobPostings.objects.filter(isActive=True)

            # Exact Match Jobs
            exact_match_jobs = queryset.filter(
                jobTitle__icontains=position,
                experience__icontains=experience,
                jobLocation__icontains=location
            )

            # Convert exact matches to a set for easy comparison
            exact_match_ids = set(
                exact_match_jobs.values_list('id', flat=True))

            individual_jobs_set = set()

            if position:
                position_jobs = queryset.filter(jobTitle__icontains=position)
                individual_jobs_set.update(position_jobs)

            if experience:
                experience_jobs = queryset.filter(
                    experience__icontains=experience)
                individual_jobs_set.update(experience_jobs)

            if location:
                location_jobs = queryset.filter(
                    jobLocation__icontains=location)
                individual_jobs_set.update(location_jobs)

            # Remove exact matches from the individual jobs
            individual_jobs_set = [
                job for job in individual_jobs_set if job.id not in exact_match_ids]

            individual_jobs_list = list(individual_jobs_set)

            # Serialize the results
            exact_match_serializer = JobPostingSerializer(
                exact_match_jobs, many=True)
            individual_jobs_serializer = JobPostingSerializer(
                individual_jobs_list, many=True)

            return Response({
                'exact_matches': exact_match_serializer.data,
                'related_matches': individual_jobs_serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobFilterView(APIView):

    def extract_salary_value(salary_str):
        # Extracts the first sequence of digits
        match = re.search(r'(\d+)', salary_str)
        return int(match.group(0)) if match else None

    @transaction.atomic
    def post(self, request):
        try:
            # Combine locations
            abroad_location = request.data.get("abroadLocation", [])
            india_location = request.data.get("indiaLocation", [])
            locations = abroad_location + india_location

            # Extract filter parameters
            experiences = request.data.get("experience", [])
            job_types = request.data.get("jobType", [])
            salary_ranges = request.data.get("expectedSalary", [])
            work_types = request.data.get("workType", [])
            categories = request.data.get("category", [])

            print(salary_ranges)

            # active jobs
            queryset = JobPostings.objects.filter(isActive=True)

            # Location Filter
            if locations:
                queryset = queryset.filter(
                    jobLocation__startswith=locations[0]
                )

            # Experience Filter
            if experiences:
                min_experience = experiences[0].get("min")
                max_experience = experiences[0].get("max")

                experience_conditions = Q()

                if min_experience != '':
                    min_experience = int(min_experience)
                    experience_conditions &= Q(experience__gte=min_experience)

                if max_experience != '':
                    max_experience = int(max_experience)
                    experience_conditions &= Q(experience__lte=max_experience)

                # Combine conditions for experience
                if min_experience is not None and max_experience is not None:
                    experience_conditions |= Q(experience__gte=min_experience) & Q(
                        experience__lte=max_experience)

                queryset = queryset.filter(experience_conditions)

            # Job Type Filter
            if job_types:
                queryset = queryset.filter(jobType__in=job_types)

            # Work Type Filter
            if work_types:
                queryset = queryset.filter(workType__in=work_types)

            # Category Filter
            if categories:
                queryset = queryset.filter(jobCategory__in=categories)

            # Salary Filter
            if salary_ranges:
                min_salary = salary_ranges[0].get("min", "").strip()
                max_salary = salary_ranges[0].get("max", "").strip()
                currency = salary_ranges[0].get("currency", "")

                salary_conditions = Q()

                # Initialize min_salary and max_salary as None
                min_salary_value = None
                max_salary_value = None

                if min_salary != '':
                    min_salary_value = int(min_salary)
                    print(min_salary_value, type(min_salary_value))

                if max_salary != '':
                    max_salary_value = int(max_salary)
                    print(max_salary_value, type(max_salary_value))

                # Apply conditions based on the extracted values
                if min_salary_value is not None:
                    salary_conditions &= Q(highestSalary__gte=min_salary_value)

                if max_salary_value is not None:
                    salary_conditions &= Q(lowestSalary__lte=max_salary_value)

                if currency:
                    print(currency, type(currency))
                    salary_conditions &= Q(currency=currency)

                # Apply the salary conditions to the queryset
                queryset = queryset.filter(salary_conditions)

            serializer = JobPostingSerializer(queryset, many=True)

            return Response({
                'exact_matches': serializer.data,
                'related_matches': [],
                'total_count': queryset.count()
            }, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ApplyJobView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def post(self, request, jobId):
        candidate = request.user

        try:
            job_posting = JobPostings.objects.get(jobId=jobId)
            if JobApplication.objects.filter(candidate=candidate, jobPosting=job_posting).exists():
                return Response({'error': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

            job_application = JobApplication.objects.create(
                candidate=candidate, jobPosting=job_posting)

            job_posting.applicants += 1
            job_posting.save()

            serializer = JobApplicationSerializer(job_application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except JobPostings.DoesNotExist:
            return Response({'error': 'Job posting not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SaveJobView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, jobId):
        candidate = request.user
        try:
            job_posting = JobPostings.objects.get(jobId=jobId)

            saved_job = SavedJob.objects.filter(
                candidate=candidate, jobPosting=job_posting).first()
            if saved_job:
                saved_job.delete()
                return Response({'message': 'Job unsaved successfully'}, status=status.HTTP_200_OK)
            else:
                SavedJob.objects.create(
                    candidate=candidate, jobPosting=job_posting)
                return Response({'message': 'Job saved successfully'}, status=status.HTTP_201_CREATED)

        except JobPostings.DoesNotExist:
            return Response({'error': 'Job posting not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetSavedJobs(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def get(self, request):
        candidate = request.user
        saved_jobs = SavedJob.objects.filter(candidate=candidate)
        serializer = SavedJobSerializer(saved_jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAppliedJobs(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def get(self, request):
        candidate = request.user
        applied_jobs = JobApplication.objects.filter(candidate=candidate)
        serializer = JobApplicationSerializer(applied_jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetJobsApplications(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def get(self, request, companyslug, jobId):
        try:
            company = CompanyProfile.objects.get(
                companySlug__iexact=companyslug)
            job_posting = JobPostings.objects.get(
                company_id=company.id, jobId__iexact=jobId)
            serializer = JobDetailsSerializer(job_posting)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CompanyProfile.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
        except JobPostings.DoesNotExist:
            return Response({"error": "Job Posting not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class JobListView(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def get(self, request):
        jobs = JobPostings.objects.all()
        serializer = JobPostingSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateApplicationStatus(APIView):
    permission_classes = [IsClerkAuthenticated]

    @transaction.atomic
    def patch(self, request, applicationId):
        data = request.data
        try:
            application = JobApplication.objects.get(id=applicationId)
            application.status = data['newStatus']
            application.save()
            return Response({'message': 'Application status updated successfully'}, status=status.HTTP_200_OK)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecentJobsView(APIView):
    def get(self, request):
        jobs = JobPostings.objects.all().order_by('-postedDate')[:10]
        serializer = JobPostingSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)