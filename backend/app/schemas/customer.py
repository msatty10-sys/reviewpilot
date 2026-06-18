from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class CustomerBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None

class CustomerCreate(CustomerBase):
    name: str
    business_id: int

class CustomerUpdate(CustomerBase):
    pass

class CustomerInDBBase(CustomerBase):
    id: int
    business_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Customer(CustomerInDBBase):
    pass
