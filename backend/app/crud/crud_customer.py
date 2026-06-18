from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


class CRUDCustomer:
    def get(self, db: Session, id: int) -> Optional[Customer]:
        return db.query(Customer).filter(Customer.id == id).first()

    def get_multi_by_business(
        self, db: Session, *, business_id: int, skip: int = 0, limit: int = 100
    ) -> List[Customer]:
        return (
            db.query(Customer)
            .filter(Customer.business_id == business_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_business(
        self, db: Session, *, obj_in: CustomerCreate, business_id: int
    ) -> Customer:
        db_obj = Customer(
            name=obj_in.name,
            email=obj_in.email,
            phone_number=obj_in.phone_number,
            business_id=business_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Customer, obj_in: CustomerUpdate
    ) -> Customer:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> Customer:
        obj = db.query(Customer).get(id)
        db.delete(obj)
        db.commit()
        return obj


customer = CRUDCustomer()
