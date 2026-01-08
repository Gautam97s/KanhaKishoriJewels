from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.api import deps
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema
from app.schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not user.password_hash or not verify_password(form_data.password, user.password_hash):
        # Added check for user.password_hash to prevent crashing if a social user tries to password login without one
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/signup", response_model=UserSchema)
def create_user_signup(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/google", response_model=Token)
def google_login(
    *,
    db: Session = Depends(deps.get_db),
    token: str = Body(..., embed=True), # Expects {"token": "..."}
) -> Any:
    """
    Login or Signup with Google.
    """
    try:
        # Verify the token
        # Note: In production you should pass your Google Client ID here
        # id_info = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
        # For MVP/Development where we might not have a client ID set up fully on backend:
        id_info = id_token.verify_oauth2_token(token, google_requests.Request())
        
        email = id_info.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid Google Token: No email found")
            
    except ValueError as e:
         raise HTTPException(status_code=400, detail=f"Invalid Google Token: {str(e)}")

    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new user
        user = User(
            email=email,
            full_name=id_info.get("name"),
            role="user",
            password_hash=None, # No password for social users
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
