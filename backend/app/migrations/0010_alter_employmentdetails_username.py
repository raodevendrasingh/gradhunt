# Generated by Django 5.0.4 on 2024-04-14 05:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_alter_employmentdetails_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employmentdetails',
            name='userName',
            field=models.ForeignKey(db_column='userName_id', on_delete=django.db.models.deletion.CASCADE, related_name='employment_details', to='app.personaldetails'),
        ),
    ]
