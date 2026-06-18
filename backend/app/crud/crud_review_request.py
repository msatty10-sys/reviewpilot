from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.review_request import ReviewRequest
from app.schemas.review_request import ReviewRequestCreate, ReviewRequestUpdate


class CRUDReviewRequest:
    def get(self, db: Session, id: int) -> Optional[ReviewRequest]:
        return db.query(ReviewRequest).filter(ReviewRequest.id == id).first()

    def get_multi_by_business(
        self, db: Session, *, business_id: int, skip: int = 0, limit: int = 100
    ) -> List[ReviewRequest]:
        return (
            db.query(ReviewRequest)
            .filter(ReviewRequest.business_id == business_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_business(
        self, db: Session, *, obj_in: ReviewRequestCreate, business_id: int
    ) -> ReviewRequest:
        db_obj = ReviewRequest(
            customer_id=obj_in.customer_id,
            template_id=obj_in.template_id,
            business_id=business_id,
            status="pending",
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: ReviewRequest, obj_in: ReviewRequestUpdate
    ) -> ReviewRequest:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_analytics_summary(self, db: Session, *, business_id: int) -> dict:
        from sqlalchemy import func
        
        counts = db.query(
            ReviewRequest.status, 
            func.count(ReviewRequest.id)
        ).filter(
            ReviewRequest.business_id == business_id
        ).group_by(ReviewRequest.status).all()
        
        summary = {
            "total_requests": 0,
            "sent_requests": 0,
            "opened_requests": 0,
            "clicked_requests": 0,
            "completed_requests": 0,
        }
        
        status_map = {
            "pending": "total_requests", # or we just sum all
            "sent": "sent_requests",
            "opened": "opened_requests",
            "clicked": "clicked_requests",
            "completed": "completed_requests"
        }
        
        total = 0
        for status, count in counts:
            total += count
            if status in status_map:
                summary[status_map[status]] = count
        
        summary["total_requests"] = total
        
        # Calculate conversion rate (completed / total_sent)
        sent_total = summary["sent_requests"] + summary["opened_requests"] + summary["clicked_requests"] + summary["completed_requests"]
        summary["conversion_rate"] = (summary["completed_requests"] / sent_total * 100) if sent_total > 0 else 0
        
        return summary

    def get_daily_trends(self, db: Session, *, business_id: int, days: int = 30) -> List[dict]:
        from sqlalchemy import func, desc
        from datetime import datetime, timedelta, timezone
        
        since_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        trends = db.query(
            func.date(ReviewRequest.created_at).label("date"),
            func.count(ReviewRequest.id).label("count")
        ).filter(
            ReviewRequest.business_id == business_id,
            ReviewRequest.created_at >= since_date
        ).group_by(
            func.date(ReviewRequest.created_at)
        ).order_by(
            func.date(ReviewRequest.created_at)
        ).all()
        
        return [{"date": t.date, "count": t.count} for t in trends]


review_request = CRUDReviewRequest()
