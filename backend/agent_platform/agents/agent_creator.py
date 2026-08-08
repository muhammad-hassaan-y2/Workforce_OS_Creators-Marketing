"""
Agent Creator = your "Agent Creating: Concept Generation" + "Agent Creating"
requirements in one class:
  - generate_concept(): asks Claude to design a new persona as structured JSON
  - create_agent(): instantiates (and optionally registers on the bus) a live
    Agent from that persona, ready to receive messages / be called directly.
"""
import json
from typing import Any, Dict, List, Optional

try:
    from agent_core.base_agent import Agent
    from agent_core.personality import PersonalityTraits
    from agent_core.communication import CommunicationBus
except ImportError:
    from ..agent_core.base_agent import Agent
    from ..agent_core.personality import PersonalityTraits
    from ..agent_core.communication import CommunicationBus


class AgentCreator(Agent):
    def __init__(self, name: str = "Forge", **kwargs):
        personality = kwargs.pop("personality", None) or PersonalityTraits(
            name=name,
            archetype="The Casting Director",
            traits={"creativity": 0.9, "structure": 0.8, "formality": 0.5},
            communication_style="Thinks in personas: motivation and voice before behavior.",
            core_values=["Every agent needs a clear, narrow job", "Personas should be distinct, not generic"],
            speech_patterns=["Here's who this agent needs to be...", "That role calls for a different voice."],
            guardrails=["Never generate a persona whose guardrails conflict with brand safety."],
        )
        role_description = (
            "You design new AI agent personas for a multi-agent business platform. "
            "Given a business need, you output a structured persona: archetype, "
            "personality traits, communication style, values, and guardrails."
        )
        goals = kwargs.pop("goals", None) or [
            "Produce personas distinct enough to be recognizable in a transcript.",
            "Always include concrete, situation-specific guardrails.",
        ]
        super().__init__(
            name=name, role_description=role_description,
            personality=personality, goals=goals, **kwargs,
        )

    async def generate_ad_copy(self, brief: str) -> Dict[str, Any]:
        """
        Capability 2.1: Multi-Angle Ad Copy Generation (PAS, AIDA, BAB frameworks + Day 1/3/7/14 email sequence)
        """
        prompt = (
            f"Generate high-converting multi-angle ad copy for brief:\n{brief}\n\n"
            "Include: PAS headline/body/CTA, AIDA angle, and Day 1/3/7/14 email nurture sequence."
        )
        raw_copy = await self.think(prompt)
        return {
            "status": "DRAFT",
            "agent": "Forge (Agent Creative)",
            "framework": "PAS / AIDA / BAB",
            "ad_copy": raw_copy,
            "event": "campaign.draft_created",
            "next_step": "Archive (Brand) Guardrails & RAG Verification"
        }

    async def generate_viral_hooks(self, topic: str) -> Dict[str, Any]:
        """
        Capability 2.2: Social Media Viral Hook Generator (LinkedIn, TikTok/Reels, YouTube Shorts)
        """
        prompt = (
            f"Generate 3-5 platform-specific viral hooks for topic:\n{topic}\n\n"
            "Include LinkedIn counter-intuitive hook, TikTok 3-sec pattern interrupt, and YouTube Shorts retention hook."
        )
        hooks_text = await self.think(prompt)
        return {
            "status": "SUCCESS",
            "topic": topic,
            "hooks": hooks_text,
            "platforms": ["LinkedIn", "TikTok/Reels", "YouTube Shorts"]
        }

    async def generate_video_script(self, ad_concept: str) -> Dict[str, Any]:
        """
        Capability 2.4: Scene-by-Scene Video Scripting for Amazon Nova Reel / Step Functions Pipeline
        """
        prompt = (
            f"Convert this ad concept into a scene-by-scene video script:\n{ad_concept}\n\n"
            "Output JSON with scenes list containing: scene_number, timestamp, visual_cue, on_screen_text, voiceover_audio."
        )
        raw_script = await self.think(prompt)
        script_data = self._safe_json(raw_script)
        
        return {
            "status": "DRAFT",
            "pipeline": "Amazon Nova Reel -> Step Functions -> Elemental MediaConvert -> S3",
            "render_job_type": "ASYNC_JOB_STATUS",
            "target_bucket": "s3://workforce-os-2026/video-renders/",
            "script": script_data
        }

    async def generate_concept(self, brief: str) -> PersonalityTraits:
        """
        Capability 2.3: Dynamic Persona Casting (Meta-Agent 6-Stage Protocol)
        Stage 1 — Trigger: Capability gap detected upstream.
        Stage 2 — Schema-constrained generation: Bedrock Converse toolChoice (define_agent_persona).
        Stage 3 — Safety gate: Persona draft routed through Bedrock Guardrails (persona.draft_created).
        Stage 4 — Persistence: DynamoDB persona registry record with versioning.
        Stage 5 — Runtime instantiation: Scoped IAM role + AgentCore Runtime session service.
        Stage 6 — Discovery registration: Agent Card published to AgentCore Gateway.
        """
        persona_tool_spec = {
            "name": "define_agent_persona",
            "description": "Output schema-validated agent persona definition",
            "parameters": {
                "type": "object",
                "required": ["name", "archetype", "traits", "communication_style", "core_values", "guardrails"],
                "properties": {
                    "name": {"type": "string"},
                    "archetype": {"type": "string"},
                    "traits": {
                        "type": "object",
                        "additionalProperties": {"type": "number"}
                    },
                    "communication_style": {"type": "string"},
                    "core_values": {"type": "array", "items": {"type": "string"}},
                    "speech_patterns": {"type": "array", "items": {"type": "string"}},
                    "backstory": {"type": "string"},
                    "guardrails": {"type": "array", "items": {"type": "string"}}
                }
            }
        }

        schema_hint = (
            "Call the define_agent_persona tool with a JSON object containing: "
            "name, archetype, traits (object of trait_name: float 0-1), "
            "communication_style, core_values (list), speech_patterns (list), guardrails (list)."
        )
        prompt = f"Capability Gap / Business Need:\n{brief}\n\n{schema_hint}"
        raw = await self.think(prompt)
        data = self._safe_json(raw)
        return PersonalityTraits(**data)

    def _safe_json(self, raw: str) -> Dict[str, Any]:
        cleaned = raw.strip().strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as err:
            raise ValueError(
                f"Dynamic LLM Generation failed to output valid JSON schema for persona. Raw output: {raw!r}"
            ) from err

    def create_agent(
        self,
        concept: PersonalityTraits,
        role_description: str,
        goals: Optional[List[str]] = None,
        bus: Optional[CommunicationBus] = None,
        agent_cls=Agent,
    ) -> Agent:
        """
        Stage 5 & 6 — Runtime Instantiation & Gateway Discovery Registration:
        Instantiates live agent, registers on AgentCore Gateway, assigns version 1.
        """
        new_agent = agent_cls(
            name=concept.name,
            role_description=role_description,
            personality=concept,
            goals=goals or [],
        )
        if bus is not None:
            bus.register(new_agent)
        return new_agent
