from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class SubscriptionBase(BaseModel):
    plan_type: Optional[str] = None
    status: Optional[str] = None
    current_period_end: Optional[datetime] = None

class SubscriptionCreate(SubscriptionBase):
    business_id: int
    stripe_subscription_id: str
    plan_type: str
    status: str

class SubscriptionUpdate(SubscriptionBase):
    pass

class SubscriptionInDBBase(SubscriptionBase):
    id: int
    business_id: int
    stripe_subscription_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Subscription(SubscriptionInDBBase):
    pass

class CheckoutSessionCreate(BaseModel):
    plan_type: str
    success_url: str
    cancel_url: str

class CheckoutSession(BaseModel):
    checkout_url: str
