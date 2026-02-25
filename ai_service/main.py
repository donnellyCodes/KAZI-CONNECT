# currently scores a score (0.0 to 1.0) based on the criteria

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import difflib
import math

app = FastAPI()

# words that don't count as skills are ignored
STOP_WORDS = {"need", "looking", "urgent", "help", "please", "worker", "job", "required", "nairobi", "kenya", "professional"}

class Entity(BaseModel):
    id: str
    skills: List[str]
    location: str
    availability: bool = True
    rating: float = 0.0
    jobs_completed: int = 0

class MatchRequest(BaseModel):
    job: Entity
    workers: List[Entity]
    
def clean_keywords(text_list):
    """Removes common noise words from the keyword list."""    
    return [word.lower() for word in text_list if word.lower() not in STOP_WORDS and len(word) > 2]

def get_skill_score(job_skills, worker_skills):
    if not job_skills or not worker_skills: return 0.0
    
    matches = 0
    clean_job = [j for j in job_skills if len(j) > 2]
    clean_worker = [w for w in worker_skills if len(w) > 2]
    
    for js in clean_job:
        # a stricter cutoff to ensure that "Electrician" matches "Electrical" but "plumber" does not match "Painter"
        match = difflib.get_close_matches(js, clean_worker, n=1, cutoff=0.85)
        if match:
            matches += 1
            print(f"DEBUG: Match found! Job Keyword '{js}' matched worker skill '{match[0]}'")
    return matches / len(clean_job) if clean_job else 0.0

@app.post("/match")
async def calculate_matches(data: MatchRequest):
    results = []
    job_category = data.job.skills[0] if data.job.skills else ""

    for worker in data.workers:
        worker_skill = worker.skills[0] if worker.skills else ""
        skill_score = 1.0 if job_category.lower() == worker_skill.lower() else 0.0
        # if there is 0 skill match, we don't recommend this worker at all
        if skill_score == 0:
            if worker_skill.lower() in " ".join(data.job.skills).lower():
                skill_score = 0.5
        
        location_score = 1.0 if job.location.lower() == worker.location.lower() else 0.0
        trust_score = worker.rating / 5.0

        final_score = (skill_score * 0.7) + (location_score * 0.15) + (trust_score * 0.15)
        results.append({
            "workedId": worker.id,
            "matchScore": round(final_score * 100, 1), # converts to percentage
            "breakdown": {
                "skills": round(skill_score * 100, 1),
                "location": round(location_score * 100, 1)
            }
        })
    # sort score in descending order
    results.sort(key=lambda x: x['matchScore'], reverse=True)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

