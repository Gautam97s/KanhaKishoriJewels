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

def add_is_deleted_column():
    print("Checking database for 'is_deleted' column...")
    
    db = SessionLocal()
    try:
        # Check if column exists
        result = db.execute(text("SELECT is_deleted FROM products LIMIT 1"))
        print("Column 'is_deleted' already exists.")
    except Exception:
        # Column likely doesn't exist
        print("Column 'is_deleted' not found. Adding it...")
        try:
            # PostgreSQL syntax
            db.execute(text("ALTER TABLE products ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE"))
            db.commit()
            print("Successfully added 'is_deleted' column.")
        except Exception as e:
            print(f"Failed to add column (Postgres): {e}")
            db.rollback()
            # Try SQLite syntax if Postgres fails (though syntax is same for this specific command usually)
            # But let's report error first.
            
    finally:
        db.close()

if __name__ == "__main__":
    add_is_deleted_column()
