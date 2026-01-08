from app.db.base_class import Base  # noqa

# Import all models here so Alembic can find them
from app.models.user import User  # noqa
from app.models.product import Product  # noqa
from app.models.order import Order, OrderItem  # noqa
from app.models.address import Address  # noqa
