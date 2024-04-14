from rest_framework import serializers
from .models import *

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDetails
        fields = ['userName', 'firstName', 'lastName', 'email', 'dateOfBirth', 'gender', 'country', 'timezone']

class EmploymentSerializer(serializers.ModelSerializer):
    userName = serializers.PrimaryKeyRelatedField(queryset=PersonalDetails.objects.all())

    class Meta:
        model = EmploymentDetails
        fields = ['userName', 'companyName', 'jobTitle', 'start_date', 'end_date', 'companyLocation']