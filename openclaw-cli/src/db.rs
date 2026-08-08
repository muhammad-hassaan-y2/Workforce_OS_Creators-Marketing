use sqlx::postgres::PgPoolOptions;
use std::env;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct Agent {
    pub id: uuid::Uuid,
    pub name: String,
    pub role: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct Memory {
    pub id: uuid::Uuid,
    pub agent_id: uuid::Uuid,
    pub fact: String,
    pub fact_type: String,
}

pub struct DbClient {
    pool: sqlx::PgPool,
}

impl DbClient {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await?;

        Ok(Self { pool })
    }

    pub async fn list_agents(&self) -> Result<Vec<Agent>, sqlx::Error> {
        let agents = sqlx::query_as::<_, Agent>(
            r#"
            SELECT id, name, role, status
            FROM agents
            ORDER BY created_at DESC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(agents)
    }

    pub async fn get_memories_for_agent(&self, agent_id: uuid::Uuid) -> Result<Vec<Memory>, sqlx::Error> {
        let memories = sqlx::query_as::<_, Memory>(
            r#"
            SELECT id, agent_id, fact, fact_type
            FROM long_term_memory
            WHERE agent_id = $1
            ORDER BY created_at DESC
            LIMIT 50
            "#
        )
        .bind(agent_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(memories)
    }

    pub async fn inspect_agent(&self, agent_id: uuid::Uuid) -> Result<Agent, sqlx::Error> {
        let agent = sqlx::query_as::<_, Agent>(
            r#"
            SELECT id, name, role, status
            FROM agents
            WHERE id = $1
            "#
        )
        .bind(agent_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(agent)
    }
}
