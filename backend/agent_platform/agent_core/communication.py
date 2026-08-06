"""
Inter-Agent Communication Protocol
===================================
A minimal message-passing protocol so agents can request things from each
other, respond, hand off work, or broadcast, instead of only being driven
directly by outside callers. The CommunicationBus is the single router and
also keeps a full audit log (used by PMConflictAgent to scan for conflicts).
"""
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Protocol, runtime_checkable

from pydantic import BaseModel, Field


class MessageType(str, Enum):
    REQUEST = "request"      # ask another agent to do/answer something
    RESPONSE = "response"    # reply to a REQUEST
    INFORM = "inform"        # fyi, no response expected
    PROPOSE = "propose"      # suggest a plan/decision for review
    ALERT = "alert"          # flag a problem (e.g. a detected conflict)
    HANDOFF = "handoff"      # transfer ownership of a task/thread
    BROADCAST = "broadcast"  # sent to every registered agent


class AgentMessage(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    sender: str
    recipient: str  # agent name, or "broadcast"
    type: MessageType
    content: Any
    thread_id: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    metadata: Dict[str, Any] = Field(default_factory=dict)


@runtime_checkable
class BusParticipant(Protocol):
    name: str
    bus: Optional["CommunicationBus"]

    async def receive_message(self, message: AgentMessage) -> Any: ...


class CommunicationBus:
    """Central router. Agents register once, then send/receive by name."""

    def __init__(self):
        self._agents: Dict[str, BusParticipant] = {}
        self.history: List[AgentMessage] = []

    def register(self, agent: BusParticipant) -> None:
        self._agents[agent.name] = agent
        agent.bus = self

    def participants(self) -> List[str]:
        return list(self._agents.keys())

    async def publish(self, message: AgentMessage) -> List[Any]:
        self.history.append(message)

        if message.recipient == "broadcast":
            targets = [a for name, a in self._agents.items() if name != message.sender]
        else:
            target = self._agents.get(message.recipient)
            if target is None:
                raise ValueError(f"Unknown recipient agent: '{message.recipient}'")
            targets = [target]

        results = []
        for target in targets:
            results.append(await target.receive_message(message))
        return results

    def thread(self, thread_id: str) -> List[AgentMessage]:
        return [m for m in self.history if m.thread_id == thread_id]
