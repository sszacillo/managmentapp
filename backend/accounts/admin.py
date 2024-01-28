from django.contrib import admin
from .models import User
import pprint
from django.contrib.sessions.models import Session


class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return pprint.pformat(obj.get_decoded()).replace('\n', '<br>\n')
    _session_data.allow_tags = True
    list_display = ['session_key', '_session_data', 'expire_date']
    readonly_fields = ['_session_data']
    exclude = ['session_data']
    date_hierarchy = 'expire_date'


admin.site.register(Session, SessionAdmin)


class UserAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if 'is_active' in form.changed_data:
            if obj.is_active == 'A':
                obj.login_attempts = 0
        super().save_model(request, obj, form, change)


admin.site.register(User, UserAdmin)
