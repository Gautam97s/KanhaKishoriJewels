from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.api import deps
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.schemas.order import Order as OrderSchema, OrderCreate
import json

router = APIRouter()

@router.get("/", response_model=List[OrderSchema])
def read_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve orders.
    Admins see all orders (newest first).
    Users see their own orders.
    """
    if current_user.role == "admin":
        orders = db.query(Order).order_by(desc(Order.created_at)).offset(skip).limit(limit).all()
    else:
        orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(desc(Order.created_at)).offset(skip).limit(limit).all()
    return orders

@router.post("/", response_model=OrderSchema)
def create_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: OrderCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new COD order.
    """
    # Calculate total and verify stock
    total_amount = 0.0
    db_items = []
    
    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        # Check stock here if needed
        # if not product.in_stock:
        #    raise HTTPException(status_code=400, detail=f"Product {product.name} is out of stock")

        total_amount += product.price * item.quantity
        db_items.append({
            "product": product,
            "quantity": item.quantity,
            "price": product.price
        })

    order = Order(
        user_id=current_user.id,
        customer_name=order_in.customer_name,
        phone=order_in.phone,
        status=OrderStatus.PENDING.value, # NEW/PENDING
        payment_method="COD",
        total_amount=total_amount,
        shipping_address=order_in.shipping_address,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Create Order Items
    for item_data in db_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            price_at_purchase=item_data["price"]
        )
        db.add(order_item)
    
    db.commit()
    db.refresh(order)
    return order

@router.patch("/{order_id}/status", response_model=OrderSchema)
def update_order_status(
    *,
    db: Session = Depends(deps.get_db),
    order_id: str,
    status: str,
    current_user = Depends(deps.get_current_active_superuser), # Ensure only admin
) -> Any:
    """
    Update order status (Admin only).
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Simple validation using OrderStatus enum values
    valid_statuses = [s.value for s in OrderStatus]
    if status not in valid_statuses:
         raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    order.status = status
    db.commit()
    db.refresh(order)
    return order
