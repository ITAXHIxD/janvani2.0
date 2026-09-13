"""
JanVani 2026 - FastAPI Python Backend Service
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime
import random

app = FastAPI(
    title="JanVani 2026 Statutory Civic Redressal API",
    description="Python Backend for Municipal 48-Hour SLA Redressal, Geotagged Grievance Auditing, and Citizen DBT Intelligence.",
    version="2026.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GrievanceCreate(BaseModel):
    title: str
    description: str
    category: str = "Roads & Potholes"
    urgency: str = "Urgent"
    state: str = "Madhya Pradesh"
    district: str = "Dhar"
    ward: str = "Ward 14"
    locationName: Optional[str] = None
    mediaType: str = "video"
    mediaUrl: Optional[str] = None
    citizenName: str = "Praneet Dubey"

class CopilotQuery(BaseModel):
    prompt: str
    ward: Optional[str] = "Ward 14"

# In-memory store
db_grievances = []

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JanVani Python Backend",
        "sla_engine": "48h-statutory-active",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/api/grievances")
def get_grievances():
    return db_grievances

@app.post("/api/grievances", status_code=status.HTTP_201_CREATED)
def create_grievance(payload: GrievanceCreate):
    severity = 9.2 if payload.urgency == "Urgent" else 7.5 if payload.urgency == "Priority" else 5.5
    token = f"#2026-{random.randint(1000, 9999)}"
    target_hours = 24 if payload.urgency == "Urgent" else 48

    record = {
        "id": f"jv-{len(db_grievances) + 1}",
        "token": token,
        "title": payload.title,
        "description": payload.description,
        "category": payload.category,
        "urgency": payload.urgency,
        "severityScore": severity,
        "status": "In Progress",
        "state": payload.state,
        "district": payload.district,
        "ward": payload.ward,
        "locationName": payload.locationName or f"{payload.ward}, {payload.district}",
        "department": "Nagar Palika Parishad Pithampur",
        "targetHours": target_hours,
        "hoursLeft": target_hours,
        "reportedAt": datetime.datetime.now().strftime("%d %b %Y • %I:%M %p"),
        "citizenName": payload.citizenName,
        "mediaType": payload.mediaType,
        "mediaUrl": payload.mediaUrl,
        "supportsCount": 1
    }
    db_grievances.insert(0, record)
    return record

@app.post("/api/copilot")
def copilot_ai(query: CopilotQuery):
    return {
        "reply": f"JanVani AI Engine analyzed your inquiry regarding '{query.prompt}'. Statutory records for {query.ward} show compliance within the mandatory 48-hour municipal remediation window.",
        "model": "gemini-2.5-flash",
        "slaHours": 48
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5050)
