from django.db import models
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
    isVerified = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    isCompanyAdmin = models.BooleanField(default=False)
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


class UserDescription(models.Model):
    user = models.OneToOneField(UserDetails, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s about"

    class Meta:
        verbose_name = "AboutData"
        verbose_name_plural = "AboutData"


class HiringPreferences(models.Model):
    user = models.OneToOneField(UserDetails, on_delete=models.CASCADE)
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
        return f"{self.user.username}"

    class Meta:
        verbose_name = "Hiring Preference"
        verbose_name_plural = "Hiring Preferences"


class CompanyProfile(models.Model):
    user = models.OneToOneField(UserDetails, on_delete=models.CASCADE)
    companyLogo = models.URLField(max_length=512, blank=True, null=True)
    companyBanner = models.URLField(max_length=512, blank=True, null=True)
    companyName = models.CharField(max_length=100, blank=True, null=True)
    tagline = models.CharField(max_length=255, blank=True, null=True)
    companyEmail = models.EmailField(max_length=100, blank=True, null=True)
    companyPhone = models.CharField(max_length=20, blank=True, null=True)
    companyWebsite = models.URLField(max_length=100, blank=True, null=True)
    linkedin = models.URLField(max_length=200, null=True, blank=True)
    twitter = models.URLField(max_length=200, null=True, blank=True)
    instagram = models.URLField(max_length=200, null=True, blank=True)
    employeeSize = models.CharField(max_length=50)
    establishedYear = models.CharField(max_length=4)
    industry = models.CharField(max_length=100)
    headquarters = models.CharField(max_length=200)
    branches = ArrayField(models.CharField(
        max_length=512), blank=True, default=list)
    marketCap = models.CharField(max_length=50, blank=True, null=True)
    fundingRaised = models.CharField(max_length=50, blank=True, null=True)
    companyType = models.CharField(max_length=50, blank=True, null=True)
    openPositions = models.IntegerField(blank=True, null=True)
    yearlyRevenue = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    isDraft = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.companyName}'s {self.user.username}"

    class Meta:
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profiles"


class JobPostings(models.Model):
    company = models.ForeignKey(
        CompanyProfile, on_delete=models.CASCADE, related_name='job_postings')
    jobId = models.CharField(max_length=8, blank=True, null=True)
    isActive = models.BooleanField(default=True)
    jobTitle = models.CharField(max_length=100)
    jobType = models.CharField(max_length=50)
    workType = models.CharField(max_length=50, blank=True, null=True)
    jobDescription = models.TextField()
    salaryRange = models.CharField(max_length=50)
    requiredSkills = ArrayField(models.JSONField(), default=list, blank=True)
    jobLocation = models.CharField(max_length=200, blank=True, null=True)
    experience = models.CharField(max_length=100)
    postedDate = models.DateTimeField(auto_now_add=True)
    applicationDeadline = models.DateField()
    applyLink = models.URLField(max_length=255, blank=True, null=True)
    applyWithUs = models.BooleanField(default=False)
    isSaved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.jobTitle} at {self.company.companyName}"

    class Meta:
        verbose_name = "Job Posting"
        verbose_name_plural = "Job Postings"


class JobApplication(models.Model):
    candidate = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='job_applications')
    jobPosting = models.ForeignKey(
        JobPostings, on_delete=models.CASCADE, related_name='applications')
    appliedDate = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='applied')

    def __str__(self):
        return f"{self.candidate.username} applied to {self.jobPosting.jobTitle}"

    class Meta:
        verbose_name = "Job Application"
        verbose_name_plural = "Job Applications"


class Experience(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=50)
    jobTitle = models.CharField(max_length=50)
    jobType = models.CharField(max_length=50)
    startMonth = models.CharField(max_length=20)
    startYear = models.CharField(max_length=4)
    endMonth = models.CharField(max_length=20, blank=True, null=True)
    endYear = models.CharField(max_length=4, blank=True, null=True)
    jobLocation = models.CharField(max_length=100)
    locationType = models.CharField(max_length=60)
    companyWebsite = models.URLField(max_length=100, blank=True, null=True)
    isVerified = models.BooleanField(default=False)
    verificationCode = models.CharField(max_length=6, blank=True, null=True)
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
    instituteWebsite = models.URLField(max_length=100, blank=True, null=True)
    isVerified = models.BooleanField(default=False)
    verificationCode = models.CharField(max_length=6, blank=True, null=True)
    grade = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.instituteName} [{self.user.username}]"

    class Meta:
        verbose_name = "Education"
        verbose_name_plural = "Education"


class Projects(models.Model):
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


class Certifications(models.Model):
    user = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    certificateName = models.CharField(max_length=50)
    issuerOrg = models.CharField(max_length=50)
    credentialUrl = models.URLField(max_length=255)
    credentialId = models.CharField(max_length=255, blank=True, null=True)
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
    user = models.OneToOneField(
        UserDetails, on_delete=models.CASCADE, related_name='skills')
    skills_list = ArrayField(
        models.JSONField(),
        default=list,
        blank=True
    )

    def __str__(self):
        return f"{self.user.username}'s skills"

    class Meta:
        verbose_name = "Skills"
        verbose_name_plural = "Skills"
