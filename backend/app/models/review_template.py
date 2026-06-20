from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class ReviewTemplate(Base):
    __tablename__ = "review_templates"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    name = Column(String)
    message_body = Column(Text)
    is_default = Column(Boolean, default=False)

    business = relationship("Business", back_populates="templates")
    review_requests = relationship("ReviewRequest", back_populates="template")
