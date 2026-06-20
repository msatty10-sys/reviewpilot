import os
from app.core.config import settings

def send_review_request_task(request_id: int):
    print(f"DEBUG: Entering send_review_request_task for {request_id}")
    from app.db.session import SessionLocal
    from app.crud.crud_review_request import review_request as crud_review_request
    from app.services.sms import sms_service
    from app.services.email import email_service
    
    db = SessionLocal()
    request = crud_review_request.get(db, id=request_id)
    if not request:
        return f"Request {request_id} not found"
    
    # customer and template were validated at endpoint level
    business = request.business
    customer = request.customer
    template = request.template
    
    # Simple link generation logic (placeholder)
    # In a real app, this would be a short URL pointing to the frontend review landing page
    review_link = f"http://localhost:3000/review/{request.id}"
    
    # Replace variables in template
    message = template.message_body
    if "{name}" in message:
        message = message.replace("{name}", customer.name)
    if "{link}" in message:
        message = message.replace("{link}", review_link)
    
    # Send via SMS if phone exists
    if customer.phone_number:
        sms_service.send_sms(customer.phone_number, message)
        
    # Send via Email if email exists
    if customer.email:
        email_service.send_email(customer.email, f"Review Request from {business.name}", message)
        
    # Update status
    from datetime import datetime, timezone
    from app.schemas.review_request import ReviewRequestUpdate
    
    crud_review_request.update(
        db, 
        db_obj=request, 
        obj_in=ReviewRequestUpdate(status="sent", sent_at=datetime.now(timezone.utc))
    )
    db.close()
    return f"Sent request {request_id}"
