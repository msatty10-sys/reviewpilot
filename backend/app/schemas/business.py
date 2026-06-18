from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class BusinessBase(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    google_business_url: Optional[str] = None
    facebook_page_url: Optional[str] = None
    is_active: Optional[bool] = True

class BusinessCreate(BusinessBase):
    name: str
    email: EmailStr
    password: str

class BusinessUpdate(BusinessBase):
    password: Optional[str] = None

class BusinessInDBBase(BusinessBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class Business(BusinessInDBBase):
    pass

class BusinessInDB(BusinessInDBBase):
    hashed_password: str
