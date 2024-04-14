from django.db import models
from shortuuid.django_fields import ShortUUIDField
import uuid


class PersonalDetails(models.Model):
    # id = ShortUUIDField(
    #     length=7,
    #     max_length=15,
    #     prefix="user_",
    #     alphabet="0123456789abcdefghijklmnopqrstuvwxyz",
    #     primary_key=True,
    # )
    # id = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    dateOfBirth = models.DateField()
    gender = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    timezone = models.CharField(max_length=100)

    def __str__(self):
        return self.firstName


class EmploymentDetails(models.Model):
    personal_details = models.ForeignKey(
        PersonalDetails, on_delete=models.CASCADE)
    companyName = models.CharField(max_length=100)
    jobTitle = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    companyLocation = models.CharField(max_length=100)

    def __str__(self):
        return self.companyName
