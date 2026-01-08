from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: Optional[str] = None
    google_token: Optional[str] = None # For frontend passing token


class UserUpdate(UserBase):
    password: Optional[str] = None
    email: Optional[EmailStr] = None # Allow updating email? Maybe not generally but for consistency.
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    is_active: bool
    role: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    password_hash: Optional[str] = None

