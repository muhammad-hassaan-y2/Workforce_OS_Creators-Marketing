import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Neon PostgreSQL Database Connection URL
# [Note: Set NEON_DATABASE_URL environment variable for production Neon PostgreSQL DB]
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    os.getenv(
        "NEON_DATABASE_URL", 
        "sqlite:///./kaiso_agent_os.db" # Default fallback for instant zero-error local development
    )
)

# Fix postgresql:// URI format if provided as postgres:// by some cloud providers
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Strip channel_binding query parameter if present for maximum psycopg2 compatibility
if "channel_binding=" in DATABASE_URL:
    import re
    DATABASE_URL = re.sub(r'[&?]channel_binding=[^&]+', '', DATABASE_URL)


# Configure SQLAlchemy engine arguments
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
