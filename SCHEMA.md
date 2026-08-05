# KAI — Database Schema Documentation

## Overview

**KAI** (Kaisō Artificial Intelligence) is an AI Workforce Operating System for Marketing & Sales Agencies.

- **Cluster**: `skinny-canine`
- **Database**: `workforce_os`
- **Provider**: CockroachDB Cloud (AWS us-east-1)
- **Created**: 2026-07-29

---

## Connection

### Connection String Format

```
postgresql://{username}:{password}@skinny-canine-30561.j77.aws-us-east-1.cockroachlabs.cloud:26257/workforce_os?sslmode=verify-full
```

### Users

| Username | Role | Purpose |
|----------|------|---------|
| `asmae` | Admin | Schema owner, seed data |
| `addeloop` | Admin | CLI/OpenClaw integration |

### MCP Server Config

```json
{
  "mcpServers": {
    "cockroachdb-cloud": {
      "type": "http",
      "url": "https://cockroachlabs.cloud/mcp"
    }
  }
}
```

---

## Tables

### 1. `agents` — AI Employees

Stores every AI agent in the workforce with personality, skills, and status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | STRING | Agent name (e.g., Agent-Sales) |
| `role` | STRING | Job role (sales, creative, copy, seo, pm) |
| `personality` | JSONB | Traits: risk_tolerance, creativity, detail_orientation, communication_style |
| `permissions` | JSONB | ACL: read/write/admin flags |
| `skills` | STRING[] | Array of skills (e.g., cold_calling, negotiation) |
| `salary_virtual` | DECIMAL | Gamification salary |
| `salary_currency` | STRING | Currency (default: USD) |
| `status` | STRING | active, paused, terminated, promoted |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update |
| `embedding` | VECTOR(1536) | Semantic profile vector |

**Seed Data**: 5 agents (Sales, Creative, Copy, SEO, PM)

---

### 2. `clients` — Agency Clients

Marketing & sales clients with preferences and budgets.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | STRING | Client name (e.g., Nike) |
| `industry` | STRING | Industry sector |
| `budget_monthly` | DECIMAL | Monthly budget |
| `preferences` | JSONB | Brand voice, colors, tone, avoid list |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

**Seed Data**: 1 client (Nike, sportswear, $50K/month)

---

### 3. `campaigns` — Marketing Campaigns

Campaigns linked to clients and managed by agents.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `client_id` | UUID | FK → clients |
| `name` | STRING | Campaign name |
| `type` | STRING | seo, ads, social, email, video |
| `status` | STRING | planning, active, paused, completed |
| `budget` | DECIMAL | Campaign budget |
| `start_date` | DATE | Start date |
| `end_date` | DATE | End date |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

**Seed Data**: 1 campaign (Nike Air Max Summer 2026, $25K)

---

### 4. `agent_actions` — The "Git Commit" of Decisions

Every agent decision is stored forever — immutable audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `agent_id` | UUID | FK → agents |
| `campaign_id` | UUID | FK → campaigns |
| `action_type` | STRING | decision, creation, review, communication, analysis |
| `context` | JSONB | Input the agent saw |
| `decision` | JSONB | Output the agent produced |
| `reasoning` | TEXT | Chain of thought (why) |
| `outcome` | STRING | success, failure, pending, partial |
| `outcome_details` | JSONB | Additional outcome data |
| `metrics` | JSONB | ROI, engagement, revenue |
| `embedding` | VECTOR(1536) | Semantic memory vector |
| `created_at` | TIMESTAMPTZ | Immutable timestamp |

**Seed Data**: 5 actions (Creative decision, Sales decision, Copy creation, SEO analysis, PM resolution)

---

### 5. `agent_relationships` — Agent Society

Social graph: rivalries, mentorships, trust scores.

| Column | Type | Description |
|--------|------|-------------|
| `agent_a` | UUID | FK → agents (source) |
| `agent_b` | UUID | FK → agents (target) |
| `relationship_type` | STRING | manager, peer, mentor, rival, collaborator |
| `trust_score` | DECIMAL | 0.0 to 1.0 |
| `interaction_count` | INT | Number of interactions |
| `last_interaction` | TIMESTAMPTZ | Last contact |
| `sentiment` | DECIMAL | -1.0 to 1.0 |

**Primary Key**: (`agent_a`, `agent_b`)

**Seed Data**: 3 relationships
- Creative → Copy (rival, trust: 0.3)
- PM → Sales (manager, trust: 0.8)
- Sales → SEO (peer, trust: 0.7)

---

### 6. `long_term_memory` — Facts Learned

Extracted facts from agent actions for fast retrieval.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `agent_id` | UUID | FK → agents |
| `fact` | TEXT | The learned fact |
| `fact_type` | STRING | client_preference, campaign_insight, bug_pattern, best_practice, lesson_learned |
| `source_action_id` | UUID | FK → agent_actions |
| `source_campaign_id` | UUID | FK → campaigns |
| `confidence` | DECIMAL | 0.0 to 1.0 |
| `access_count` | INT | How often retrieved |
| `last_accessed` | TIMESTAMPTZ | Last retrieval |
| `embedding` | VECTOR(1536) | Semantic vector |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

---

### 7. `audit_log` — System Audit

Immutable log of all system actions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `actor_type` | STRING | human, agent, system |
| `actor_id` | STRING | Who did it |
| `action` | STRING | What happened |
| `resource_type` | STRING | What was affected |
| `resource_id` | STRING | Which resource |
| `details` | JSONB | Additional info |
| `timestamp` | TIMESTAMPTZ | When |

---

## Example Queries

### List all agents

```sql
SELECT id, name, role, salary_virtual, status
FROM agents
ORDER BY salary_virtual DESC;
```

### View agent relationships

```sql
SELECT 
    a1.name AS agent,
    a2.name AS related_to,
    ar.relationship_type,
    ar.trust_score
FROM agent_relationships ar
JOIN agents a1 ON ar.agent_a = a1.id
JOIN agents a2 ON ar.agent_b = a2.id
WHERE a1.name = 'Agent-Creative';
```

### Memory Replay: Why did Agent-Creative decide this?

```sql
SELECT 
    aa.reasoning,
    aa.decision,
    aa.outcome,
    aa.metrics,
    aa.created_at
FROM agent_actions aa
JOIN agents a ON aa.agent_id = a.id
WHERE a.name = 'Agent-Creative' 
  AND aa.action_type = 'decision'
ORDER BY aa.created_at DESC;
```

### All actions by agent with campaign

```sql
SELECT 
    a.name AS agent,
    c.name AS campaign,
    aa.action_type,
    aa.reasoning,
    aa.created_at
FROM agent_actions aa
JOIN agents a ON aa.agent_id = a.id
JOIN campaigns c ON aa.campaign_id = c.id
WHERE a.name = 'Agent-Sales'
ORDER BY aa.created_at DESC;
```

### Agent performance metrics

```sql
SELECT 
    a.name,
    COUNT(aa.id) AS total_actions,
    SUM(CASE WHEN aa.outcome = 'success' THEN 1 ELSE 0 END) AS successes,
    AVG((aa.metrics->>'roi')::DECIMAL) AS avg_roi
FROM agents a
LEFT JOIN agent_actions aa ON a.id = aa.agent_id
GROUP BY a.name;
```

### Search memory by semantic similarity (placeholder)

```sql
-- Requires embedding vector from Bedrock Titan
SELECT 
    aa.id,
    aa.reasoning,
    aa.decision
FROM agent_actions aa
WHERE aa.agent_id = 'AGENT_UUID'
ORDER BY aa.embedding <-> $1  -- vector parameter
LIMIT 10;
```

---

## Indexes

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| `agents` | `idx_agents_name` | btree | Fast lookup by name |
| `campaigns` | `idx_campaigns_client` | btree | Campaigns by client |
| `agent_actions` | `idx_actions_agent_time` | btree | Actions by agent, time-sorted |
| `agent_actions` | `idx_actions_campaign` | btree | Actions by campaign |
| `agent_actions` | `idx_actions_type` | btree | Filter by action type |
| `long_term_memory` | `idx_memory_agent` | btree | Memory by agent |
| `audit_log` | `idx_audit_timestamp` | btree | Audit by time |

---

## Entity Relationship Diagram

```
agents ||--o{ agent_actions : performs
agents ||--o{ agent_relationships : relates_to
agents ||--o{ long_term_memory : remembers
clients ||--o{ campaigns : owns
campaigns ||--o{ agent_actions : contains
campaigns ||--o{ long_term_memory : sources
agent_actions ||--o{ long_term_memory : generates
```

---

## Notes

- **Vector indexing**: C-SPANN not available on Basic tier. Using `VECTOR(1536)` type with manual cosine similarity.
- **Changefeeds**: Planned for real-time monitoring (requires Lambda webhook endpoint).
- **MCP Server**: Enabled for natural language queries via Claude Code/Cursor.

---

*Last updated: 2026-08-05*
*Maintained by: Asmae (Schema Designer)*
