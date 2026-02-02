import sys
import os
from sqlalchemy import text
from urllib.parse import urlparse

# Ensure the current directory is in the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from app.db.session import SessionLocal

def debug_db():
    print("--- Database Connection Debugger ---")
    
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL is not set in .env")
        return

    # Mask password for display
    try:
        parsed = urlparse(db_url)
        print(f"Target Database Host: {parsed.hostname}")
        print(f"Target Database Port: {parsed.port}")
        print(f"Target Database Name: {parsed.path[1:]}")
    except Exception:
        print("Could not parse DATABASE_URL to show host (might be malformed or SQLite).")

    db = SessionLocal()
    try:
        print("\nChecking 'products' table schema...")
        # Check if is_deleted exists
        try:
            db.execute(text("SELECT is_deleted FROM products LIMIT 1"))
            print("SUCCESS: Column 'is_deleted' EXISTS in this database.")
        except Exception as e:
            print("FAILURE: Column 'is_deleted' DOES NOT EXIST in this database.")
            print(f"Error detail: {e}")
            
    except Exception as e:
        print(f"General Connection Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_db()
