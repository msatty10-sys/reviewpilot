from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_business import business as crud_business
from app.schemas.business import Business, BusinessUpdate
from app.models.business import Business as BusinessModel

router = APIRouter()


@router.get("/me", response_model=Business)
def read_business_me(
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Get current business.
    """
    return current_business


@router.put("/me", response_model=Business)
def update_business_me(
    *,
    db: Session = Depends(deps.get_db),
    business_in: BusinessUpdate,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Update own business.
    """
    business = crud_business.update(db, db_obj=current_business, obj_in=business_in)
    return business
