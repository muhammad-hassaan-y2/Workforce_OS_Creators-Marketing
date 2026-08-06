"""
Run with:  uvicorn main:app --reload
"""
from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from orchestrator import Platform

app = FastAPI(title="Agentic Sales Platform")
platform = Platform()


class MessageIn(BaseModel):
    prompt: str


@app.get("/agents")
def list_agents():
    return {"agents": platform.agent_names()}


@app.post("/agents/{agent_name}/message")
async def message_agent(agent_name: str, body: MessageIn):
    agent = platform.get_agent(agent_name)
    if agent is None:
        raise HTTPException(status_code=404, detail=f"Unknown agent '{agent_name}'")
    reply = await agent.think(body.prompt)
    return {"agent": agent_name, "reply": reply}


@app.get("/bus/history")
def bus_history():
    return {"history": [m.model_dump() for m in platform.bus.history]}


@app.post("/workflow/demo")
async def workflow_demo() -> Dict[str, Any]:
    return await platform.run_demo_workflow()
