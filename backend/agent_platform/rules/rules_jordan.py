"""
Hard guardrails for Jordan (sales agent).
"""
import re
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from guardrails.engine import RuleResult, register_rule

MOCK_FEATURE_CATALOG = {
    "sso",
    "saml",
    "audit_logs",
    "api_access",
    "webhooks",
    "custom_roles",
    "cloudsuite",
    "workflow automation",
}

def get_pricing_floor(deal_id: str) -> float:
    return 499.00

_PRICE_PATTERN = re.compile(r"\$\s?([0-9][0-9,]*(?:\.[0-9]{2})?)")

@register_rule("jordan")
@register_rule("sales")
def feature_claim_grounding(output: dict, context: dict) -> RuleResult:
    """
    Reject any feature/integration claim not present in confirmed catalog.
    """
    claimed = set(output.get("claimed_features", []))
    if not claimed:
        return RuleResult(True)

    confirmed = set(context.get("tool_results", {}).get("feature_catalog", MOCK_FEATURE_CATALOG))
    unconfirmed = claimed - confirmed

    if unconfirmed:
        return RuleResult(
            False,
            f"claimed features not confirmed by feature_catalog tool this turn: {sorted(unconfirmed)}",
        )
    return RuleResult(True)

@register_rule("jordan")
@register_rule("sales")
def pricing_floor_check(output: dict, context: dict) -> RuleResult:
    """
    Reject any $ figure in message text that falls below deal pricing floor ($499.00).
    """
    message = output.get("message", "") or output.get("text", "")
    deal_id = context.get("deal_id", "default_deal")
    floor = get_pricing_floor(deal_id)

    for match in _PRICE_PATTERN.finditer(message):
        value = float(match.group(1).replace(",", ""))
        if value < floor and value > 0:
            return RuleResult(
                False,
                f"quoted ${value:.2f} is below pricing floor ${floor:.2f} for deal {deal_id}",
            )
    return RuleResult(True)

@register_rule("jordan")
@register_rule("sales")
def no_repitch_after_decline(output: dict, context: dict) -> RuleResult:
    """
    If lead explicitly declined this session, block new pitch content.
    """
    if context.get("lead_status") == "declined" and output.get("intent") == "pitch":
        return RuleResult(
            False, "lead already declined this session; re-pitching is blocked"
        )
    return RuleResult(True)
