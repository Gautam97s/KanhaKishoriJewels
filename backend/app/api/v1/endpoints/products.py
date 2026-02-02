from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.api import deps
from app.models.product import Product
from app.schemas.product import Product as ProductSchema, ProductCreate, ProductUpdate
import uuid
import re

router = APIRouter()

def create_slug(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug

@router.get("/", response_model=List[ProductSchema])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None
) -> Any:
    """
    Retrieve products.
    """
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{slug}", response_model=ProductSchema)
def read_product_by_slug(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get product by slug.
    """
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        # Try ID if not slug, for flexibility
        product = db.query(Product).filter(Product.id == slug).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductSchema)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: ProductCreate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new product.
    """
    # Check if slug exists, if not generate from name
    slug = product_in.slug
    if not slug:
        slug = create_slug(product_in.name)
        
    # Ensure slug is unique
    if db.query(Product).filter(Product.slug == slug).first():
        raise HTTPException(
            status_code=400,
            detail="The product with this slug already exists",
        )

    product = Product(
        name=product_in.name,
        slug=slug,
        description=product_in.description,
        price=product_in.price,
        image_url=product_in.image_url,
        category=product_in.category,
        stock=product_in.stock,
        is_featured=product_in.is_featured,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{slug}", response_model=ProductSchema)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
    product_in: ProductUpdate,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a product.
    """
    product = db.query(Product).filter(Product.slug == slug).first()
    # Fallback to ID check if slug not found (since we use ID as slug sometimes)
    if not product:
         product = db.query(Product).filter(Product.id == slug).first()
         
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.add(product)
    db.commit()
    db.refresh(product)
    return product

from sqlalchemy.exc import IntegrityError

@router.delete("/{slug}", response_model=ProductSchema)
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a product.
    """
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
         product = db.query(Product).filter(Product.id == slug).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        db.delete(product)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete this product because it is part of existing orders. Please mark it as 'Out of Stock' instead."
        )
    return product
