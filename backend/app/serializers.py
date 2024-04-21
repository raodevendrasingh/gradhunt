from rest_framework import serializers
from .models import *


class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDetails
        fields = ['id', 'userName', 'firstName', 'lastName',
                  'email', 'dateOfBirth', 'gender', 'country', 'timezone']


class EmploymentSerializer(serializers.ModelSerializer):
    # userName = serializers.PrimaryKeyRelatedField(queryset=PersonalDetails.objects.all())
    personal_details = serializers.PrimaryKeyRelatedField(
        queryset=PersonalDetails.objects.all())

    class Meta:
        model = EmploymentDetails
        fields = ['personal_details', 'companyName', 'jobTitle',
                  'start_date', 'end_date', 'companyLocation']


class ShowDataSerializer(serializers.Serializer):
    personal_details = PersonalSerializer()
    employment_details = EmploymentSerializer()

    class Meta:
        fields = ['personal_details', 'employment_details']
