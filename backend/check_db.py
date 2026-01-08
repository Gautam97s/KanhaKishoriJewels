import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from app.core.config import settings

def check_db(db_name):
    print(f"Checking connection to {db_name}...")
    # Construct URI manually to test specific DBs
    from urllib.parse import quote_plus
    uri = f"postgresql+psycopg2://{quote_plus(settings.POSTGRES_USER)}:{quote_plus(settings.POSTGRES_PASSWORD)}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{db_name}"
    print(f"Using URI: {uri}")
    try:
        engine = create_engine(uri)
        with engine.connect() as conn:
            print(f"Successfully connected to {db_name}")
            return True
    except SQLAlchemyError as e:
        print(f"Failed to connect to {db_name}:")
        print(e)
        return False

if __name__ == "__main__":
    if check_db("jewelry_db"):
        sys.exit(0)
    
    print("\nAttempting to create jewelry_db...")
    if check_db("postgres"):
        # improved creation logic
        try:
            from psycopg2 import connect
            from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
            con = connect(
                user=settings.POSTGRES_USER,
                host=settings.POSTGRES_SERVER,
                password=settings.POSTGRES_PASSWORD,
                port=settings.POSTGRES_PORT,
                dbname="postgres"
            )
            con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = con.cursor()
            cursor.execute('CREATE DATABASE jewelry_db')
            print("jewelry_db created successfully")
            cursor.close()
            con.close()
        except Exception as e:
            print(f"Error creating database: {e}")
            sys.exit(1)
    else:
        print("Cannot connect to postgres default db to create new db.")
        sys.exit(1)
