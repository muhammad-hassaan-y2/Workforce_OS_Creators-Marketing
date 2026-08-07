"""
Hard guardrails for Atlas (PM planner): no circular task dependencies, and
every task must have an owner.
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from guardrails.engine import RuleResult, register_rule

def has_cycle(tasks: list[dict]) -> bool:
    """Cycle detection via DFS graph traversal."""
    graph = {}
    for t in tasks:
        task_id = t.get("id", "")
        deps = t.get("depends_on", [])
        graph[task_id] = deps

    visited = set()
    rec_stack = set()

    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(node)
        return False

    for node in graph:
        if node not in visited:
            if dfs(node):
                return True
    return False

@register_rule("planner")
@register_rule("atlas")
def no_cycles(output: dict, context: dict) -> RuleResult:
    tasks = output.get("tasks", [])
    if has_cycle(tasks):
        return RuleResult(False, "circular task dependency detected in project plan")
    return RuleResult(True)

@register_rule("planner")
@register_rule("atlas")
def every_task_has_owner(output: dict, context: dict) -> RuleResult:
    missing = [t.get("id", "unnamed") for t in output.get("tasks", []) if not t.get("owner")]
    if missing:
        return RuleResult(False, f"tasks missing an owner: {missing}")
    return RuleResult(True)
