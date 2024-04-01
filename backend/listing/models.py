from django.db import models


class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    date_of_birth = models.DateField()


class AcademicDetail(models.Model):
    DEGREE_TYPES = [
        ('BA', 'Bachelor of Arts'),
        ('BS', 'Bachelor of Science'),
        ('MA', 'Master of Arts'),
        ('MS', 'Master of Science'),
        # Add more degree types as needed
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    college_name = models.CharField(max_length=255)
    start_year = models.IntegerField()
    end_year = models.IntegerField()
    field_of_study = models.CharField(max_length=255)
    degree_type = models.CharField(max_length=2, choices=DEGREE_TYPES)
    gpa = models.DecimalField(max_digits=4, decimal_places=2)


class TechnicalSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=255)
    proficiency = models.CharField(max_length=255)


class Certification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    certification_name = models.CharField(max_length=255)
    certification_body = models.CharField(max_length=255)
    year_received = models.IntegerField()
    valid_until = models.DateField()


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    project_description = models.TextField()


class EmploymentExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    job_description = models.TextField()
    location = models.CharField(max_length=255)


class Achievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achievement_name = models.CharField(max_length=255)
    year_received = models.IntegerField()


class Award(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    award_name = models.CharField(max_length=255)
    year_received = models.IntegerField()


class Reference(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reference_name = models.CharField(max_length=255)
    reference_contact = models.CharField(max_length=255)
    reference_relationship = models.CharField(max_length=255)


class HiringManager(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)


class EmploymentHistory(models.Model):
    hiring_manager = models.ForeignKey(HiringManager, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    industry = models.CharField(max_length=255)
    company_size = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()


class JobPosting(models.Model):
    hiring_manager = models.ForeignKey(HiringManager, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255)
    job_description = models.TextField()
    location = models.CharField(max_length=255)
    posted_date = models.DateField()
