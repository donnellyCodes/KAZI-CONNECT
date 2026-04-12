# currently scores a score (0.0 to 1.0) based on the criteria

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import re
from functools import lru_cache

app = FastAPI()

# words that don't count as skills are ignored
STOP_WORDS = {
    "need", "looking", "urgent", "help", "please", "worker", "job", "required",
    "nairobi", "kenya", "professional", "experienced", "experience", "wanted",
    "hiring", "work", "works", "working", "role", "person", "someone", "able",
    "must", "with", "and", "the", "for", "from", "into", "our", "your", "you",
    "their", "this", "that", "these", "those", "full", "time", "part", "daily",
    "weekly", "month", "months", "years", "year", "service", "services"
}

# Skill synonym mapping for better matching
SKILL_SYNONYMS = {
    "electrician": ["electrician", "electrical technician", "wireman"],
    "plumber": ["plumber", "pipefitter", "pipe installer", "pipe worker"],
    "carpenter": ["carpenter", "woodworker", "joiner", "woodworking"],
    "painter": ["painter", "decorator", "wall painter", "painting", "paint worker"],
    "cleaner": ["cleaner", "housekeeper", "janitor", "cleaning assistant"],
    "gardener": ["gardener", "landscaper", "groundskeeper", "garden assistant"],
    "driver": ["driver", "chauffeur", "transport driver", "driver assistant"],
    "mechanic": ["mechanic", "auto mechanic", "vehicle mechanic"],
    "welder": ["welder", "welding technician", "metal welder"],
    "builder": ["builder", "construction worker", "builder apprentice"],
    "roofer": ["roofer", "roofing specialist", "roof repair technician"],
    "inspector": ["inspector", "quality inspector", "quality control inspector"],
    "technician": ["technician", "technical assistant", "tech support"],
    "assistant": ["assistant", "support assistant", "office assistant"],
    "manager": ["manager", "supervisor", "team leader"],
    "accountant": ["accountant", "finance officer", "bookkeeper"],
    "cashier": ["cashier", "till operator", "sales assistant"],
    "waiter": ["waiter", "waitress", "server", "restaurant server"],
    "cook": ["cook", "chef", "kitchen assistant"],
    "security": ["security", "security guard", "security officer"],
    "receptionist": ["receptionist", "front desk", "front office"],
    "nurse": ["nurse", "nursing assistant", "care worker"],
    "teacher": ["teacher", "instructor", "educator"],
    "driver": ["driver", "driver assistant", "transport driver"],
    "cleaner": ["cleaner", "cleaning assistant", "housekeeping"],
    "gardener": ["gardener", "garden assistant", "groundskeeper"],
    "plumber": ["plumber", "pipe fitter", "pipe installer"],
    "electrician": ["electrician", "electrician apprentice", "electrical technician"],
    "carpenter": ["carpenter", "woodworker", "joiner"],
    "painter": ["painter", "decorator", "wall painter"],
    "mechanic": ["mechanic", "auto mechanic", "vehicle mechanic"],
    "welder": ["welder", "welding technician", "metal welder"],
    "builder": ["builder", "construction worker", "builder apprentice"],
    "roofer": ["roofer", "roofing specialist", "roof repair technician"],
    "inspector": ["inspector", "quality inspector", "quality control inspector"],
    "technician": ["technician", "technical assistant", "tech support"],
    "assistant": ["assistant", "support assistant", "office assistant"],
    "manager": ["manager", "supervisor", "team leader"],
    "accountant": ["accountant", "finance officer", "bookkeeper"],
    "cashier": ["cashier", "till operator", "sales assistant"],
    "waiter": ["waiter", "waitress", "server", "restaurant server"],
    "cook": ["cook", "chef", "kitchen assistant"],
    "security": ["security", "security guard", "security officer"],
    "receptionist": ["receptionist", "front desk", "front office"],
    "nurse": ["nurse", "nursing assistant", "care worker"],
    "teacher": ["teacher", "instructor", "educator"],
}

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
    
def tokenize_text(text):
    return re.findall(r"[a-z0-9]+", (text or "").lower())

def clean_keywords(text_list):
    """Removes common noise words from the keyword list."""
    return [word.lower() for word in text_list if word.lower() not in STOP_WORDS and len(word) > 2]

def get_experience_bonus(jobs_completed):
    """Caps experience contribution so it helps without dominating the score."""
    if not jobs_completed or jobs_completed <= 0:
        return 0.0
    return min(jobs_completed / 20.0, 1.0)

def normalize_skill(skill):
    """Normalizes skill using synonym mapping."""
    skill = skill.lower().strip()
    for main_skill, synonyms in SKILL_SYNONYMS.items():
        if skill in [main_skill] + synonyms:
            return main_skill
    return skill

def extract_skills_from_text(text):
    """Find canonical skills mentioned inside free-form text."""
    normalized_text = " ".join(tokenize_text(text))
    found_skills = set()

    for main_skill, synonyms in SKILL_SYNONYMS.items():
        possible_terms = [main_skill] + synonyms
        for term in possible_terms:
            normalized_term = " ".join(tokenize_text(term))
            if normalized_term and normalized_term in normalized_text:
                found_skills.add(main_skill)
                break

    return found_skills

def build_worker_profile(worker_skills):
    normalized_worker_skills = {
        normalize_skill(skill) for skill in worker_skills if isinstance(skill, str) and skill.strip()
    }
    worker_keywords = set()

    for skill in worker_skills:
        if not isinstance(skill, str):
            continue
        worker_keywords.update(clean_keywords(tokenize_text(skill)))
        worker_keywords.update(extract_skills_from_text(skill))

    worker_keywords.update(normalized_worker_skills)
    return normalized_worker_skills, worker_keywords

def build_job_profile(job_skills):
    explicit_skills = set()
    contextual_keywords = set()

    for item in job_skills:
        if not isinstance(item, str) or not item.strip():
            continue

        normalized_item = normalize_skill(item)
        if normalized_item != item.lower().strip():
            explicit_skills.add(normalized_item)

        extracted_skills = extract_skills_from_text(item)
        explicit_skills.update(extracted_skills)
        contextual_keywords.update(clean_keywords(tokenize_text(item)))
        contextual_keywords.update(extracted_skills)

    contextual_keywords.update(explicit_skills)
    return explicit_skills, contextual_keywords

@lru_cache(maxsize=1000)
def cached_skill_match(job_skills_tuple, worker_skills_tuple):
    """Cached skill matching for performance."""
    job_skills = list(job_skills_tuple)
    worker_skills = list(worker_skills_tuple)
    return calculate_skill_score(job_skills, worker_skills)

def calculate_skill_score(job_skills, worker_skills):
    """Weighted skill scoring using explicit skills and contextual keyword overlap."""
    if not job_skills or not worker_skills:
        return 0.0

    job_required_skills, job_keywords = build_job_profile(job_skills)
    worker_normalized_skills, worker_keywords = build_worker_profile(worker_skills)

    exact_skill_score = 0.0
    if job_required_skills:
        exact_matches = len(job_required_skills & worker_normalized_skills)
        exact_skill_score = exact_matches / len(job_required_skills)

    keyword_overlap_score = 0.0
    if job_keywords:
        keyword_matches = len(job_keywords & worker_keywords)
        keyword_overlap_score = keyword_matches / len(job_keywords)

    if exact_skill_score == 0 and keyword_overlap_score == 0:
        return 0.0

    if job_required_skills:
        return min(exact_skill_score * 0.8 + keyword_overlap_score * 0.2, 1.0)

    return min(keyword_overlap_score, 1.0)

def get_location_score(job_location, worker_location):
    """Enhanced location scoring with partial matching."""
    job_loc = job_location.lower().strip()
    worker_loc = worker_location.lower().strip()

    # exact match
    if job_loc == worker_loc:
        return 1.0

    # partial match (contains some area)
    if job_loc in worker_loc or worker_loc in job_loc:
        return 0.7

    # same city/region
    job_words = set(job_loc.split())
    worker_words = set(worker_loc.split())
    common_words = job_words & worker_words

    if common_words:
        return 0.5

    return 0.0

def get_skill_score(job_skills, worker_skills):
    """Legacy function - using calculate_skill_score"""
    return calculate_skill_score(job_skills, worker_skills)

@app.post("/match")
async def calculate_matches(data: MatchRequest):
    results = []
    
    for worker in data.workers:
        skill_score = cached_skill_match(tuple(data.job.skills), tuple(worker.skills))

        # if no skill match, try partial matching as fallback
        if skill_score == 0:
            job_skills_text = " ".join(data.job.skills).lower()
            for worker_skill in worker.skills:
                if worker_skill.lower() in job_skills_text:
                    skill_score = 0.35
                    break
        # enhanced location scoring
        location_score = get_location_score(data.job.location, worker.location)

        # trust score based on rating
        trust_score = worker.rating / 5.0 if worker.rating > 0 else 0.0
        experience_bonus = get_experience_bonus(worker.jobs_completed)
        availability_score = 1.0 if worker.availability else 0.0

        # Strongly prioritize skill fit, then location and quality signals.
        final_score = (
            skill_score * 0.65 +
            location_score * 0.15 +
            trust_score * 0.10 +
            experience_bonus * 0.05 +
            availability_score * 0.05
        )

        results.append({
            "workerId": worker.id,
            "matchScore": round(final_score * 100, 1),
            "breakdown": {
                "skills": round(skill_score * 100, 1),
                "location": round(location_score * 100, 1),
                "trust": round(trust_score * 100, 1),
                "experience": round(experience_bonus * 100, 1),
                "availability": round(availability_score * 100, 1)
            }
        })
    # sort by score in descending order
    results.sort(key=lambda x: x['matchScore'], reverse=True)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

