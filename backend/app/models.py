from django.db import models
from django.core.validators import URLValidator
from django.contrib.postgres.fields import ArrayField


class UserDetails(models.Model):
    clerk_user_id = models.CharField(max_length=255, unique=True, null=True)
    profilePicture = models.URLField(max_length=512, blank=True, null=True)
    username = models.CharField(max_length=100)
    usertype = models.CharField(max_length=100)
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    bio = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=60, null=True, blank=True)
    isProfileActivated = models.BooleanField(default=False)
    isProfilePublic = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    resumeLink = models.URLField(max_length=512, null=True, blank=True)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "User Details"
        verbose_name_plural = "User Details"


class Linguistics(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    language = models.CharField(max_length=20, null=True, blank=True)
    proficiency = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Linguistic"
        verbose_name_plural = "Linguistics"


class SocialLinks(models.Model):
    user = models.OneToOneField(UserDetails, on_delete=models.CASCADE)
    linkedin = models.URLField(max_length=200, null=True, blank=True)
    github = models.URLField(max_length=200, null=True, blank=True)
    leetcode = models.URLField(max_length=200, null=True, blank=True)
    twitter = models.URLField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Social Link"
        verbose_name_plural = "Social Links"


class AboutData(models.Model):
    user = models.OneToOneField(UserDetails, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s about"

    class Meta:
        verbose_name = "AboutData"
        verbose_name_plural = "AboutData"


class Recruiter(models.Model):
    user = models.OneToOneField(UserDetails, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=100)
    jobTitle = models.CharField(max_length=100)
    startDate = models.DateField()
    endDate = models.DateField(blank=True, null=True)
    companyLocation = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} from {self.companyName}"

    class Meta:
        verbose_name = "Recruiter Detail"
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
        verbose_name_plural = "Hiring Preferences"


class Posting(models.Model):
    recruiter = models.ForeignKey(
        Recruiter,
        on_delete=models.CASCADE,
    )
    isActive = models.BooleanField()
    jobTitle = models.CharField(max_length=100)
    jobType = models.CharField(max_length=50)
    jobDescription = models.TextField()
    salaryRange = models.CharField(max_length=50)
    companySize = models.CharField(max_length=100)
    skillsRequired = ArrayField(models.CharField(
        max_length=200), blank=True, default=list)
    jobLocation = ArrayField(models.CharField(
        max_length=200), blank=True, default=list)
    experience = models.CharField(max_length=100)
    postedDate = models.DateField()
    applyLink = models.URLField(max_length=200)
    applicationDeadline = models.DateField()

    def __str__(self):
        return f"{self.recruiter.user.username} from {self.recruiter.companyName}"

    class Meta:
        verbose_name = "Job Posting"
        verbose_name_plural = "Job Postings"


class Award(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    awardName = models.CharField(max_length=255)
    yearReceived = models.IntegerField()

    def __str__(self):
        return f"{self.awardName} [{self.user.username}]"

    class Meta:
        verbose_name = "Award"
        verbose_name_plural = "Awards"


class CompanyProfile(models.Model):
    recruiter = models.OneToOneField(
        Recruiter, on_delete=models.CASCADE, primary_key=True)
    companyLogo = models.URLField(max_length=512, blank=True, null=True)
    companyBanner = models.URLField(max_length=512, blank=True, null=True)
    companyName = models.CharField(max_length=100)
    website = models.CharField(max_length=100, validators=[URLValidator()])
    employeeSize = models.CharField(max_length=50)
    establishedYear = models.CharField(max_length=6)
    industry = models.CharField(max_length=100)
    headquarters = models.CharField(max_length=200)
    branches = ArrayField(models.CharField(
        max_length=512), blank=True, default=list)
    about = models.TextField()
    values = models.TextField()

    def __str__(self):
        return f"{self.companyName}'s {self.recruiter.user.username}"

    class Meta:
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profiles"


class Experience(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=50)
    jobTitle = models.CharField(max_length=50)
    jobType = models.CharField(max_length=50)
    startMonth = models.CharField(max_length=20)
    startYear = models.CharField(max_length=4)
    endMonth = models.CharField(max_length=20, blank=True)
    endYear = models.CharField(max_length=4, blank=True)
    jobLocation = models.CharField(max_length=100)
    locationType = models.CharField(max_length=60)
    description = models.TextField(blank=True, default='')
    isCurrentlyWorking = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.companyName} [{self.user.username}]"

    class Meta:
        verbose_name = "Experience"
        verbose_name_plural = "Experiences"


class Education(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    instituteName = models.CharField(max_length=50)
    degreeTitle = models.CharField(max_length=50)
    studyField = models.CharField(max_length=50)
    startMonth = models.CharField(max_length=20)
    startYear = models.CharField(max_length=4)
    endMonth = models.CharField(max_length=20)
    endYear = models.CharField(max_length=4)
    instituteLocation = models.CharField(max_length=100)
    grade = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.instituteName} [{self.user.username}]"

    class Meta:
        verbose_name = "Education"
        verbose_name_plural = "Education"


class Project(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    projectName = models.CharField(max_length=50)
    description = models.TextField(blank=True, default='')
    liveLink = models.URLField(max_length=200, blank=True, default='')
    sourceCodeLink = models.URLField(max_length=200, blank=True, default='')
    skills = ArrayField(models.CharField(max_length=200),
                        blank=True, default=list)
    startMonth = models.CharField(max_length=20)
    startYear = models.CharField(max_length=4)
    endMonth = models.CharField(max_length=20, blank=True, null=True)
    endYear = models.CharField(max_length=4, blank=True, null=True)
    isCurrentlyWorking = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.projectName} [{self.user.username}]"

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"


class Certificate(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    certificateName = models.CharField(max_length=50)
    issuerOrg = models.CharField(max_length=50)
    credentialUrl = models.URLField(max_length=200)
    credentialId = models.CharField(max_length=255)
    isValid = models.BooleanField(default=False)
    startMonth = models.CharField(max_length=20)
    startYear = models.CharField(max_length=4)
    endMonth = models.CharField(max_length=20, blank=True, null=True)
    endYear = models.CharField(max_length=4, blank=True, null=True)

    def __str__(self):
        return f"{self.certificateName} [{self.user.username}]"

    class Meta:
        verbose_name = "Certificate"
        verbose_name_plural = "Certificates"


class Skills(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    label = models.CharField(max_length=100)
    image = models.URLField(max_length=200)
    category = models.CharField(max_length=100)

    def __str__(self):
        return {self.user.username}

    class Meta:
        verbose_name = "Skill"
        verbose_name_plural = "Skills"
