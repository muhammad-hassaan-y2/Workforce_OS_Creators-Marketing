"""
Shared hard-guardrail enforcement engine for Kaiso Agent OS.

Design:
- Soft guardrails live in the system prompt (behavior). The model is asked.
- Hard guardrails live here, in code (enforcement). They run on structured
  agent output AFTER generation, before a response ever leaves the service.
- Each agent registers a list of deterministic checks. A check receives the
  agent's structured output plus request context, and returns a RuleResult.
  Nothing here calls an LLM — that's the point.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable

logger = logging.getLogger("kaiso.guardrails")


@dataclass
class RuleResult:
    passed: bool
    detail: str = ""


HardRule = Callable[[dict[str, Any], dict[str, Any]], RuleResult]

_HARD_RULES: dict[str, list[HardRule]] = {}


class HardGuardrailViolation(Exception):
    """Raised when a registered hard rule fails. Never silently swallowed."""

    def __init__(self, agent_name: str, rule: str, detail: str):
        self.agent_name = agent_name
        self.rule = rule
        self.detail = detail
        super().__init__(f"[{agent_name}] {rule}: {detail}")


def register_rule(agent_name: str):
    """Decorator: attach a hard rule function to an agent's rule set."""
    def decorator(fn: HardRule) -> HardRule:
        _HARD_RULES.setdefault(agent_name, []).append(fn)
        return fn

    return decorator


def rules_for(agent_name: str) -> list[HardRule]:
    return list(_HARD_RULES.get(agent_name, []))


def enforce(
    agent_name: str,
    output: dict[str, Any],
    context: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Run every registered hard rule for `agent_name` against `output`.

    Fail-closed: raises HardGuardrailViolation on the first failing rule.
    Returns `output` unchanged if every rule passes.
    """
    context = context or {}
    for rule in rules_for(agent_name):
        result = rule(output, context)
        if not result.passed:
            logger.warning(
                "guardrail_trip agent=%s rule=%s detail=%s",
                agent_name,
                rule.__name__,
                result.detail,
            )
            raise HardGuardrailViolation(agent_name, rule.__name__, result.detail)
    return output
