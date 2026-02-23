# currently scores a score (0.0 to 1.0) based on the criteria

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import difflib
import math

app = FastAPI()

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

def get_fuzzy_score(list1, list2):
    """calculates the number of skills that match"""
    if not list1: return 0
    matches = 0
    for s1 in list1:
        best_match = difflib.get_close_matches(s1.lower(), [s.lower() for s in list2], n=1, cutoff=0.8)
        if best_match:
            matches += 1
    return matches / len(list1)

@app.post("/match")
async def calculate_matches(data: MatchRequest):
    ranked_results = []
    job = data.job

    for worker in data.workers:
        skill_score = get_fuzzy_score(job.skills, worker.skills)

        location_score = 1.0 if job.location.lower() == worker.location.lower() else 0.0

        availability_score = 1.0 if worker.availability else 0.0

        rating_factor = worker.rating / 5.0
        experience_factor = min(worker.jobs_completed / 20, 1.0)
        trust_score = (rating_factor * 0.7) + (experience_factor * 0.3)

        final_score = (skill_score * 0.5) + (location_score * 0.2) + (availability_score * 0.1) + (trust_score * 0.2)
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
    return ranked_results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

