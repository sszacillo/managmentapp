from django.contrib.auth import logout

class CheckUserBanMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and request.user.is_active == 'B':
            logout(request)
        response = self.get_response(request)
        return response

from django.utils.deprecation import MiddlewareMixin

class DisableCsrfCheck(MiddlewareMixin):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)
        response = self.get_response(request)
        return response