from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = '__all__'


class RecruiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruiter
        fields = '__all__'


class HiringPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HiringPreference
        fields = '__all__'


class PostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posting
        fields = '__all__'


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = '__all__'


class RecruiterDataSerializer(serializers.Serializer):
    user_details = UserSerializer()
    recruiter_details = RecruiterSerializer()
    hiring_preference = HiringPreferenceSerializer()
    job_postings = PostingSerializer(allow_null=True)
    awards = AwardSerializer(allow_null=True)

    class Meta:
        fields = ['user_details', 'recruiter_details',
                  'hiring_preference', 'job_postings', 'awards']
