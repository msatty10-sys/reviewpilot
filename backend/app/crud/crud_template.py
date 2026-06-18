from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.review_template import ReviewTemplate
from app.schemas.review_template import ReviewTemplateCreate, ReviewTemplateUpdate


class CRUDReviewTemplate:
    def get(self, db: Session, id: int) -> Optional[ReviewTemplate]:
        return db.query(ReviewTemplate).filter(ReviewTemplate.id == id).first()

    def get_multi_by_business(
        self, db: Session, *, business_id: int, skip: int = 0, limit: int = 100
    ) -> List[ReviewTemplate]:
        return (
            db.query(ReviewTemplate)
            .filter(ReviewTemplate.business_id == business_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_business(
        self, db: Session, *, obj_in: ReviewTemplateCreate, business_id: int
    ) -> ReviewTemplate:
        db_obj = ReviewTemplate(
            name=obj_in.name,
            message_body=obj_in.message_body,
            is_default=obj_in.is_default,
            business_id=business_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: ReviewTemplate, obj_in: ReviewTemplateUpdate
    ) -> ReviewTemplate:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> ReviewTemplate:
        obj = db.query(ReviewTemplate).get(id)
        db.delete(obj)
        db.commit()
        return obj


review_template = CRUDReviewTemplate()
