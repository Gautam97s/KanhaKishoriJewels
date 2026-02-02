import sys
import os
from sqlalchemy import text

# Ensure the current directory is in the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from app.db.session import SessionLocal

def add_holiday_special_column():
    print("Checking database for 'is_holiday_special' column...")
    
    db = SessionLocal()
    try:
        # Check if column exists
        try:
            db.execute(text("SELECT is_holiday_special FROM products LIMIT 1"))
            print("Column 'is_holiday_special' already exists.")
        except Exception:
            db.rollback() # Reset transaction
            # Column likely doesn't exist
            print("Column 'is_holiday_special' not found. Adding it...")
            try:
                # PostgreSQL syntax
                db.execute(text("ALTER TABLE products ADD COLUMN is_holiday_special BOOLEAN DEFAULT FALSE"))
                db.commit()
                print("Successfully added 'is_holiday_special' column.")
            except Exception as e:
                print(f"Failed to add column: {e}")
                db.rollback()
            
    finally:
        db.close()

if __name__ == "__main__":
    add_holiday_special_column()
