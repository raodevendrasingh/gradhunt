# Generated by Django 5.0.8 on 2024-10-20 09:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_remove_jobpostings_salaryrange_jobpostings_currency_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobpostings',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.companyprofile'),
        ),
    ]
