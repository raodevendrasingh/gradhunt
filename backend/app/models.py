from django.db import models


class PersonalDetails(models.Model):
    id = models.AutoField(primary_key=True)
    userName = models.CharField(max_length=100, unique=True)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    dateOfBirth = models.DateField()
    gender = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    timezone = models.CharField(max_length=100)

    def __str__(self):
        return self.userName

    class Meta:
        verbose_name = "Personal Details"
        verbose_name_plural = "Personal Details"


class EmploymentDetails(models.Model):
    personal_details = models.ForeignKey(
        PersonalDetails, on_delete=models.CASCADE, related_name='employment_details')
    companyName = models.CharField(max_length=100)
    jobTitle = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    companyLocation = models.CharField(max_length=100)

    def __str__(self):
        return self.companyName

    class Meta:
        verbose_name = "Employment Details"
        verbose_name_plural = "Employment Details"
