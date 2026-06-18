from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_review_request import review_request
from app.schemas.analytics import AnalyticsDashboard
from app.models.business import Business as BusinessModel

router = APIRouter()

@router.get("/dashboard", response_model=AnalyticsDashboard)
def get_dashboard_analytics(
    db: Session = Depends(deps.get_db),
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Get dashboard analytics for the current business.
    """
    summary = review_request.get_analytics_summary(db, business_id=current_business.id)
    daily_trends = review_request.get_daily_trends(db, business_id=current_business.id)
    
    return {
        "summary": summary,
        "daily_trends": daily_trends
    }
