from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), unique=True, nullable=False)
    stripe_customer_id = Column(String, index=True)
    stripe_subscription_id = Column(String, index=True)
    plan_type = Column(String) # starter, growth, pro
    status = Column(String) # active, trialing, canceled, past_due
    current_period_end = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="subscription")
