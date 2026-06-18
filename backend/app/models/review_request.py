from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class ReviewRequest(Base):
    __tablename__ = "review_requests"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    template_id = Column(Integer, ForeignKey("review_templates.id"), nullable=False)
    status = Column(String, default="pending") # pending, sent, opened, clicked, completed
    rating = Column(Integer)
    feedback = Column(String)
    sent_at = Column(DateTime(timezone=True))
    reminded_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="review_requests")
    customer = relationship("Customer", back_populates="review_requests")
    template = relationship("ReviewTemplate", back_populates="review_requests")
