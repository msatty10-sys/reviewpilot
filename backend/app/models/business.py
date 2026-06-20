from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone_number = Column(String)
    google_business_url = Column(String)
    facebook_page_url = Column(String)
    is_active = Column(Boolean(), default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customers = relationship("Customer", back_populates="business")
    review_requests = relationship("ReviewRequest", back_populates="business")
    templates = relationship("ReviewTemplate", back_populates="business")
    subscription = relationship("Subscription", back_populates="business", uselist=False)
