# Generated by Django 5.1.3 on 2024-12-04 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_alter_task_description_alter_task_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]