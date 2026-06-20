from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate


class CRUDBusiness:
    def get(self, db: Session, id: Any) -> Optional[Business]:
        return db.query(Business).filter(Business.id == id).first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[Business]:
        return db.query(Business).filter(Business.email == email).first()

    def create(self, db: Session, *, obj_in: BusinessCreate) -> Business:
        db_obj = Business(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            name=obj_in.name,
            phone_number=obj_in.phone_number,
            google_business_url=obj_in.google_business_url,
            facebook_page_url=obj_in.facebook_page_url,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Business, obj_in: Union[BusinessUpdate, Dict[str, Any]]
    ) -> Business:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(
        self, db: Session, *, email: str, password: str
    ) -> Optional[Business]:
        business = self.get_by_email(db, email=email)
        if not business:
            return None
        if not verify_password(password, business.hashed_password):
            return None
        return business


business = CRUDBusiness()
