from .models import Experience
from rest_framework import serializers
from .models import *


class NestedDictField(serializers.Field):
    def __init__(self, required=True, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.required = required

    def to_internal_value(self, data):
        if self.required and data is None:
            raise serializers.ValidationError('This field is required')
        if isinstance(data, dict):
            return data.get('value')
        return data

    def to_representation(self, value):
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = '__all__'


class LinguisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Linguistics
        fields = '__all__'


class SocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLinks
        fields = '__all__'


class AboutDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutData
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


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
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


class ExperienceSerializer(serializers.ModelSerializer):
    jobTitle = NestedDictField()
    jobType = NestedDictField()
    startMonth = NestedDictField()
    startYear = NestedDictField()
    endMonth = NestedDictField(required=False)
    endYear = NestedDictField(required=False)
    locationType = NestedDictField()

    class Meta:
        model = Experience
        fields = ['id', 'companyName', 'jobTitle', 'jobType', 'startMonth', 'startYear',
                  'endMonth', 'endYear', 'jobLocation', 'locationType', 'description',
                  'isCurrentlyWorking', 'user']
        read_only_fields = ['id']

    def create(self, validated_data):
        return Experience.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class EducationSerializer(serializers.ModelSerializer):
    degreeTitle = NestedDictField()
    studyField = NestedDictField()
    startMonth = NestedDictField()
    startYear = NestedDictField()
    endMonth = NestedDictField(required=False)
    endYear = NestedDictField(required=False)

    class Meta:
        model = Education
        fields = ['id', 'instituteName', 'degreeTitle', 'studyField', 'startMonth', 'startYear',
                  'endMonth', 'endYear', 'instituteLocation', 'grade', 'description', 'user']
        read_only_fields = ['id']

    def create(self, validated_data):
        return Education.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'


class RecruiterDataSerializer(serializers.Serializer):
    user_details = UserSerializer()
    recruiter_details = RecruiterSerializer()
    hiring_preference = HiringPreferenceSerializer()
    company_profile = CompanyProfileSerializer()
    experience_data = ExperienceSerializer(many=True)
    education_data = EducationSerializer(many=True)
    job_postings = PostingSerializer(allow_null=True)
    awards = AwardSerializer(allow_null=True)

    class Meta:
        fields = ['user_details', 'recruiter_details',
                  'hiring_preference', 'company_profile', 'experience_data', 'education_data', 'job_postings', 'awards']
