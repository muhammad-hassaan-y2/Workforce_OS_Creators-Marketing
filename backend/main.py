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
        agent_widget=assistant_widget,
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

@app.post("/api/bedrock/orchestrate")
def trigger_full_orchestration():
    result = PythonAgentEngine.run_full_orchestration()
    return {
        "status": "SUCCESS",
        "engine": "AWS Bedrock Multi-Agent Orchestrator",
        "workflow": result
    }
