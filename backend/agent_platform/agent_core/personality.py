"""
Personality Engine
==================
Every agent in the platform is defined by a PersonalityTraits spec. The
PersonalityEngine compiles that spec (plus a role + goals) into the system
prompt actually sent to Claude. Keeping this separate from the Agent class
means personas can be authored, generated (see AgentCreator), stored, or
swapped at runtime without touching agent logic.
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class PersonalityTraits(BaseModel):
    name: str
    archetype: str  # short label, e.g. "The Closer", "The Diplomat"
    traits: Dict[str, float] = Field(default_factory=dict)  # 0.0-1.0 scale
    communication_style: str
    core_values: List[str] = Field(default_factory=list)
    speech_patterns: List[str] = Field(default_factory=list)  # verbal tics / phrases
    backstory: Optional[str] = None
    guardrails: List[str] = Field(default_factory=list)  # hard "never do X" rules


class PersonalityEngine:
    """Turns a PersonalityTraits spec into a system prompt, with an optional
    runtime 'mood' overlay so an agent can lean into a trait temporarily
    (e.g. more patience mid-escalation) without mutating its base persona."""

    def __init__(self, traits: PersonalityTraits):
        self.traits = traits
        self._mood_overlay: Dict[str, float] = {}

    def adjust_mood(self, trait: str, delta: float) -> None:
        base = self.traits.traits.get(trait, 0.5)
        current = self._mood_overlay.get(trait, base)
        self._mood_overlay[trait] = max(0.0, min(1.0, current + delta))

    def reset_mood(self) -> None:
        self._mood_overlay = {}

    def _effective_traits(self) -> Dict[str, float]:
        merged = dict(self.traits.traits)
        merged.update(self._mood_overlay)
        return merged

    def build_system_prompt(
        self,
        role_description: str,
        goals: List[str],
        extra_context: Optional[str] = None,
    ) -> str:
        t = self._effective_traits()
        trait_lines = "\n".join(f"- {k}: {v:.2f}/1.0" for k, v in t.items()) or "- (none specified)"
        values_lines = "\n".join(f"- {v}" for v in self.traits.core_values) or "- (none specified)"
        speech_lines = "\n".join(f"- {p}" for p in self.traits.speech_patterns) or "- (none specified)"
        guardrail_lines = "\n".join(f"- {g}" for g in self.traits.guardrails) or "- (none specified)"
        goal_lines = "\n".join(f"- {g}" for g in goals) or "- (none specified)"

        prompt = f"""You are {self.traits.name}, {self.traits.archetype}.

ROLE
{role_description}

GOALS
{goal_lines}

PERSONALITY TRAITS (0 = low, 1 = high)
{trait_lines}

COMMUNICATION STYLE
{self.traits.communication_style}

CORE VALUES
{values_lines}

SPEECH PATTERNS
{speech_lines}

BACKSTORY
{self.traits.backstory or "(none specified)"}

GUARDRAILS - never violate these:
{guardrail_lines}
"""
        if extra_context:
            prompt += f"\nCONTEXT\n{extra_context}\n"
        return prompt.strip()
