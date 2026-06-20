import logging
from twilio.rest import Client
from app.core.config import settings

logger = logging.getLogger(__name__)

class SMSService:
    def __init__(self):
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        else:
            self.client = None
            logger.warning("Twilio credentials not set, SMS will be logged only")

    def send_sms(self, to_number: str, message: str):
        if self.client and settings.TWILIO_PHONE_NUMBER:
            try:
                self.client.messages.create(
                    body=message,
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=to_number
                )
                logger.info(f"SMS sent to {to_number}")
            except Exception as e:
                logger.error(f"Failed to send SMS to {to_number}: {e}")
        else:
            logger.info(f"SIMULATED SMS to {to_number}: {message}")

sms_service = SMSService()
