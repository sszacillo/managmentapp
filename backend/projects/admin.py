from django.contrib import admin
from .models import Project, Task

# Register your models here.

from django import forms


class TaskInlineFormset(forms.models.BaseInlineFormSet):
    def clean(self):
        super().clean()

        # Sprawdź, czy istnieje przynajmniej jedno zadanie
        tasks = [form.cleaned_data for form in self.forms if form.cleaned_data and not form.cleaned_data.get(
            'DELETE', False)]
        if not tasks:
            raise forms.ValidationError(
                'Projekt musi mieć przynajmniej jedno zadanie.')


class TaskInline(admin.StackedInline):
    model = Task
    extra = 1
    formset = TaskInlineFormset  # Ustawienie formset na naszą zdefiniowaną klasę


class ProjectAdmin(admin.ModelAdmin):
    inlines = [TaskInline]


admin.site.register(Project, ProjectAdmin)
admin.site.register(Task)
