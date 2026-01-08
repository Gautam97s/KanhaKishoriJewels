from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AddressBase(BaseModel):
    street: str
    city: str
    state: str
    zip: str
    country: str
    is_default: Optional[bool] = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(AddressBase):
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None
    is_default: Optional[bool] = None

class AddressInDBBase(AddressBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Address(AddressInDBBase):
    pass
