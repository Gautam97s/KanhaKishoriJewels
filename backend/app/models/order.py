from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum
import uuid

class OrderStatus(str, enum.Enum):
    PENDING = "pending" # Initial state
    CONFIRMED = "confirmed" # Admin confirmed
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    FAILED = "failed"

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    
    # COD Fields
    customer_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    payment_method = Column(String, default="COD")
    
    status = Column(String, default=OrderStatus.PENDING.value)
    total_amount = Column(Float, nullable=False)
    shipping_address = Column(JSON, nullable=True) # Store address snapshot
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Razorpay fields (Keep for schema compatibility or remove? Instructions say remove integration. 
    # Better to leave columns in DB to avoid migration issues if possible, or just remove if we are "modifying existing payment flow".)
    # The prompt says "Disable online payments completely". 
    # I will comment them out to "remove" integration as requested, but keeping them in DB might be cleaner if we roll back. 
    # However, prompt says "Ensure orders table has... items, total_amount, payment_method (COD), status...".
    # I will add the requested fields.
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"))
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
