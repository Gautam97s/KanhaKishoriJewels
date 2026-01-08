from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
from app.models.user import User
from app.models.address import Address
from app.schemas.user import User as UserSchema, UserUpdate
from app.schemas.address import Address as AddressSchema, AddressCreate, AddressUpdate

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=UserSchema)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user_data = jsonable_encoder(current_user)
    update_data = user_in.model_dump(exclude_unset=True)
    
    # Simple dictionary update logic if not using CRUDBase yet or just directly:
    for field in user_data:
        if field in update_data:
            setattr(current_user, field, update_data[field])
            
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

# Address Endpoints

@router.get("/me/addresses", response_model=List[AddressSchema])
def read_user_addresses(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve current user's addresses.
    """
    return db.query(Address).filter(Address.user_id == current_user.id).offset(skip).limit(limit).all()

@router.post("/me/addresses", response_model=AddressSchema)
def create_user_address(
    *,
    db: Session = Depends(deps.get_db),
    address_in: AddressCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new address for current user.
    """
    # If this is the first address, make it default? Or let frontend handle it.
    # Simple logic: just create.
    address = Address(**address_in.model_dump(), user_id=current_user.id)
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.put("/me/addresses/{address_id}", response_model=AddressSchema)
def update_user_address(
    *,
    db: Session = Depends(deps.get_db),
    address_id: str,
    address_in: AddressUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an address.
    """
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    update_data = address_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(address, field, value)
        
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.delete("/me/addresses/{address_id}", response_model=AddressSchema)
def delete_user_address(
    *,
    db: Session = Depends(deps.get_db),
    address_id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete an address.
    """
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
        
    db.delete(address)
    db.commit()
    return address
