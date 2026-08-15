import json
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from accounts.ai_services import generate_roadmap
from accounts.db import roadmaps_collection

def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        remember = request.POST.get('remember')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            if not remember:
                request.session.set_expiry(0)
            return redirect('dashboard')

        messages.error(request, 'Invalid username or password.')
        return render(request, 'accounts/login.html', {'username': username})

    return render(request, 'accounts/login.html')
def logout_view(request):
    logout(request)
    return redirect('login')
def register_view(request):
    return render(request, 'accounts/register.html')

@login_required(login_url='login')
def profile_view(request):
    if request.method == 'POST':
        request.user.first_name =request.POST.get('first_name','')
        request.user.last_name=request.POST.get
        ('last_name', '')
        request.user.email=request.POST.get('email', '')
        request.user.save()
        messages.success(request, 'Profile updated successfully.')
        return render(request, 'accounts/profile.html')
    return render(request, 'accounts/profile.html')
@csrf_exempt
def create_roadmap_api(request):
    if request.method == 'POST':


        try:

            data= json.loads(request.body)
            skills=data.get('skills')
            role=data.get('role')
            if not skills or not role:
                return JsonResponse({'error': 'Skills and role are required.'},status=400)
            print(f"Generating roadmap for skills: {skills} and role: {role}")

            roadmap_data=generate_roadmap(skills,role)

            roadmap_doc={
                'user_skills':skills,
                'target_role':role,
                'generated_roadmap': roadmap_data,
            }

            if roadmaps_collection is not None:
                 roadmaps_collection.insert_one(roadmap_doc)
                 return JsonResponse({'messages': 'Roadmap generated successfully',
                                      'data': roadmap_data},status=201)
                
        except Exception as e:
                return JsonResponse({'error' : str(e)}, status=500)
    return  JsonResponse({'error' : 'Invalid request method '}, status=405)
                     
            
