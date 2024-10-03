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


class UserDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDescription
        fields = '__all__'


class HiringPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HiringPreferences
        fields = '__all__'


class PostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPostings
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(child=NestedDictField())
    startMonth = NestedDictField()
    startYear = NestedDictField()
    endMonth = NestedDictField(required=False)
    endYear = NestedDictField(required=False)

    class Meta:
        model = Projects
        fields = ['id', 'projectName', 'description', 'liveLink', 'skills', 'sourceCodeLink',
                  'isCurrentlyWorking', 'startMonth', 'startYear', 'endMonth', 'endYear', 'user']
        read_only_fields = ['id']

    def create(self, validated_data):
        return Projects.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CertificateSerializer(serializers.ModelSerializer):
    startMonth = NestedDictField()
    startYear = NestedDictField()
    endMonth = serializers.CharField(
        allow_blank=True, allow_null=True, required=False)
    endYear = serializers.CharField(
        allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Certifications
        fields = ['id', 'certificateName', 'issuerOrg', 'credentialUrl', 'credentialId',
                  'isValid', 'startMonth', 'startYear', 'endMonth', 'endYear', 'user']
        read_only_fields = ['id']

    def create(self, validated_data):
        return Certifications.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ['user', 'skills_list']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['skills_list'] = instance.skills_list
        return representation


class ExperienceSerializer(serializers.ModelSerializer):
    jobTitle = NestedDictField()
    jobType = NestedDictField()
    startMonth = NestedDictField()
    startYear = NestedDictField()
    endMonth = serializers.CharField(
        allow_blank=True, allow_null=True, required=False)
    endYear = serializers.CharField(
        allow_blank=True, allow_null=True, required=False)
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
