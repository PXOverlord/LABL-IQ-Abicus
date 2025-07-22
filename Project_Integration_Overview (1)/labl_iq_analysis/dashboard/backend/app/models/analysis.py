from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(Integer, ForeignKey("users.id"))
    upload_id = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    total_shipments = Column(Integer, default=0)
    total_cost = Column(Float, default=0.0)
    potential_savings = Column(Float, default=0.0)
    avg_savings_per_shipment = Column(Float, default=0.0)
    status = Column(String, default="processing")  # processing, completed, failed
    results = Column(JSON, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="analyses")

# Add to User model
from app.models.user import User
User.analyses = relationship("Analysis", back_populates="user")