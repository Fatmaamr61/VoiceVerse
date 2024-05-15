from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render


# def index(request):
#     return render(request, 'index.html')
#
#
# def trigger_error(request):
#     division_by_zero = 1 / 0


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', index, name='index'),
    path('api/auth/', include('authentication.urls')),
    path('api/v1/dubbing/', include('SoundCloneGenerator.urls')),
    # path('sentry-debug/', trigger_error)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    try:
        import debug_toolbar

        urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
    except ImportError:
        pass

admin.site.site_header = "Site Header"
admin.site.site_title = "Site Admin Portal"
admin.site.index_title = "Welcome to Site Portal"
