
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to sys.path to resolve app imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings
from app.core.config import settings
from app.db.base import Base # Register all models
from app.models.user import User

def promote_user(email: str):
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"User with email {email} not found.")
            return

        user.role = "admin"
        db.add(user)
        db.commit()
        print(f"Success! User {email} has been promoted to 'admin'.")
        print("You can now modify products in the Admin Panel.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/promote_to_admin.py <email>")
    else:
        promote_user(sys.argv[1])
