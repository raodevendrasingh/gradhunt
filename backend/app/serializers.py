from rest_framework import serializers
from .models import *

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDetails
        fields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'gender', 'country', 'timezone']

class EmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        fields = ['personal_details', 'companyName', 'jobTitle', 'start_date', 'end_date', 'companyLocation']