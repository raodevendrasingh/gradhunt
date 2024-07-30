import json
from .models import *
from .serializers import *
from .permission import IsClerkAuthenticated
import json
from django.views import View
from django.db import transaction
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class HomeView(APIView):
    def get(self, request):
        return Response('This is the API home page', status=status.HTTP_200_OK)


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


class CheckUsernameView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username', None)
        if username is None:
            return JsonResponse({'error': 'Missing username parameter.'}, status=400)

        exists = UserDetails.objects.filter(
            username__iexact=username).exists()
        return JsonResponse({'exists': exists})


class CheckEmailView(View):
    def get(self, request, *args, **kwargs):
        email = request.GET.get('email', None)
        if email is None:
            return JsonResponse({'error': 'Missing email parameter.'}, status=400)

        exists = UserDetails.objects.filter(email__iexact=email).exists()
        return JsonResponse({'exists': exists})


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
            hiring_preferences = HiringPreference.objects.get(
                recruiter__exact=recruiter.id)
            company_profile = CompanyProfile.objects.get(
                recruiter__exact=recruiter.id)
            experience_data = Experience.objects.filter(user=user)
            education_data = Education.objects.filter(user=user)
            job_postings = Posting.objects.filter(
                recruiter__exact=recruiter.id).first()
            awards = Award.objects.filter(user=user.id).first()

            data = {
                'user_details': user,
                'recruiter_details': recruiter,
                'hiring_preference': hiring_preferences,
                'company_profile': company_profile,
                'experience_data': experience_data,
                'education_data': education_data,
                'job_postings': job_postings,
                'awards': awards
            }
            serializer = RecruiterDataSerializer(data)

            return Response(serializer.data)

        except UserDetails.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Recruiter.DoesNotExist:
            return JsonResponse({'error': 'Recruiter details not found'}, status=404)
        except HiringPreference.DoesNotExist:
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
                    HiringPreference.objects.filter(recruiter=recruiter).first())

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

                job_posting = Posting.objects.filter(
                    recruiter=recruiter).first()
                job_posting_serializer = PostingSerializer(
                    job_posting) if job_posting else None

                award = Award.objects.filter(user=recruiter.user).first()
                award_serializer = AwardSerializer(award) if award else None

                recruiter_data = {
                    'user_details': user_serializer.data,
                    'recruiter_details': recruiter_serializer.data,
                    'hiring_preference': hiring_preference_serializer.data,
                    'company_profile': company_profile_serializer.data if company_profile_serializer else None,
                    'experience_data': experience_data_serializer.data,
                    'education_data': education_data_serializer.data,
                    'job_postings': job_posting_serializer.data if job_posting_serializer else None,
                    'awards': award_serializer.data if award_serializer else None
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
    @transaction.atomic
    def post(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        experience_data = {}

        for field in Experience._meta.fields:
            field_name = field.name
            if field_name == 'user':
                experience_data[field_name] = user
            elif field_name in data:
                if isinstance(data[field_name], dict) and 'value' in data[field_name]:
                    experience_data[field_name] = data[field_name]['value']
                else:
                    experience_data[field_name] = data[field_name]
            elif field_name == 'description' and 'about' in data:
                experience_data[field_name] = data['about']

        try:
            experience = Experience.objects.create(**experience_data)
            return Response({
                "message": "Experience added successfully",
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetExperienceData(APIView):
    def get(self, request, username, id):
        try:
            user = UserDetails.objects.get(username=username)
            experience = Experience.objects.get(id=id, user=user)

            experience_data = {}
            for field in Experience._meta.fields:
                field_name = field.name
                field_value = getattr(experience, field_name)

                if isinstance(field_value, UserDetails):
                    experience_data[field_name] = field_value.username
                else:
                    experience_data[field_name] = field_value

            return Response(experience_data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateExperienceData(APIView):
    @transaction.atomic
    def put(self, request, username, id):
        try:
            user = UserDetails.objects.get(username=username)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            experience = Experience.objects.get(id=id, user=user)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        experience_data = {}

        for field in Experience._meta.fields:
            field_name = field.name
            if field_name == 'user':
                experience_data[field_name] = user
            elif field_name == 'description' and 'description' in data:
                experience_data[field_name] = data['description']
            elif field_name in data:
                if isinstance(data[field_name], dict) and 'value' in data[field_name]:
                    experience_data[field_name] = data[field_name]['value']
                else:
                    experience_data[field_name] = data[field_name]

        for key, value in experience_data.items():
            setattr(experience, key, value)

        try:
            experience.save()
            return Response({
                "message": "Experience updated successfully",
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteExperienceData(APIView):
    def delete(self, request, username, id):
        user = get_object_or_404(UserDetails, username=username)
        experience_data = get_object_or_404(Experience, id=id, user=user)

        experience_data.delete()

        return Response({"message": "Experience data deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class AddEducationData(APIView):
    @transaction.atomic
    def post(self, request, username):
        try:
            user = UserDetails.objects.get(username=username)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        education_data = {}

        for field in Education._meta.fields:
            field_name = field.name
            if field_name == 'user':
                education_data[field_name] = user
            elif field_name in data:
                if isinstance(data[field_name], dict) and 'value' in data[field_name]:
                    education_data[field_name] = data[field_name]['value']
                else:
                    education_data[field_name] = data[field_name]
            elif field_name == 'description' and 'about' in data:
                education_data[field_name] = data['about']

        try:
            education = Education.objects.create(**education_data)
            return Response({
                "message": "Education added successfully",
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetEducationData(APIView):
    def get(self, request, username, id):
        try:
            user = UserDetails.objects.get(username=username)
            education = Education.objects.get(id=id, user=user)

            education_data = {}
            for field in Education._meta.fields:
                field_name = field.name
                field_value = getattr(education, field_name)

                if isinstance(field_value, UserDetails):
                    education_data[field_name] = field_value.username
                else:
                    education_data[field_name] = field_value

            return Response(education_data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Education.DoesNotExist:
            return Response({"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateEducationData(APIView):
    @transaction.atomic
    def put(self, request, username, id):
        try:
            user = UserDetails.objects.get(username=username)
        except UserDetails.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            education = Education.objects.get(id=id, user=user)
        except Education.DoesNotExist:
            return Response({"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        education_data = {}

        for field in Education._meta.fields:
            field_name = field.name
            if field_name == 'user':
                education_data[field_name] = user
            elif field_name == 'description' and 'description' in data:
                education_data[field_name] = data['description']
            elif field_name in data:
                if isinstance(data[field_name], dict) and 'value' in data[field_name]:
                    education_data[field_name] = data[field_name]['value']
                else:
                    education_data[field_name] = data[field_name]

        for key, value in education_data.items():
            setattr(education, key, value)

        try:
            education.save()
            return Response({
                "message": "Education updated successfully",
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteEducationData(APIView):
    def delete(self, request, username, id):
        user = get_object_or_404(UserDetails, username=username)
        education_data = get_object_or_404(Education, id=id, user=user)

        education_data.delete()

        return Response({"message": "Education data deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
