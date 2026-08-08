from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="creator") # creator, agency, sales
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    threads = relationship("Thread", back_populates="owner", cascade="all, delete-orphan")

class Thread(Base):
    __tablename__ = "threads"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=False, default="New Conversation")
    agent_id = Column(String, default="mesh")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="threads")
    messages = relationship("ChatMessage", back_populates="thread", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    thread_id = Column(String, ForeignKey("threads.id"), nullable=False)
    sender = Column(String, nullable=False) # user | assistant
    agent_id = Column(String, nullable=True)
    text = Column(Text, nullable=False)
    agent_widget = Column(JSON, nullable=True)
    timestamp = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    thread = relationship("Thread", back_populates="messages")

class AgentPersona(Base):
    __tablename__ = "agent_personas"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    archetype = Column(String, nullable=False) # e.g. "The Closer", "The Diplomat"
    role_description = Column(Text, nullable=False)
    communication_style = Column(Text, nullable=False)
    traits = Column(JSON, default=dict) # {"assertiveness": 0.8, "empathy": 0.9}
    core_values = Column(JSON, default=list) # ["Win-win outcomes"]
    speech_patterns = Column(JSON, default=list) # ["Here's what I suggest"]
    guardrails = Column(JSON, default=list) # ["Never invent false claims"]
    goals = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class Lead(Base):
    __tablename__ = "leads"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    company = Column(String, nullable=False)
    stage = Column(String, default="NEW") # NEW, QUALIFIED, OBJECTION, PROPOSAL_SENT, CLOSED_WON, CLOSED_LOST
    source = Column(String, default="google_ads") # google_ads, meta_lead, organic
    qualification_score = Column(Integer, default=50) # 0-100 score badge
    budget_confirmed = Column(String, nullable=True) # e.g. "$50,000"
    timeline = Column(String, nullable=True) # e.g. "Q3 2026"
    goals = Column(Text, nullable=True)
    roi_projection = Column(String, nullable=True) # e.g. "340% ROI ($185k savings)"
    sla_countdown = Column(String, default="00:45:00")
    lead_status = Column(String, default="active") # active, declined
    needs_objection_handling = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, index=True)
    lead_id = Column(String, ForeignKey("leads.id"), nullable=True)
    name = Column(String, nullable=False)
    phase = Column(String, default="Phase 1: Setup")
    status = Column(String, default="IN_PROGRESS")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TaskItem(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    campaign_id = Column(String, ForeignKey("campaigns.id"), nullable=False)
    phase = Column(String, default="Phase 1: Setup")
    description = Column(Text, nullable=False)
    owner = Column(String, nullable=False)
    owner_avatar = Column(String, default="👨‍💼")
    type = Column(String, default="copy") # copy, dev, design, ops
    due_date = Column(String, default="Today")
    status = Column(String, default="PENDING") # PENDING, IN_PROGRESS, REVIEW, APPROVED
    depends_on = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class CopyReview(Base):
    __tablename__ = "copy_reviews"

    id = Column(String, primary_key=True, index=True)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    draft_text = Column(Text, nullable=False)
    status = Column(String, default="FLAGGED") # FLAGGED, APPROVED, CHANGES_REQUESTED
    flagged_issues = Column(JSON, default=list) # ["Superlative 'best' flagged"]
    reviewer_note = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CallHistory(Base):
    __tablename__ = "call_history"

    id = Column(String, primary_key=True, index=True)
    lead_id = Column(String, nullable=True)
    contact_name = Column(String, nullable=False)
    agent_id = Column(String, default="jordan")
    duration = Column(String, default="02:30")
    transcript = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    sentiment = Column(String, default="POSITIVE") # POSITIVE, NEUTRAL, CONCERNED
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    lead_id = Column(String, nullable=True)
    agent_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Integration(Base):
    __tablename__ = "integrations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False) # hubspot, salesforce, google_calendar, google_ads, meta_ads, docusign, twilio, slack, asana
    status = Column(String, default="CONNECTED") # CONNECTED, DISCONNECTED
    last_sync = Column(String, default="2 mins ago")

class BrandGuideline(Base):
    __tablename__ = "brand_guidelines"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, default="Tone & Voice")
    content = Column(Text, nullable=False)
    prohibited_words = Column(JSON, default=list)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
