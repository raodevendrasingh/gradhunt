# Generated by Django 5.0.4 on 2024-07-01 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_rename_mobilemumber_userdetails_mobilenumber_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetails',
            name='mobileNumber',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
