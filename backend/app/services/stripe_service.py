import stripe
from app.core.config import settings
from app.models.subscription import Subscription
from sqlalchemy.orm import Session
from datetime import datetime, timezone

if settings.STRIPE_API_KEY:
    stripe.api_key = settings.STRIPE_API_KEY

class StripeService:
    @staticmethod
    def create_checkout_session(business_id: int, plan_type: str, success_url: str, cancel_url: str):
        prices = {
            "starter": settings.STRIPE_PRICE_STARTER,
            "growth": settings.STRIPE_PRICE_GROWTH,
            "pro": settings.STRIPE_PRICE_PRO
        }
        price_id = prices.get(plan_type)
        if not price_id:
            raise ValueError("Invalid plan type")

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=cancel_url,
            client_reference_id=str(business_id),
            metadata={"business_id": str(business_id), "plan_type": plan_type}
        )
        return checkout_session

    @staticmethod
    def handle_checkout_session_completed(db: Session, session: stripe.checkout.Session):
        business_id = int(session.metadata.get("business_id"))
        plan_type = session.metadata.get("plan_type")
        stripe_subscription_id = session.subscription
        stripe_customer_id = session.customer

        subscription = stripe.Subscription.retrieve(stripe_subscription_id)

        db_sub = db.query(Subscription).filter(Subscription.business_id == business_id).first()
        if not db_sub:
            db_sub = Subscription(business_id=business_id)
            db.add(db_sub)

        db_sub.stripe_customer_id = stripe_customer_id
        db_sub.stripe_subscription_id = stripe_subscription_id
        db_sub.plan_type = plan_type
        db_sub.status = subscription.status
        db_sub.current_period_end = datetime.fromtimestamp(subscription.current_period_end, tz=timezone.utc)
        db.commit()

stripe_service = StripeService()