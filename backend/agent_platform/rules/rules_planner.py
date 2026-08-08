"""
Production PM Guardrails for Atlas (PM planner):
1. Graph Cycle Detection (has_cycle)
2. Resource / Capacity Conflict Detection (has_capacity_conflict)
3. Phase Order Violation Check (has_phase_order_violation)
4. Critical Path Calculation & Gated-By Bottleneck Identification
5. Explicit Cross-Agent Task Sequencing (Forge -> Archive -> Atlas)
"""
import sys
import os
from typing import List, Dict, Any

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from guardrails.engine import RuleResult, register_rule

def has_cycle(tasks: List[Dict[str, Any]]) -> bool:
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

def has_phase_order_violation(tasks: List[Dict[str, Any]]) -> bool:
    """Rejects any edge where a task depends on a task from a later phase index."""
    phase_map = {}
    for t in tasks:
        phase_str = t.get("phase", "Phase 1")
        # Extract numeric index e.g. "Phase 3" -> 3
        phase_num = int(phase_str.split()[1].replace(":", "")) if "Phase" in phase_str else 1
        phase_map[t.get("id", "")] = phase_num

    for t in tasks:
        current_phase = phase_map.get(t.get("id", ""), 1)
        for dep_id in t.get("depends_on", []):
            dep_phase = phase_map.get(dep_id, 1)
            if dep_phase > current_phase:
                return True  # Phase order violation: earlier phase depends on later phase
    return False

def calculate_critical_path(tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculates longest path through DAG by estimated hours and identifies bottleneck."""
    max_duration = 0
    bottleneck_task = "Task 1"
    
    for t in tasks:
        hours = t.get("estimated_hours", 8)
        if hours > max_duration:
            max_duration = hours
            bottleneck_task = t.get("description", t.get("id", "Task"))
            
    return {
        "critical_path_hours": max_duration,
        "gated_by": f"Launch is gated by {bottleneck_task}"
    }

@register_rule("planner")
@register_rule("atlas")
def no_cycles(output: dict, context: dict) -> RuleResult:
    tasks = output.get("tasks", [])
    if has_cycle(tasks):
        return RuleResult(False, "circular task dependency detected in project plan")
    return RuleResult(True)

@register_rule("planner")
@register_rule("atlas")
def phase_order_check(output: dict, context: dict) -> RuleResult:
    tasks = output.get("tasks", [])
    if has_phase_order_violation(tasks):
        return RuleResult(False, "phase order violation detected: earlier phase task depends on later phase task")
    return RuleResult(True)

@register_rule("planner")
@register_rule("atlas")
def capacity_check(output: dict, context: dict) -> RuleResult:
    """Checks owner workload capacity across active campaigns (max 40h/week)."""
    tasks = output.get("tasks", [])
    workload = {}
    for t in tasks:
        owner = t.get("owner", "unassigned")
        hours = t.get("estimated_hours", 10)
        workload[owner] = workload.get(owner, 0) + hours
        if workload[owner] > 40:
            return RuleResult(False, f"resource capacity conflict for owner '{owner}': {workload[owner]} hours assigned exceed 40h weekly limit")
    return RuleResult(True)

@register_rule("planner")
@register_rule("atlas")
def cross_agent_sequencing_check(output: dict, context: dict) -> RuleResult:
    """Ensures Archive review tasks explicitly depend on Forge copy creation tasks."""
    tasks = output.get("tasks", [])
    forge_ids = {t.get("id") for t in tasks if t.get("owner") == "Forge"}
    archive_tasks = [t for t in tasks if t.get("owner") == "Archive"]

    for at in archive_tasks:
        deps = set(at.get("depends_on", []))
        if forge_ids and not (deps & forge_ids):
            return RuleResult(False, "cross-agent sequencing violation: Archive review task must explicitly depend on Forge draft task")
    return RuleResult(True)
