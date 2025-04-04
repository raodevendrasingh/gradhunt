# Generated by Django 5.0.8 on 2024-10-16 05:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_jobpostings_isapplied'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='jobapplication',
            unique_together={('candidate', 'jobPosting')},
        ),
        migrations.CreateModel(
            name='SavedJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('saved_at', models.DateTimeField(auto_now_add=True)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
                ('jobPosting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.jobpostings')),
            ],
            options={
                'verbose_name': 'Saved Job',
                'verbose_name_plural': 'Saved Jobs',
                'unique_together': {('candidate', 'jobPosting')},
            },
        ),
    ]
