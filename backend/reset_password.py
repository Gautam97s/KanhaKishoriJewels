import sys
import os

# Ensure the current directory is in the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from app.db.session import SessionLocal
from app.models.user import User
from app.models.order import Order
from app.models.address import Address
from app.models.product import Product
from app.core.security import get_password_hash
import getpass

def reset_password():
    print("Resetting User Password...")
    
    if not os.getenv("DATABASE_URL"):
        print("Error: DATABASE_URL is not set.")
        return

    db = SessionLocal()
    
    try:
        email = input("Enter email of the user: ").strip()
        if not email:
            print("Email is required.")
            return

        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"No user found with email {email}.")
            return

        print(f"User found: {user.full_name} (Role: {user.role})")
        
        new_password = getpass.getpass("Enter NEW password: ").strip()
        if not new_password:
            print("Password cannot be empty.")
            return
            
        confirm_password = getpass.getpass("Confirm NEW password: ").strip()
        if new_password != confirm_password:
            print("Passwords do not match.")
            return
            
        user.password_hash = get_password_hash(new_password)
        db.commit()
        
        print(f"Password for {email} has been successfully updated.")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_password()
