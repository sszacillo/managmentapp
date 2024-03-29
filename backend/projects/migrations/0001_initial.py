# Generated by Django 5.0 on 2023-12-17 22:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('project_name', models.CharField(max_length=200)),
                ('project_description', models.TextField()),
                ('project_start_date', models.DateField()),
                ('project_end_date', models.DateField()),
                ('project_users', models.ManyToManyField(related_name='project_users', to=settings.AUTH_USER_MODEL)),
                ('user_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('task_name', models.CharField(max_length=200)),
                ('task_description', models.TextField()),
                ('task_status', models.CharField(choices=[('Do zrobienia', 'do zrobienia'), ('W trakcie', 'w trakcie'), ('Wykonane', 'wykonane')], default='Do zrobienia', max_length=200)),
                ('task_start_date', models.DateField()),
                ('task_end_date', models.DateField()),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_task', to='projects.project')),
            ],
        ),
    ]
