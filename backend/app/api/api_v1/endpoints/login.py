from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.crud.crud_business import business as crud_business
from app.schemas.token import Token
from app.schemas.business import Business, BusinessCreate

router = APIRouter()


@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    business = crud_business.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not business:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not business.is_active:
        raise HTTPException(status_code=400, detail="Inactive business")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            business.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/register", response_model=Business)
def register_business(
    *,
    db: Session = Depends(deps.get_db),
    business_in: BusinessCreate,
) -> Any:
    """
    Register a new business.
    """
    business = crud_business.get_by_email(db, email=business_in.email)
    if business:
        raise HTTPException(
            status_code=400,
            detail="The business with this email already exists in the system.",
        )
    business = crud_business.create(db, obj_in=business_in)
    return business


@router.post("/login/refresh-token", response_model=Token)
def refresh_token(
    current_business: Business = Depends(deps.get_current_business),
) -> Any:
    """
    Refresh access token
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            current_business.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
