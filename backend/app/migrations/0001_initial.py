# Generated by Django 5.0.8 on 2024-10-02 09:34

import django.contrib.postgres.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CompanyProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('companyLogo', models.URLField(blank=True, max_length=512, null=True)),
                ('companyBanner', models.URLField(blank=True, max_length=512, null=True)),
                ('companyName', models.CharField(max_length=100)),
                ('companyEmail', models.EmailField(max_length=100)),
                ('companyWebsite', models.URLField(blank=True, max_length=100, null=True)),
                ('employeeSize', models.CharField(max_length=50)),
                ('establishedYear', models.CharField(max_length=6)),
                ('industry', models.CharField(max_length=100)),
                ('headquarters', models.CharField(max_length=200)),
                ('branches', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=512), blank=True, default=list, size=None)),
                ('about', models.TextField()),
                ('values', models.TextField()),
            ],
            options={
                'verbose_name': 'Company Profile',
                'verbose_name_plural': 'Company Profiles',
            },
        ),
        migrations.CreateModel(
            name='UserDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('clerk_user_id', models.CharField(max_length=255, null=True, unique=True)),
                ('profilePicture', models.URLField(blank=True, max_length=512, null=True)),
                ('username', models.CharField(max_length=100)),
                ('usertype', models.CharField(max_length=100)),
                ('firstname', models.CharField(max_length=255)),
                ('lastname', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=255)),
                ('bio', models.CharField(blank=True, max_length=255, null=True)),
                ('location', models.CharField(blank=True, max_length=60, null=True)),
                ('isProfileActivated', models.BooleanField(default=False)),
                ('isProfilePublic', models.BooleanField(default=False)),
                ('isVerified', models.BooleanField(default=False)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('resumeLink', models.URLField(blank=True, max_length=512, null=True)),
            ],
            options={
                'verbose_name': 'User Details',
                'verbose_name_plural': 'User Details',
            },
        ),
        migrations.CreateModel(
            name='JobPostings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isActive', models.BooleanField()),
                ('jobTitle', models.CharField(max_length=100)),
                ('jobType', models.CharField(max_length=50)),
                ('jobDescription', models.TextField()),
                ('salaryRange', models.CharField(max_length=50)),
                ('companySize', models.CharField(max_length=100)),
                ('skillsRequired', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('jobLocation', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('experience', models.CharField(max_length=100)),
                ('postedDate', models.DateField()),
                ('applyLink', models.URLField()),
                ('applyWithUs', models.BooleanField(default=False)),
                ('applicationDeadline', models.DateField()),
                ('company', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.companyprofile')),
            ],
            options={
                'verbose_name': 'Job Posting',
                'verbose_name_plural': 'Job Postings',
            },
        ),
        migrations.CreateModel(
            name='UserDescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'AboutData',
                'verbose_name_plural': 'AboutData',
            },
        ),
        migrations.CreateModel(
            name='SocialLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('linkedin', models.URLField(blank=True, null=True)),
                ('github', models.URLField(blank=True, null=True)),
                ('leetcode', models.URLField(blank=True, null=True)),
                ('twitter', models.URLField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Social Link',
                'verbose_name_plural': 'Social Links',
            },
        ),
        migrations.CreateModel(
            name='Skills',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skills_list', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, default=list, size=None)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='skills', to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Skills',
                'verbose_name_plural': 'Skills',
            },
        ),
        migrations.CreateModel(
            name='Recruiter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('companyName', models.CharField(max_length=100)),
                ('jobTitle', models.CharField(max_length=100)),
                ('startDate', models.DateField()),
                ('endDate', models.DateField(blank=True, null=True)),
                ('companyLocation', models.CharField(blank=True, max_length=100, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Recruiter Detail',
                'verbose_name_plural': 'Recruiter Details',
            },
        ),
        migrations.CreateModel(
            name='Projects',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('projectName', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, default='')),
                ('liveLink', models.URLField(blank=True, default='')),
                ('sourceCodeLink', models.URLField(blank=True, default='')),
                ('skills', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('startMonth', models.CharField(max_length=20)),
                ('startYear', models.CharField(max_length=4)),
                ('endMonth', models.CharField(blank=True, max_length=20, null=True)),
                ('endYear', models.CharField(blank=True, max_length=4, null=True)),
                ('isCurrentlyWorking', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Project',
                'verbose_name_plural': 'Projects',
            },
        ),
        migrations.CreateModel(
            name='Linguistics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(blank=True, max_length=20, null=True)),
                ('proficiency', models.CharField(blank=True, max_length=20, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Linguistic',
                'verbose_name_plural': 'Linguistics',
            },
        ),
        migrations.CreateModel(
            name='HiringPreferences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('experience', models.IntegerField()),
                ('levels', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('industry', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('function', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('skills', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, size=None)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Hiring Preference',
                'verbose_name_plural': 'Hiring Preferences',
            },
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('companyName', models.CharField(max_length=50)),
                ('jobTitle', models.CharField(max_length=50)),
                ('jobType', models.CharField(max_length=50)),
                ('startMonth', models.CharField(max_length=20)),
                ('startYear', models.CharField(max_length=4)),
                ('endMonth', models.CharField(blank=True, max_length=20)),
                ('endYear', models.CharField(blank=True, max_length=4)),
                ('jobLocation', models.CharField(max_length=100)),
                ('locationType', models.CharField(max_length=60)),
                ('companyWebsite', models.URLField(blank=True, max_length=100, null=True)),
                ('isVerified', models.BooleanField(default=False)),
                ('verificationCode', models.CharField(blank=True, max_length=6, null=True)),
                ('description', models.TextField(blank=True, default='')),
                ('isCurrentlyWorking', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Experience',
                'verbose_name_plural': 'Experiences',
            },
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('instituteName', models.CharField(max_length=50)),
                ('degreeTitle', models.CharField(max_length=50)),
                ('studyField', models.CharField(max_length=50)),
                ('startMonth', models.CharField(max_length=20)),
                ('startYear', models.CharField(max_length=4)),
                ('endMonth', models.CharField(max_length=20)),
                ('endYear', models.CharField(max_length=4)),
                ('instituteLocation', models.CharField(max_length=100)),
                ('instituteWebsite', models.URLField(blank=True, max_length=100, null=True)),
                ('isVerified', models.BooleanField(default=False)),
                ('verificationCode', models.CharField(blank=True, max_length=6, null=True)),
                ('grade', models.CharField(blank=True, max_length=10)),
                ('description', models.TextField(blank=True, default='')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Education',
                'verbose_name_plural': 'Education',
            },
        ),
        migrations.AddField(
            model_name='companyprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails'),
        ),
        migrations.CreateModel(
            name='Certifications',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certificateName', models.CharField(max_length=50)),
                ('issuerOrg', models.CharField(max_length=50)),
                ('credentialUrl', models.URLField(max_length=255)),
                ('credentialId', models.CharField(blank=True, max_length=255, null=True)),
                ('isValid', models.BooleanField(default=False)),
                ('startMonth', models.CharField(max_length=20)),
                ('startYear', models.CharField(max_length=4)),
                ('endMonth', models.CharField(blank=True, max_length=20, null=True)),
                ('endYear', models.CharField(blank=True, max_length=4, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.userdetails')),
            ],
            options={
                'verbose_name': 'Certificate',
                'verbose_name_plural': 'Certificates',
            },
        ),
    ]
