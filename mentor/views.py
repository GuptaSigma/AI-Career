from django.shortcuts import render


def dashboard_view(request):
    return render(request, 'mentor/dashbord.html')


def roadmap_view(request):
    return render(request, 'mentor/roadmap.html')
