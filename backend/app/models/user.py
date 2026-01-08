from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    role = Column(String, default="user") # 'admin' or 'user'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    orders = relationship("Order", back_populates="user")
