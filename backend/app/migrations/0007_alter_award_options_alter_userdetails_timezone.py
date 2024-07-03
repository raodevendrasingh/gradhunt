# Generated by Django 5.0.4 on 2024-07-02 15:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_userdetails_created_at'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='award',
            options={'verbose_name': 'Awards', 'verbose_name_plural': 'Awards'},
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='timezone',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
