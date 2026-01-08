try:
    from passlib.context import CryptContext
    print("Passlib imported successfully.")
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("CryptContext created.")
    hash = pwd_context.hash("testpassword")
    print(f"Hash created: {hash}")
except Exception as e:
    print(f"Error: {e}")
