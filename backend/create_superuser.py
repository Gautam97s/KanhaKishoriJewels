import sys
import os

# Ensure the current directory is in the python path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Loaded environment variables from .env")
except ImportError:
    print("python-dotenv not installed, skipping .env load")

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.user import User
from app.models.order import Order # Import Order to register it
from app.models.address import Address # Import Address to register it
from app.models.product import Product # Import Product to register it
from app.core.security import get_password_hash
import getpass

def create_superuser():
    print("Creating superuser...")
    
    # Check DATABASE_URL
    if not os.getenv("DATABASE_URL"):
        print("Error: DATABASE_URL is not set. Please set it in your .env file or environment.")
        return

    db = SessionLocal()
    
    try:
        email = input("Enter email for superuser: ").strip()
        if not email:
            print("Email is required.")
            return

        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"User with email {email} already exists.")
            if existing_user.role != "admin":
                print(f"Promoting {email} to admin...")
                existing_user.role = "admin"
                db.commit()
                print(f"User {email} successfully promoted to admin.")
            else:
                print(f"User {email} is already an admin.")
            return

        password = getpass.getpass("Enter password: ").strip()
        if not password:
            print("Password is required.")
            return
            
        confirm_password = getpass.getpass("Confirm password: ").strip()
        if password != confirm_password:
            print("Passwords do not match.")
            return

        full_name = input("Enter full name (optional): ").strip()

        print(f"Creating user {email}...")
        
        user = User(
            email=email,
            password_hash=get_password_hash(password),
            full_name=full_name,
            role="admin", # IMPORTANT: Set role to admin
            is_active=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"Superuser {user.email} created successfully with ID {user.id}")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_superuser()
