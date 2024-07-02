from .models import *
from .serializers import *
from django.views import View
from django.db import transaction
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response


class HomeView(APIView):
    def get(self, request):
        return Response('This is the API home page', status=status.HTTP_200_OK)


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
                # 'id': user_instance.id,
                # 'username': user_instance.username,
                # 'usertype': user_instance.usertype
            },
            status=status.HTTP_200_OK
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


class GetRecruiterDetails(APIView):
    def get(self, request, username):
        try:
            user = UserDetails.objects.get(username__iexact=username)
            recruiter = Recruiter.objects.get(user__exact=user.id)
            hiring_preferences = HiringPreference.objects.get(
                recruiter__exact=recruiter.id)
            job_postings = Posting.objects.filter(
                recruiter__exact=recruiter.id).first()
            awards = Award.objects.filter(user=user.id).first()

            data = {
                'user_details': user,
                'recruiter_details': recruiter,
                'hiring_preference': hiring_preferences,
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
                    'job_postings': job_posting_serializer.data if job_posting_serializer else None,
                    'awards': award_serializer.data if award_serializer else None
                }
                data.append(recruiter_data)

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
