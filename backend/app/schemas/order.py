from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: str
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: str
    price_at_purchase: float
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: Optional[Any] = None
    customer_name: str
    phone: str

class Order(BaseModel):
    id: str
    user_id: str
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    payment_method: Optional[str] = "COD"
    status: str
    total_amount: float
    created_at: datetime
    items: List[OrderItem] = []
    shipping_address: Optional[Any] = None

    class Config:
        from_attributes = True
