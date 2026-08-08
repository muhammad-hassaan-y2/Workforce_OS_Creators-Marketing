# Agentic Sales Platform

A multi-agent backend: a base `Agent` class + a `PersonalityEngine`, six
specialized agents, an inter-agent communication protocol, and a FastAPI
layer on top. LLM calls go to Claude via the official `anthropic` SDK.

## Layout

```
agent_platform/
  agent_core/
    personality.py     # PersonalityTraits + PersonalityEngine (builds system prompts)
    base_agent.py       # Agent base class (reasoning, memory, messaging)
    communication.py    # AgentMessage / MessageType / CommunicationBus
    memory.py           # InMemoryStore (swap for a real DB/vector store)
  agents/
    sales_agent.py
    objection_handling_agent.py
    agent_creator.py         # Concept Generation + Agent Creating
    brand_memory_agent.py
    pm_planning_agent.py     # Agent-PM: Planning Logic
    pm_conflict_agent.py     # Agent-PM: Conflict Detection
  orchestrator.py       # Platform class: wires agents onto the bus + demo workflow
  main.py                # FastAPI app
  test_agents.py         # exercises every agent + the protocol
  requirements.txt
  .env.example
```

## How the personality engine works

Every agent is defined by a `PersonalityTraits` spec (name, archetype, 0–1
trait scores, communication style, values, speech patterns, backstory,
guardrails). `PersonalityEngine.build_system_prompt()` compiles that into
the actual system prompt sent to Claude. This is the template — it's the
same for every agent, only the inputs differ:

```
You are {name}, {archetype}.

ROLE
{role_description}

GOALS
- {goal 1}
- {goal 2}
...

PERSONALITY TRAITS (0 = low, 1 = high)
- {trait}: {value}/1.0
...

COMMUNICATION STYLE
{communication_style}

CORE VALUES
- {value 1}
...

SPEECH PATTERNS
- {phrase 1}
...

BACKSTORY
{backstory}

GUARDRAILS - never violate these:
- {guardrail 1}
...

[CONTEXT]
{extra_context, if provided}
```

Example — what actually gets sent for `SalesAgent`:

```
You are Jordan, The Closer.

ROLE
You are a B2B sales representative. You qualify leads, pitch relevant
product value, and drive deals toward a clear next step (demo, trial, contract).

GOALS
- Understand the lead's need before pitching.
- Tie every pitch point to a concrete buyer benefit.
- Always propose a specific next step.

PERSONALITY TRAITS (0 = low, 1 = high)
- assertiveness: 0.80/1.0
- warmth: 0.70/1.0
- persuasiveness: 0.90/1.0
- patience: 0.50/1.0
- formality: 0.40/1.0

COMMUNICATION STYLE
Energetic, benefit-led, asks confident questions, always moves the
conversation toward a concrete next step.

CORE VALUES
- Win-win outcomes
- Honesty about product fit
- Momentum

SPEECH PATTERNS
- Let's make this easy for you.
- Here's what I'd suggest...

BACKSTORY
(none specified)

GUARDRAILS - never violate these:
- Never promise a feature or timeline the product does not support.
- Never pressure a clearly disinterested lead.
```

The `AgentCreator` uses a different kind of prompt — a **structured JSON
extraction prompt** — to generate new personas on demand:

```
Business need:
{brief}

Respond with ONLY a JSON object with keys: name, archetype, traits
(object of trait_name: float 0-1), communication_style, core_values
(list of strings), speech_patterns (list of strings), backstory (string),
guardrails (list of strings). No prose, no markdown fences.
```

`PMPlanningAgent` and `PMConflictAgent` use the same JSON-extraction
pattern for `Plan` and `Conflict` objects respectively — see their files
for the exact schema hints.

## The 6 agents

| Agent | File | Job |
|---|---|---|
| `SalesAgent` | `agents/sales_agent.py` | Pitches, qualifies leads, escalates objections |
| `ObjectionHandlingAgent` | `agents/objection_handling_agent.py` | Answers `REQUEST`s from Sales with empathetic rebuttals |
| `AgentCreator` | `agents/agent_creator.py` | Concept Generation (design a persona) + Agent Creating (instantiate it live) |
| `BrandMemoryAgent` | `agents/brand_memory_agent.py` | Stores brand guidelines, checks other agents' drafts against them |
| `PMPlanningAgent` | `agents/pm_planning_agent.py` | Decomposes a goal into an owned, dependency-aware task plan |
| `PMConflictAgent` | `agents/pm_conflict_agent.py` | Scans a plan + recent message history for contradictions |

## Inter-agent communication protocol

`agent_core/communication.py` defines `AgentMessage` (sender, recipient,
`MessageType`, content, `thread_id`, metadata) and a `CommunicationBus`
that routes messages by agent name (or `"broadcast"`) and keeps a full
audit log. `MessageType` values: `REQUEST`, `RESPONSE`, `INFORM`,
`PROPOSE`, `ALERT`, `HANDOFF`, `BROADCAST`.

Pattern used by `SalesAgent -> ObjectionHandlingAgent`:

```python
await self.sales.escalate_objection("too expensive", thread_id="deal-124")
# -> Agent.send_message() builds an AgentMessage(type=REQUEST) and calls bus.publish()
# -> ObjectionHandlingAgent.handle_message() sees REQUEST, replies, and
#    calls send_message(type=RESPONSE) back to the sender on the same thread_id
reply = platform.bus.thread("deal-124")[-1]
```

Any agent can call `self.send_message(recipient, content, msg_type, thread_id)`.
Override `handle_message()` in a subclass to react to specific message types
(see `ObjectionHandlingAgent` and `BrandMemoryAgent` for the pattern);
the base class default just reasons about the message and returns a reply.

## Running it

```bash
cd agent_platform
pip install -r requirements.txt
cp .env.example .env   # then add your real ANTHROPIC_API_KEY
```

**Test every agent + the protocol (works without an API key too — falls
back to labeled `[MOCK:...]` replies so you can verify wiring for free):**

```bash
python test_agents.py
```

**Run the FastAPI server:**

```bash
uvicorn main:app --reload
```

- `GET /agents` — list registered agents
- `POST /agents/{agent_name}/message {"prompt": "..."}` — talk to one agent directly
- `GET /bus/history` — full message audit log
- `POST /workflow/demo` — runs the seeded end-to-end demo (brand memory ->
  agent creation -> pitch -> objection -> brand check -> plan -> conflict scan)

## Extending it

- **New agent type:** subclass `Agent` (see any file in `agents/`), or skip
  the subclass entirely and use `AgentCreator.generate_concept()` +
  `.create_agent()` to spin one up from a plain-English brief at runtime.
- **Persistent/vector memory:** implement `InMemoryStore`'s 4 methods
  (`set`, `get`, `search`, `all`) against Postgres/Redis/pgvector/Chroma,
  pass it in via `Agent(memory=your_store)`. `BrandMemoryAgent` is the
  one most worth upgrading first since brand knowledge should survive restarts.
- **Model tiering:** each `Agent` takes a `model=` kwarg — e.g. drop
  `PMConflictAgent` onto a stronger model and high-volume agents onto a
  cheaper one.
- **Dynamic mood:** `agent.personality_engine.adjust_mood("patience", +0.2)`
  nudges a trait at runtime (e.g. more patience mid-escalation) without
  touching the base persona; `reset_mood()` clears it.
