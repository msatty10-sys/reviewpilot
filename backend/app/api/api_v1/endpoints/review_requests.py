from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_review_request import review_request as crud_review_request
from app.schemas.review_request import ReviewRequest, ReviewRequestCreate, ReviewRequestUpdate
from app.models.business import Business as BusinessModel

router = APIRouter()


@router.get("/", response_model=List[ReviewRequest])
def read_review_requests(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Retrieve review requests.
    """
    requests = crud_review_request.get_multi_by_business(
        db, business_id=current_business.id, skip=skip, limit=limit
    )
    return requests


@router.post("/", response_model=ReviewRequest)
def create_review_request(
    *,
    db: Session = Depends(deps.get_db),
    request_in: ReviewRequestCreate,
    current_business: BusinessModel = Depends(deps.get_current_business),
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Create new review request.
    """
    # Verify customer and template belong to this business
    from app.crud.crud_customer import customer as crud_customer
    from app.crud.crud_template import review_template as crud_template
    
    customer = crud_customer.get(db, id=request_in.customer_id)
    if not customer or customer.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Invalid customer_id")
        
    template = crud_template.get(db, id=request_in.template_id)
    if not template or template.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Invalid template_id")

    request = crud_review_request.create_with_business(
        db, obj_in=request_in, business_id=current_business.id
    )
    
    # Trigger background task
    from app.worker import send_review_request_task
    background_tasks.add_task(send_review_request_task, request.id)
    
    return request


@router.get("/{id}", response_model=ReviewRequest)
def read_review_request(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Get review request by ID.
    """
    request = crud_review_request.get(db, id=id)
    if not request:
        raise HTTPException(status_code=404, detail="Review request not found")
    if request.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return request


@router.put("/{id}", response_model=ReviewRequest)
def update_review_request(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    request_in: ReviewRequestUpdate,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Update a review request.
    """
    request = crud_review_request.get(db, id=id)
    if not request:
        raise HTTPException(status_code=404, detail="Review request not found")
    if request.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    request = crud_review_request.update(db, db_obj=request, obj_in=request_in)
    return request


@router.post("/{id}/remind", response_model=ReviewRequest)
def remind_review_request(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_business: BusinessModel = Depends(deps.get_current_business),
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Send a reminder for a review request.
    """
    request = crud_review_request.get(db, id=id)
    if not request:
        raise HTTPException(status_code=404, detail="Review request not found")
    if request.business_id != current_business.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # Trigger background task
    from app.worker import send_review_request_task
    background_tasks.add_task(send_review_request_task, request.id)
    
    return request
