from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import stripe

from app.api import deps
from app.core.config import settings
from app.services.stripe_service import stripe_service
from app.schemas.subscription import Subscription, CheckoutSessionCreate, CheckoutSession
from app.models.business import Business as BusinessModel
from app.models.subscription import Subscription as SubscriptionModel

router = APIRouter()

@router.post("/create-checkout-session", response_model=CheckoutSession)
def create_checkout_session(
    *,
    db: Session = Depends(deps.get_db),
    session_in: CheckoutSessionCreate,
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Create a Stripe checkout session for subscription.
    """
    try:
        checkout_session = stripe_service.create_checkout_session(
            business_id=current_business.id,
            plan_type=session_in.plan_type,
            success_url=session_in.success_url,
            cancel_url=session_in.cancel_url
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=Subscription)
def read_subscription(
    db: Session = Depends(deps.get_db),
    current_business: BusinessModel = Depends(deps.get_current_business),
) -> Any:
    """
    Get the current business's subscription.
    """
    subscription = db.query(SubscriptionModel).filter(SubscriptionModel.business_id == current_business.id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(deps.get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=400, detail="Webhook secret not set")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event.type == "checkout.session.completed":
        session = event.data.object
        stripe_service.handle_checkout_session_completed(db, session)

    return {"status": "success"}
