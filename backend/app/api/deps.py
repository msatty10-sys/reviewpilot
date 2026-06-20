from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import ALGORITHM
from app.crud.crud_business import business as crud_business
from app.db.session import SessionLocal
from app.models.business import Business
from app.schemas.token import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_business(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> Business:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_0403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    business = crud_business.get(db, id=token_data.sub)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business
