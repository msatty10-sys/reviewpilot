from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ReviewRequestBase(BaseModel):
    customer_id: Optional[int] = None
    template_id: Optional[int] = None
    status: Optional[str] = "pending"

class ReviewRequestCreate(ReviewRequestBase):
    customer_id: int
    template_id: int
    business_id: int

class ReviewRequestUpdate(ReviewRequestBase):
    status: Optional[str] = None
    sent_at: Optional[datetime] = None
    reminded_at: Optional[datetime] = None

class ReviewRequestInDBBase(ReviewRequestBase):
    id: int
    business_id: int
    created_at: datetime
    sent_at: Optional[datetime] = None
    reminded_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ReviewRequest(ReviewRequestInDBBase):
    pass
