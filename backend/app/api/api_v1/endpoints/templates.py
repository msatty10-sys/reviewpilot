from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_template import review_template as crud_template
from app.schemas.review_template import ReviewTemplate, ReviewTemplateCreate, ReviewTemplateUpdate
from app.models.business import Business as BusinessModel

router = APIRouter()


@router.get("/", response_model=List[ReviewTemplate])
def read_templates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Retrieve templates.
    """
    templates = crud_template.get_multi_by_business(
        db, business_id=current_business.id, skip=skip, limit=limit
    )
    return templates


@router.post("/", response_model=ReviewTemplate)
def create_template(
    *,
    db: Session = Depends(deps.get_db),
    template_in: ReviewTemplateCreate,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Create new template.
    """
    template = crud_template.create_with_business(
        db, obj_in=template_in, business_id=current_business.id
    )
    return template


@router.get("/{id}", response_model=ReviewTemplate)
def read_template(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Get template by ID.
    """
    template = crud_template.get(db, id=id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    if template.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return template


@router.put("/{id}", response_model=ReviewTemplate)
def update_template(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    template_in: ReviewTemplateUpdate,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Update a template.
    """
    template = crud_template.get(db, id=id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    if template.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    template = crud_template.update(db, db_obj=template, obj_in=template_in)
    return template


@router.delete("/{id}", response_model=ReviewTemplate)
def delete_template(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Delete a template.
    """
    template = crud_template.get(db, id=id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    if template.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    template = crud_template.remove(db, id=id)
    return template
