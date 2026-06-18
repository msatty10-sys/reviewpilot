from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ReviewTemplateBase(BaseModel):
    name: Optional[str] = None
    message_body: Optional[str] = None
    is_default: Optional[bool] = False

class ReviewTemplateCreate(ReviewTemplateBase):
    name: str
    message_body: str
    business_id: int

class ReviewTemplateUpdate(ReviewTemplateBase):
    pass

class ReviewTemplateInDBBase(ReviewTemplateBase):
    id: int
    business_id: int

    model_config = ConfigDict(from_attributes=True)

class ReviewTemplate(ReviewTemplateInDBBase):
    pass
