from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_customer import customer as crud_customer
from app.schemas.customer import Customer, CustomerCreate, CustomerUpdate
from app.models.business import Business as BusinessModel

router = APIRouter()


@router.get("/", response_model=List[Customer])
def read_customers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Retrieve customers.
    """
    customers = crud_customer.get_multi_by_business(
        db, business_id=current_business.id, skip=skip, limit=limit
    )
    return customers


@router.post("/", response_model=Customer)
def create_customer(
    *,
    db: Session = Depends(deps.get_db),
    customer_in: CustomerCreate,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Create new customer.
    """
    customer = crud_customer.create_with_business(
        db, obj_in=customer_in, business_id=current_business.id
    )
    return customer


@router.get("/{id}", response_model=Customer)
def read_customer(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Get customer by ID.
    """
    customer = crud_customer.get(db, id=id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if customer.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return customer


@router.put("/{id}", response_model=Customer)
def update_customer(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    customer_in: CustomerUpdate,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Update a customer.
    """
    customer = crud_customer.get(db, id=id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if customer.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    customer = crud_customer.update(db, db_obj=customer, obj_in=customer_in)
    return customer


@router.delete("/{id}", response_model=Customer)
def delete_customer(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Delete a customer.
    """
    customer = crud_customer.get(db, id=id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if customer.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    customer = crud_customer.remove(db, id=id)
    return customer
