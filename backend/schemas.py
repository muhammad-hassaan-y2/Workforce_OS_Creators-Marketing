from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List, Any

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "creator"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

class ThreadCreate(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = "New Conversation"
    agent_id: Optional[str] = "mesh"

class ChatMessageCreate(BaseModel):
    text: str
    agent_id: Optional[str] = "mesh"

class ChatMessageResponse(BaseModel):
    id: str
    thread_id: str
    sender: str
    agent_id: Optional[str] = None
    text: str
    agent_widget: Optional[Any] = None
    timestamp: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ThreadResponse(BaseModel):
    id: str
    title: str
    agent_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
