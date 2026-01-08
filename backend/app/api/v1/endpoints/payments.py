import razorpay
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from typing import Any
import json
import uuid

from app.api import deps
from app.core.config import settings
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.schemas.order import OrderCreate

router = APIRouter()

# Initialize Razorpay Client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/create-order")
def create_payment_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: OrderCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new order and initiate Razorpay payment.
    """
    # 1. Calculate Amount & Verify Products
    total_amount = 0.0
    db_items = []
    
    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        # Check stock logic here if needed
        
        total_amount += product.price * item.quantity
        db_items.append({
            "product": product,
            "quantity": item.quantity,
            "price": product.price
        })

    # 2. Create DB Order (Pending)
    order = Order(
        user_id=current_user.id,
        status=OrderStatus.PENDING.value,
        total_amount=total_amount,
        shipping_address=order_in.shipping_address,
        payment_status="pending"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # 3. Create Order Items
    for item_data in db_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            price_at_purchase=item_data["price"]
        )
        db.add(order_item)
    db.commit()

    # 4. Create Razorpay Order
    # Amount is in paisa (cents)
    amount_in_paisa = int(total_amount * 100)
    
    try:
        razorpay_order = client.order.create({
            "amount": amount_in_paisa,
            "currency": "INR",
            "receipt": order.id,
            "payment_capture": 1 # Auto capture
        })
    except Exception as e:
        # If Razorpay fails, maybe mark order as failed or delete it?
        # For now, just raise
        raise HTTPException(status_code=500, detail=f"Razorpay Error: {str(e)}")

    # 5. Update Order with Razorpay Order ID
    order.razorpay_order_id = razorpay_order['id']
    db.commit()

    return {
        "order_id": order.id,
        "razorpay_order_id": razorpay_order['id'],
        "amount": total_amount,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID
    }


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
    x_razorpay_signature: str = Header(None)
):
    """
    Handle Razorpay Webhooks (payment.captured, order.paid)
    """
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing Signature")

    body_bytes = await request.body()
    body_str = body_bytes.decode('utf-8')

    # Verify Signature
    try:
        client.utility.verify_webhook_signature(
            body_str,
            x_razorpay_signature,
            settings.RAZORPAY_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Signature")

    event = json.loads(body_str)
    
    # Handle 'payment.captured' or 'order.paid'
    if event['event'] == 'payment.captured':
        payment_entity = event['payload']['payment']['entity']
        razorpay_order_id = payment_entity['order_id']
        razorpay_payment_id = payment_entity['id']
        
        # Find Order
        order = db.query(Order).filter(Order.razorpay_order_id == razorpay_order_id).first()
        if order:
            order.status = OrderStatus.PAID.value
            order.payment_status = "captured"
            order.razorpay_payment_id = razorpay_payment_id
            db.commit()
            print(f"Order {order.id} marked as PAID via webhook")
        else:
            print(f"Order not found for Razorpay Order ID: {razorpay_order_id}")

    return {"status": "ok"}
