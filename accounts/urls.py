from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('api/generate-roadmap/', views.create_roadmap_api, name='generate_roadmap_api'),
    path('register/', views.register_view, name='register')
]