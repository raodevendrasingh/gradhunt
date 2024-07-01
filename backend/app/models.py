from django.db import models
from django.contrib.postgres.fields import ArrayField


class UserDetails(models.Model):
    profilePicture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    username = models.CharField(max_length=100)
    usertype = models.CharField(max_length=100)
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    mobileNumber = models.CharField(max_length=20, null=True, blank=True)
    timezone = models.CharField(max_length=100)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "User Details"
        verbose_name_plural = "User Details"


class Recruiter(models.Model):
    user = models.OneToOneField(UserDetails, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=100)
    jobTitle = models.CharField(max_length=100)
    startDate = models.DateField()
    endDate = models.DateField(blank=True, null=True)
    Address1 = models.CharField(max_length=100)
    Address2 = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)

    def __str__(self):
        return self.companyName

    class Meta:
        verbose_name = "Recruiter Details"
        verbose_name_plural = "Recruiter Details"


class HiringPreference(models.Model):
    recruiter = models.OneToOneField(
        Recruiter,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    experience = models.IntegerField()
    levels = ArrayField(models.CharField(max_length=200),
                        blank=True, default=list)
    industry = ArrayField(models.CharField(
        max_length=200), blank=True, default=list)
    function = ArrayField(models.CharField(
        max_length=200), blank=True, default=list)
    skills = ArrayField(models.CharField(max_length=200),
                        blank=True, default=list)

    class Meta:
        verbose_name = "Hiring Preference"
        verbose_name_plural = "Hiring Preference"


class Posting(models.Model):
    recruiter = models.ForeignKey(
        Recruiter,
        on_delete=models.CASCADE,
    )
    isActive = models.BooleanField()
    jobtitle = models.CharField(max_length=100)
    jobType = ArrayField(models.CharField(
        max_length=50, blank=True, default=list))
    jobDescription = models.TextField()
    companySize = models.CharField(max_length=100)
    skillRequired = ArrayField(models.CharField(
        max_length=100, blank=True, default=list))
    experience = models.CharField(max_length=50)
    postedDate = models.DateField()

    def __str__(self):
        return self.jobtitle

    class Meta:
        verbose_name = "Job Postings"
        verbose_name_plural = "Job Postings"


class Award(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    awardName = models.CharField(max_length=255)
    yearReceived = models.IntegerField()

    def __str__(self):
        return self.awardName

    class Meta:
        verbose_name = "Award"
        verbose_name_plural = "Award"
