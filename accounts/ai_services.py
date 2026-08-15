import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

model=genai.GenerativeModel('gemini-1.5-flash') if GEMINI_API_KEY else None

def generate_roadmap(current_skills,target_role):
    if model is None:
        return {
            "error": "GEMINI_API_KEY is not configured",
            "current_skills": current_skills,
            "target_role": target_role,
        }

    prompt=f"""
You are an expert AI Career Mentor.
A user has the following current skills:{current_skills}.
They want to become a:{target_role}.
Give a clear step-by-step roadmap.
"""
    response=model.generate_content(prompt)
    return response.text