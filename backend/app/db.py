from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# DATABASE_URL must be set in your environment (e.g., Railway dashboard)
DATABASE_URL = os.environ["DATABASE_URL"]  # Raises KeyError if not set

# If deploying to Railway, add connect_args for SSL if needed
connect_args = {}
if DATABASE_URL.startswith("postgresql://") and "railway" in DATABASE_URL:
	connect_args = {"sslmode": "require"}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
