# Generated by Django 4.2.3 on 2024-04-03 08:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_rename_activity_fileactivity_folderactivity'),
    ]

    operations = [
        migrations.RenameField(
            model_name='folderactivity',
            old_name='file',
            new_name='folder',
        ),
    ]
