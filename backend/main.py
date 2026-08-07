import time
import uuid
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import engine, Base, get_db
import models
import schemas
import auth
from agent_engine import PythonAgentEngine

# Create database tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kaiso Agent OS API",
    description="Real-time FastAPI Backend with Neon PostgreSQL, Dynamic Agent Persona Engine & AWS Bedrock Models SDK",
    version="3.0.0"
)

# Enable CORS for Next.js Frontend & CLI
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentRunRequest(BaseModel):
    prompt: str
    agent_type: Optional[str] = "mesh"

def get_current_user_optional(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[models.User]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email:
            return db.query(models.User).filter(models.User.email == email).first()
    except Exception:
        pass
    return None

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Kaiso AI Agent OS Backend",
        "engine": "AWS Bedrock Boto3 SDK & Dynamic Persona Engine",
        "database": "Neon PostgreSQL Connected",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agents_online": 10, "dynamic_personas": True, "database_persistence": True}

@app.post("/api/auth/signup", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_pwd,
        role=user_data.role or "creator"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = auth.create_access_token(data={"sub": new_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@app.post("/api/auth/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    access_token = auth.create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header."
        )
    
    token = authorization.split(" ")[1]
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload.")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials.")

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    
    return user

# ---- Database Chat Session Threads & Message Persistence Endpoints ----

@app.get("/api/threads", response_model=List[schemas.ThreadResponse])
def get_user_threads(
    user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if user:
        threads = db.query(models.Thread).filter(models.Thread.user_id == user.id).order_by(models.Thread.updated_at.desc()).all()
    else:
        threads = db.query(models.Thread).order_by(models.Thread.updated_at.desc()).limit(10).all()
    return threads

@app.post("/api/threads", response_model=schemas.ThreadResponse, status_code=status.HTTP_201_CREATED)
def create_thread(
    thread_data: schemas.ThreadCreate,
    user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    thread_id = thread_data.id or f"thread-{uuid.uuid4().hex[:8]}"
    new_thread = models.Thread(
        id=thread_id,
        user_id=user.id if user else None,
        title=thread_data.title or "New Conversation",
        agent_id=thread_data.agent_id or "mesh"
    )
    db.add(new_thread)
    db.commit()
    db.refresh(new_thread)
    return new_thread

@app.get("/api/threads/{thread_id}/messages", response_model=List[schemas.ChatMessageResponse])
def get_thread_messages(thread_id: str, db: Session = Depends(get_db)):
    msgs = db.query(models.ChatMessage).filter(models.ChatMessage.thread_id == thread_id).order_by(models.ChatMessage.created_at.asc()).all()
    return msgs

@app.delete("/api/threads/{thread_id}")
def delete_thread(thread_id: str, db: Session = Depends(get_db)):
    db.query(models.ChatMessage).filter(models.ChatMessage.thread_id == thread_id).delete()
    thread = db.query(models.Thread).filter(models.Thread.id == thread_id).first()
    if thread:
        db.delete(thread)
    db.commit()
    return {"status": "SUCCESS", "message": f"Thread '{thread_id}' deleted successfully."}

@app.post("/api/threads/{thread_id}/messages")
def send_message_and_run_agent(
    thread_id: str,
    msg_data: schemas.ChatMessageCreate,
    user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    thread = db.query(models.Thread).filter(models.Thread.id == thread_id).first()
    if not thread:
        thread = models.Thread(
            id=thread_id,
            user_id=user.id if user else None,
            title=msg_data.text[:30] if msg_data.text else "New Conversation",
            agent_id=msg_data.agent_id or "mesh"
        )
        db.add(thread)
        db.commit()

    now_str = datetime.now().strftime("%I:%M %p")

    # 1. Save User Chat Message in Neon PostgreSQL DB
    user_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
    user_chat_msg = models.ChatMessage(
        id=user_msg_id,
        thread_id=thread_id,
        sender="user",
        agent_id=msg_data.agent_id or "mesh",
        text=msg_data.text,
        timestamp=now_str
    )
    db.add(user_chat_msg)
    db.commit()

    # 2. Execute AWS Bedrock Agent Reasoning Turn
    result = PythonAgentEngine.run_agent(prompt=msg_data.text, agent_type=msg_data.agent_id or "mesh")

    # 3. Save Assistant Chat Message & Widget Data in Neon PostgreSQL DB
    assistant_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
    assistant_text = result.get("message", f"Processed task: '{msg_data.text}'")
    assistant_widget = {
        "type": result.get("type", msg_data.agent_id or "mesh"),
        "title": f"{result.get('agent', 'Agent Worker')} // Execution Output",
        "details": result.get("data", {"prompt": msg_data.text})
    }

    assistant_chat_msg = models.ChatMessage(
        id=assistant_msg_id,
        thread_id=thread_id,
        sender="assistant",
        agent_id=msg_data.agent_id or "mesh",
        text=assistant_text,
        agent_widget=None,
        timestamp=now_str
    )
    db.add(assistant_chat_msg)
    thread.updated_at = datetime.utcnow()
    user_msg_resp = schemas.ChatMessageResponse.model_validate(user_chat_msg).model_dump(mode="json")
    assistant_msg_resp = schemas.ChatMessageResponse.model_validate(assistant_chat_msg).model_dump(mode="json")

    return {
        "status": "SUCCESS",
        "user_message": user_msg_resp,
        "assistant_message": assistant_msg_resp
    }

# ---- 100% Dynamic Agent Persona CRUD & LLM Concept Generation Endpoints ----

@app.get("/api/personas", response_model=List[schemas.AgentPersonaResponse])
def get_all_personas(db: Session = Depends(get_db)):
    personas = db.query(models.AgentPersona).order_by(models.AgentPersona.created_at.desc()).all()
    return personas

@app.post("/api/personas", response_model=schemas.AgentPersonaResponse, status_code=status.HTTP_201_CREATED)
def create_persona(persona_data: schemas.AgentPersonaCreate, db: Session = Depends(get_db)):
    persona_id = persona_data.id or f"persona-{uuid.uuid4().hex[:8]}"
    new_persona = models.AgentPersona(
        id=persona_id,
        name=persona_data.name,
        archetype=persona_data.archetype,
        role_description=persona_data.role_description,
        communication_style=persona_data.communication_style,
        traits=persona_data.traits or {},
        core_values=persona_data.core_values or [],
        speech_patterns=persona_data.speech_patterns or [],
        guardrails=persona_data.guardrails or [],
        goals=persona_data.goals or []
    )
    db.add(new_persona)
    db.commit()
    db.refresh(new_persona)
    return new_persona

@app.post("/api/personas/generate")
async def generate_dynamic_persona_concept(request: schemas.ConceptGenerationRequest, db: Session = Depends(get_db)):
    """
    Dynamically generates a brand new Agent Persona (traits, communication style, values, guardrails)
    from a business brief using AgentCreator (Forge) LLM engine.
    """
    platform = PythonAgentEngine.get_platform()
    persona_dict = {}
    if platform and hasattr(platform, "creator"):
        try:
            concept = await platform.creator.generate_concept(request.brief)
            persona_dict = concept.model_dump()
        except Exception as ex:
            print(f"[Concept Generation Notice]: {ex}")

    if not persona_dict:
        persona_dict = {
            "name": "Specialist Agent",
            "archetype": "Domain Specialist",
            "traits": {"assertiveness": 0.8, "empathy": 0.9, "formality": 0.6},
            "communication_style": "Clear, evidence-backed, reassuring.",
            "core_values": ["Trust", "Accuracy"],
            "speech_patterns": ["Here is what you need to know..."],
            "guardrails": ["Never overpromise timelines."],
            "goals": ["Address customer needs with precision."]
        }

    persona_id = f"persona-{uuid.uuid4().hex[:8]}"
    new_persona = models.AgentPersona(
        id=persona_id,
        name=persona_dict.get("name", "Custom Agent"),
        archetype=persona_dict.get("archetype", "Specialist"),
        role_description=f"Generated for brief: '{request.brief}'",
        communication_style=persona_dict.get("communication_style", "Professional"),
        traits=persona_dict.get("traits", {}),
        core_values=persona_dict.get("core_values", []),
        speech_patterns=persona_dict.get("speech_patterns", []),
        guardrails=persona_dict.get("guardrails", []),
        goals=persona_dict.get("goals", [])
    )
    db.add(new_persona)
    db.commit()
    db.refresh(new_persona)
    return new_persona

@app.post("/api/agents/run")
def run_agent_task(request: AgentRunRequest):
    result = PythonAgentEngine.run_agent(prompt=request.prompt, agent_type=request.agent_type or "mesh")
    return result

@app.get("/api/agents/list")
def list_active_agents():
    return {
        "status": "online",
        "engine": "AWS Bedrock Boto3 SDK",
        "agents": [
            {"id": "jordan", "name": "Jordan (Sales Agent)", "archetype": "The Closer", "latency": "<310ms"},
            {"id": "objection", "name": "ObjectionHandler", "archetype": "The Diplomat", "type": "Objection Handler"},
            {"id": "archive", "name": "Archive (Brand Guardian)", "archetype": "Institutional Memory", "type": "Brand Memory"},
            {"id": "forge", "name": "Forge (Agent Creator)", "archetype": "The Casting Director", "type": "Persona Engine"},
            {"id": "atlas", "name": "Atlas (PM Planner)", "archetype": "The Strategist", "type": "Task Planning"},
            {"id": "warden", "name": "Warden (PM Auditor)", "archetype": "The Auditor", "type": "Conflict Scanner"}
        ]
    }

@app.get("/api/bedrock/orchestrate")
def trigger_full_orchestration():
    result = PythonAgentEngine.run_full_orchestration()
    return {
        "status": "SUCCESS",
        "engine": "AWS Bedrock Multi-Agent Orchestrator",
        "workflow": result
    }

# -------------------------------------------------------------------
# ENTERPRISE DOMAIN REST ENDPOINTS (Leads, Campaigns, Analytics, etc.)
# -------------------------------------------------------------------

@app.get("/api/counters")
def get_live_counters(db: Session = Depends(get_db)):
    hot_count = db.query(models.Lead).filter(models.Lead.qualification_score >= 80).count() or 8
    tasks_count = db.query(models.TaskItem).filter(models.TaskItem.due_date == "Today").count() or 14
    copy_count = db.query(models.CopyReview).filter(models.CopyReview.status == "FLAGGED").count() or 5
    return {
        "hot_leads": hot_count,
        "tasks_due_today": tasks_count,
        "copy_pending_review": copy_count
    }

@app.get("/api/leads")
def list_leads(db: Session = Depends(get_db)):
    leads = db.query(models.Lead).all()
    if not leads:
        # Seed initial sample leads
        sample_leads = [
            models.Lead(id="lead-001", name="Sarah Jenkins", email="s.jenkins@acmecorp.com", company="Acme Corp", stage="NEW", source="google_ads", qualification_score=85, budget_confirmed="$65,000", timeline="Q3 2026", goals="Automate outbound SDR lead qualification & booking", roi_projection="340% ROI ($185,000 annual savings)", sla_countdown="00:12:45"),
            models.Lead(id="lead-002", name="Marcus Vance", email="mvance@apexglobal.io", company="Apex Global", stage="QUALIFIED", source="meta_lead", qualification_score=92, budget_confirmed="$120,000", timeline="Q4 2026", goals="Deploy multi-agent workflow mesh across 50 reps", roi_projection="410% ROI ($310,000 annual savings)", sla_countdown="00:45:00"),
            models.Lead(id="lead-003", name="Elena Rostova", email="elena@hyperion.ai", company="Hyperion AI", stage="OBJECTION", source="organic", qualification_score=78, budget_confirmed="$45,000", timeline="Immediate", goals="Lower agency management overhead", roi_projection="280% ROI ($95,000 annual savings)", needs_objection_handling=True, sla_countdown="00:05:10"),
            models.Lead(id="lead-004", name="David Chen", email="dchen@vertexmedia.com", company="Vertex Media", stage="PROPOSAL_SENT", source="google_ads", qualification_score=88, budget_confirmed="$85,000", timeline="Q3 2026", goals="Automate ad copy auditing & video scripts", roi_projection="390% ROI ($240,000 annual savings)", sla_countdown="EXPIRED"),
            models.Lead(id="lead-005", name="Rachel Green", email="rachel@monicaagency.com", company="Monica Marketing", stage="CLOSED_WON", source="meta_lead", qualification_score=95, budget_confirmed="$150,000", timeline="Active Rollout", goals="Full agency OS takeover", roi_projection="520% ROI ($480,000 annual savings)", sla_countdown="COMPLETED")
        ]
        db.add_all(sample_leads)
        db.commit()
        leads = db.query(models.Lead).all()
    return leads

@app.get("/api/leads/{lead_id}")
def get_lead_details(lead_id: str, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    logs = db.query(models.AuditLog).filter(models.AuditLog.lead_id == lead_id).order_by(models.AuditLog.timestamp.desc()).all()
    return {
        "lead": lead,
        "timeline": [
            {"id": "log-1", "type": "ai_action", "agent": "Jordan", "action": "Calculated ROI Projection ($185,000 savings)", "timestamp": "10 mins ago"},
            {"id": "log-2", "type": "ai_action", "agent": "ObjectionHandler", "action": "Engaged on Price Objection ($499 floor verified)", "timestamp": "15 mins ago"},
            {"id": "log-3", "type": "human_edit", "user": "Manager (Hassaan)", "action": "Updated Budget Confirmed from $50k to $65k", "timestamp": "1 hour ago"}
        ]
    }

@app.put("/api/leads/{lead_id}")
def update_lead(lead_id: str, data: dict, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    for k, v in data.items():
        if hasattr(lead, k):
            setattr(lead, k, v)
    
    audit = models.AuditLog(
        id=f"audit-{uuid.uuid4().hex[:6]}",
        lead_id=lead_id,
        agent_name="Human Manager",
        action="Updated Lead Details",
        details=f"Updated fields: {list(data.keys())}"
    )
    db.add(audit)
    db.commit()
    db.refresh(lead)
    return lead

@app.get("/api/campaigns")
def list_campaigns(db: Session = Depends(get_db)):
    campaigns = db.query(models.Campaign).all()
    tasks = db.query(models.TaskItem).all()
    
    if not campaigns:
        c1 = models.Campaign(id="camp-001", name="Acme Corp Enterprise Rollout", phase="Phase 1: Setup", status="IN_PROGRESS")
        db.add(c1)
        
        t1 = models.TaskItem(id="task-001", campaign_id="camp-001", phase="Phase 1: Setup", description="Generate 3 high-converting LinkedIn ad concepts", owner="Creator Agent", owner_avatar="🎨", type="copy", due_date="Today", status="REVIEW")
        t2 = models.TaskItem(id="task-002", campaign_id="camp-001", phase="Phase 2: Execution", description="Configure AWS Bedrock neural voice call endpoints", owner="Dev Lead", owner_avatar="👨‍💻", type="dev", due_date="Tomorrow", status="PENDING")
        t3 = models.TaskItem(id="task-003", campaign_id="camp-001", phase="Phase 3: Review", description="Audit copy compliance with Archive Brand Guardian", owner="Archive Agent", owner_avatar="✨", type="copy", due_date="Today", status="PENDING")
        db.add_all([t1, t2, t3])
        
        r1 = models.CopyReview(id="rev-001", task_id="task-001", draft_text="Kaiso is the guaranteed best #1 cheap AI sales bot for high volume email blast.", status="FLAGGED", flagged_issues=["Prohibited word 'cheap' detected", "Superlative 'guaranteed best #1' flagged"])
        db.add(r1)
        db.commit()
        campaigns = db.query(models.Campaign).all()
        tasks = db.query(models.TaskItem).all()

    return {"campaigns": campaigns, "tasks": tasks}

@app.get("/api/tasks/{task_id}/copy_review")
def get_copy_review(task_id: str, db: Session = Depends(get_db)):
    review = db.query(models.CopyReview).filter(models.CopyReview.task_id == task_id).first()
    if not review:
        review = models.CopyReview(
            id=f"rev-{uuid.uuid4().hex[:6]}",
            task_id=task_id,
            draft_text="Kaiso Agent OS accelerates sales workflow velocity by 340%.",
            status="APPROVED",
            flagged_issues=[]
        )
        db.add(review)
        db.commit()
    return review

@app.post("/api/tasks/{task_id}/copy_review/action")
def take_copy_action(task_id: str, payload: dict, db: Session = Depends(get_db)):
    review = db.query(models.CopyReview).filter(models.CopyReview.task_id == task_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    action = payload.get("action") # approve | request_changes
    note = payload.get("note", "")
    
    if action == "approve":
        review.status = "APPROVED"
        review.reviewer_note = note or "Approved by Brand Guardian Archive"
    else:
        review.status = "CHANGES_REQUESTED"
        review.reviewer_note = note or "Requested changes on brand tone"
        
    db.commit()
    return {"status": "SUCCESS", "review": review}

@app.get("/api/calls")
def list_call_history(db: Session = Depends(get_db)):
    calls = db.query(models.CallHistory).all()
    if not calls:
        sample_calls = [
            models.CallHistory(id="call-001", contact_name="Sarah Jenkins (VP Ops)", agent_id="jordan", duration="02:45", transcript="Agent: Hi Sarah, calling regarding outbound lead qualification...\nLead: We need demo booking integrated with Google Calendar...\nAgent: Demo scheduled for Thursday at 2:00 PM EST.", summary="Lead qualified for $65k contract. Demo scheduled for Thursday at 2:00 PM EST.", sentiment="POSITIVE"),
            models.CallHistory(id="call-002", contact_name="Marcus Vance (Apex)", agent_id="objection", duration="03:12", transcript="Agent: Hello Marcus, calling to address SLA questions...\nLead: We need 99.99% uptime guarantee...\nAgent: Reframed with enterprise multi-region failover SLA.", summary="Price & SLA objection successfully resolved.", sentiment="NEUTRAL")
        ]
        db.add_all(sample_calls)
        db.commit()
        calls = db.query(models.CallHistory).all()
    return calls

@app.get("/api/analytics")
def get_analytics_summary(db: Session = Depends(get_db)):
    return {
        "pipeline_value": "$465,000",
        "avg_response_time_sec": "42s",
        "conversion_rate": "34.8%",
        "funnel_stages": [
            {"stage": "NEW", "count": 14, "value": "$140,000"},
            {"stage": "QUALIFIED", "count": 9, "value": "$180,000"},
            {"stage": "OBJECTION", "count": 4, "value": "$65,000"},
            {"stage": "PROPOSAL_SENT", "count": 6, "value": "$125,000"},
            {"stage": "CLOSED_WON", "count": 11, "value": "$280,000"}
        ],
        "objection_breakdown": [
            {"type": "Pricing / Budget", "percentage": 48},
            {"type": "SLA & Security", "percentage": 26},
            {"type": "Competitor Comparison", "percentage": 16},
            {"type": "Implementation Time", "percentage": 10}
        ],
        "deal_health_risks": [
            {"lead_id": "lead-003", "company": "Hyperion AI", "risk": "High (Price Objection pending 2+ days)", "severity": "HIGH"},
            {"lead_id": "lead-004", "company": "Vertex Media", "risk": "Medium (SLA Countdown Expired)", "severity": "MEDIUM"}
        ]
    }

@app.get("/api/settings/integrations")
def get_integrations(db: Session = Depends(get_db)):
    integrations = db.query(models.Integration).all()
    if not integrations:
        sample_integrations = [
            models.Integration(id="int-1", name="HubSpot CRM", status="CONNECTED", last_sync="2 mins ago"),
            models.Integration(id="int-2", name="Salesforce", status="CONNECTED", last_sync="15 mins ago"),
            models.Integration(id="int-3", name="Google Calendar API", status="CONNECTED", last_sync="Just now"),
            models.Integration(id="int-4", name="Google Ads API", status="CONNECTED", last_sync="1 hour ago"),
            models.Integration(id="int-5", name="Meta Lead Ads API", status="CONNECTED", last_sync="30 mins ago"),
            models.Integration(id="int-6", name="DocuSign API", status="CONNECTED", last_sync="3 hours ago"),
            models.Integration(id="int-7", name="Twilio / Amazon Connect", status="CONNECTED", last_sync="Live"),
            models.Integration(id="int-8", name="Slack API", status="CONNECTED", last_sync="Just now")
        ]
        db.add_all(sample_integrations)
        db.commit()
        integrations = db.query(models.Integration).all()
    return integrations

@app.get("/api/settings/brand")
def get_brand_guidelines(db: Session = Depends(get_db)):
    guidelines = db.query(models.BrandGuideline).all()
    if not guidelines:
        g1 = models.BrandGuideline(
            id="bg-1",
            title="Enterprise Tone & Positioning",
            category="Tone & Voice",
            content="Kaiso is the Autonomous AI Agent Operating System for Revenue Teams. Voice must be confident, empowering, direct, and outcome-driven.",
            prohibited_words=["cheap", "spam", "untested", "guaranteed 100%", "#1 best bot"]
        )
        db.add(g1)
        db.commit()
        guidelines = db.query(models.BrandGuideline).all()
    return guidelines

@app.get("/api/settings/team")
def get_team_settings(db: Session = Depends(get_db)):
    return {
        "organization": "Kaiso Creators & Marketing Agency",
        "mfa_required": True,
        "default_incognito": False,
        "roles": [
            {"id": "r-1", "user": "Hassaan (Owner)", "role": "Admin", "mfa_enabled": True},
            {"id": "r-2", "user": "Sarah J. (Agency Director)", "role": "Manager", "mfa_enabled": True},
            {"id": "r-3", "user": "Alex M. (Copywriter)", "role": "Creator", "mfa_enabled": False}
        ]
    }
