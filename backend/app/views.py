from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views import View
from django.http import HttpResponse
from .models import *
from .serializers import PersonalSerializer, EmploymentSerializer


def home(request):
    return HttpResponse('This is the home page', status=200)


@api_view(['POST'])
def create_manager(request):
    if request.method == 'POST':
        data = request.data

        personal_serializer = PersonalSerializer(data=data['personalDetails'])
        if not personal_serializer.is_valid():
            return Response({'status': 'error', 'errors': personal_serializer.errors}, status=400)

        personal_details_instance = personal_serializer.save()

        employment_data = data['employmentDetails']
        employment_data['userName'] = personal_details_instance.userName
        employment_serializer = EmploymentSerializer(data=employment_data)
        if not employment_serializer.is_valid():
            return Response({'status': 'error', 'errors': employment_serializer.errors}, status=400)

        employment_serializer.save()
        return Response({'status': 'success'}, status=200)


class CheckUsernameView(View):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username', None)
        if username is None:
            return JsonResponse({'error': 'Missing username parameter.'}, status=400)

        exists = PersonalDetails.objects.filter(
            userName__iexact=username).exists()
        return JsonResponse({'exists': exists})


class CheckEmailView(View):
    def get(self, request, *args, **kwargs):
        email = request.GET.get('email', None)
        if email is None:
            return JsonResponse({'error': 'Missing email parameter.'}, status=400)

        exists = PersonalDetails.objects.filter(email__iexact=email).exists()
        return JsonResponse({'exists': exists})
