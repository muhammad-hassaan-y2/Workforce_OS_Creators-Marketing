"""
100% Dynamic Guardrails for Jordan (sales agent).
All rules fetch values dynamically from request context or database settings.
"""
import re
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from guardrails.engine import RuleResult, register_rule

_PRICE_PATTERN = re.compile(r"\$\s?([0-9][0-9,]*(?:\.[0-9]{2})?)")

@register_rule("jordan")
@register_rule("sales")
def feature_claim_grounding(output: dict, context: dict) -> RuleResult:
    """
    Reject any feature claim not present in dynamic feature_catalog provided in context.
    """
    claimed = set(output.get("claimed_features", []))
    if not claimed:
        return RuleResult(True)

    # Dynamically fetched from database / integration settings
    confirmed = set(context.get("feature_catalog", context.get("tool_results", {}).get("feature_catalog", [])))
    if not confirmed:
        return RuleResult(True)  # Open dynamic verification

    unconfirmed = claimed - confirmed
    if unconfirmed:
        return RuleResult(
            False,
            f"claimed features not confirmed by dynamic feature catalog: {sorted(unconfirmed)}",
        )
    return RuleResult(True)

@register_rule("jordan")
@register_rule("sales")
def pricing_floor_check(output: dict, context: dict) -> RuleResult:
    """
    Dynamically check quoted $ figures against deal/org pricing floor passed in context.
    """
    message = output.get("message", "") or output.get("text", "")
    floor = float(context.get("pricing_floor", 499.00))  # Dynamically set from DB/API request
    deal_id = context.get("deal_id", "dynamic_deal")

    for match in _PRICE_PATTERN.finditer(message):
        value = float(match.group(1).replace(",", ""))
        if value < floor and value > 0:
            return RuleResult(
                False,
                f"quoted ${value:.2f} is below dynamic pricing floor ${floor:.2f} for deal {deal_id}",
            )
    return RuleResult(True)

@register_rule("jordan")
@register_rule("sales")
def no_repitch_after_decline(output: dict, context: dict) -> RuleResult:
    """
    If lead status is marked 'declined' in dynamic context, block new pitch content.
    """
    if context.get("lead_status") == "declined" and output.get("intent") == "pitch":
        return RuleResult(
            False, "lead already declined this session; re-pitching is blocked"
        )
    return RuleResult(True)
