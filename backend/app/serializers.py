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


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['companyLogo', 'companyCover', 'companyName', 'website', 'employeeSize',
                  'establishedYear', 'industry', 'headquarters', 'branches', 'about', 'values']
        read_only_fields = ['recruiter']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.companyLogo:
            representation['companyLogo'] = instance.companyLogo.url
        if instance.companyCover:
            representation['companyCover'] = instance.companyCover.url
        return representation

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class RecruiterDataSerializer(serializers.Serializer):
    user_details = UserSerializer()
    recruiter_details = RecruiterSerializer()
    hiring_preference = HiringPreferenceSerializer()
    company_profile = CompanyProfileSerializer()
    job_postings = PostingSerializer(allow_null=True)
    awards = AwardSerializer(allow_null=True)


class Meta:
    fields = ['user_details', 'recruiter_details',
              'hiring_preference', 'company_profile', 'job_postings', 'awards']
