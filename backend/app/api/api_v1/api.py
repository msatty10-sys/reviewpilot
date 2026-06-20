from fastapi import APIRouter

from app.api.api_v1.endpoints import businesses, customers, login, review_requests, templates, analytics, subscriptions

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(businesses.router, prefix="/businesses", tags=["businesses"])
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
api_router.include_router(review_requests.router, prefix="/review-requests", tags=["review-requests"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
