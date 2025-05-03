import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get DATABASE_URL, with a fallback (though this should be set in .env)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:default@localhost:5432/postgres")
print(f"Loaded DATABASE_URL: {DATABASE_URL}")  # Debug print
if not DATABASE_URL or DATABASE_URL == "postgresql://postgres:default@localhost:5432/postgres":
    raise ValueError("DATABASE_URL is not set or invalid. Please check your .env file.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()