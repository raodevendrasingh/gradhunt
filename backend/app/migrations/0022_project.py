# Generated by Django 5.0.4 on 2024-08-07 15:43

import django.contrib.postgres.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0021_aboutdata'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('projectName', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, default='')),
                ('liveLink', models.CharField(max_length=255)),
                ('sourceCodeLink', models.CharField(max_length=255)),
                ('skills', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('isCurrentlyWorking', models.BooleanField(default=False)),
                ('startMonth', models.CharField(max_length=20)),
                ('startYear', models.CharField(max_length=4)),
                ('endMonth', models.CharField(blank=True, max_length=20, null=True)),
                ('endYear', models.CharField(blank=True, max_length=4, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Project',
                'verbose_name_plural': 'Projects',
            },
        ),
    ]
