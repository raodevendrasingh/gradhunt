# Generated by Django 5.0.4 on 2024-08-08 06:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0023_certificate'),
    ]

    operations = [
        migrations.RenameField(
            model_name='certificate',
            old_name='isExpirable',
            new_name='isValid',
        ),
    ]
