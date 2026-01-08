from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: int = 0
    is_featured: bool = False

class ProductCreate(ProductBase):
    slug: Optional[str] = None

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    price: Optional[float] = None
    slug: Optional[str] = None

class Product(ProductBase):
    id: str
    slug: str

    class Config:
        from_attributes = True
