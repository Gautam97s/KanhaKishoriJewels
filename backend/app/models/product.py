from sqlalchemy import Boolean, Column, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import uuid

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False) # Float for simplicity in MVP, Decimal preferred for production but SQLite/Postgres handling differs slightly in simple setups. We'll use Float for now or Numeric. let's use Float for ease with Pydantic.
    stock = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    category = Column(String, index=True, nullable=True)
    is_featured = Column(Boolean, default=False)

    order_items = relationship("OrderItem", back_populates="product")
