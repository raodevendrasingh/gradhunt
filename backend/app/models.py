from django.db import models
from django.core.validators import URLValidator
from django.contrib.postgres.fields import ArrayField


class UserDetails(models.Model):
    clerk_user_id = models.CharField(max_length=255, unique=True, null=True)
    profilePicture = models.ImageField(
        upload_to='profile_pics/', null=True, blank=True)
    username = models.CharField(max_length=100)
    usertype = models.CharField(max_length=100)
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    bio = models.CharField(max_length=255)
    mobileNumber = models.CharField(max_length=20, null=True, blank=True)
    timezone = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

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
        return f"{self.user.username} from {self.companyName}"

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

    def __str__(self):
        return f"{self.recruiter.user.username} from {self.recruiter.companyName}"

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
        return f"{self.recruiter.user.username} from {self.recruiter.companyName}"

    class Meta:
        verbose_name = "Job Postings"
        verbose_name_plural = "Job Postings"


class Award(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    awardName = models.CharField(max_length=255)
    yearReceived = models.IntegerField()

    def __str__(self):
        return f"{self.awardName} [{self.user.username}]"

    class Meta:
        verbose_name = "Awards"
        verbose_name_plural = "Awards"


class CompanyProfile(models.Model):
    recruiter = models.OneToOneField(
        Recruiter, on_delete=models.CASCADE, primary_key=True)
    companyLogo = models.ImageField(
        upload_to='company_logo/', null=True, blank=True)
    companyCover = models.ImageField(
        upload_to='company_cover/', null=True, blank=True)
    companyName = models.CharField(max_length=100)
    website = models.CharField(max_length=100, validators=[URLValidator()])
    employeeSize = models.CharField(max_length=50)
    establishedYear = models.CharField(max_length=6)
    industry = models.CharField(max_length=100)
    headquarters = models.CharField(max_length=200)
    branches = models.CharField(max_length=500, blank=True, null=True)
    about = models.TextField()
    values = models.TextField()

    def __str__(self):
        return f"{self.companyName}'s {self.recruiter.user.username}"

    class Meta:
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profile"


class Experience(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=50)
    jobTitle = models.CharField(max_length=50)
    jobType = models.CharField(max_length=50)
    startMonth = models.CharField(max_length=20)
    startYear = models.CharField(max_length=4)
    endMonth = models.CharField(max_length=20, blank=True)
    endYear = models.CharField(max_length=4, blank=True)
    jobLocation = models.CharField(max_length=60)
    locationType = models.CharField(max_length=60)
    description = models.TextField(blank=True, default='')
    isCurrentlyWorking = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.companyName} [{self.user.username}]"

    class Meta:
        verbose_name = "Experience"
        verbose_name_plural = "Experience"


class Education(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    instituteName = models.CharField(max_length=50)
    degreeTitle = models.CharField(max_length=50)
    studyField = models.CharField(max_length=50)
    startMonth = models.CharField(max_length=20)
    startYear = models.CharField(max_length=4)
    endMonth = models.CharField(max_length=20)
    endYear = models.CharField(max_length=4)
    instituteLocation = models.CharField(max_length=60)
    grade = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.instituteName} [{self.user.username}]"

    class Meta:
        verbose_name = "Education"
        verbose_name_plural = "Education"
