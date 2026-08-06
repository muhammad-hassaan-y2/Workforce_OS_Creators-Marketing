from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import engine, Base, get_db
import models
import schemas
import auth
from agent_engine import PythonAgentEngine

# Create database tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kaiso Agent OS API",
    description="Real-time FastAPI Backend with Neon PostgreSQL, AWS Bedrock Models SDK & Multi-Agent Personality Engine",
    version="2.5.0"
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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Kaiso AI Agent OS Backend",
        "engine": "AWS Bedrock Boto3 SDK & Multi-Agent Mesh",
        "database": "Neon PostgreSQL Connected",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agents_online": 6, "aws_bedrock_ready": True}

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

@app.post("/api/agents/run")
def run_agent_task(request: AgentRunRequest):
    """
    Executes Python Agent Worker for CLI or Frontend requests
    """
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
    """
    Triggers end-to-end multi-agent orchestration across AWS Bedrock agents:
    Seed brand memory -> generate concept -> sales pitch -> objection handling -> brand consistency check -> PM plan -> PM conflict scan.
    """
    result = PythonAgentEngine.run_full_orchestration()
    return {
        "status": "SUCCESS",
        "engine": "AWS Bedrock Multi-Agent Orchestrator",
        "workflow": result
    }
