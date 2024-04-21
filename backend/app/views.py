from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.http import JsonResponse
from django.views import View
from .models import *
from .serializers import *


class HomeView(APIView):
    def get(self, request):
        return Response('This is the API home page', status=status.HTTP_200_OK)


class CreateManagerView(APIView):
    def post(self, request):
        data = request.data

        personal_serializer = PersonalSerializer(data=data['personalDetails'])
        if not personal_serializer.is_valid():
            return Response({'status': 'error', 'errors': personal_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        personal_details_instance = personal_serializer.save()

        employment_data = data['employmentDetails']
        employment_data['personal_details'] = personal_details_instance.id
        employment_serializer = EmploymentSerializer(data=employment_data)
        if not employment_serializer.is_valid():
            return Response({'status': 'error', 'errors': employment_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        employment_instance = employment_serializer.save()
        return Response(
            {
                'status': 'success',
                'message': 'Manager created successfully',
                'id': personal_details_instance.id,
                'username': personal_details_instance.userName
            },
            status=status.HTTP_200_OK
        )


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


class ListManagersView(APIView):
    def get(self, request):
        managers = EmploymentDetails.objects.all()
        data = [{'personal_details': manager.personal_details,
                 'employment_details': manager} for manager in managers]
        serializer = ShowDataSerializer(data, many=True)
        return Response(serializer.data)


class GetManagerView(APIView):
    def get(self, request, id):
        try:
            manager = EmploymentDetails.objects.get(personal_details__id=id)
            data = {'personal_details': manager.personal_details,
                    'employment_details': manager}
            serializer = ShowDataSerializer(data)
            return Response(serializer.data)
        except EmploymentDetails.DoesNotExist:
            return Response({'status': 'error', 'message': 'Manager not found'}, status=404)
