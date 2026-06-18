import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        if settings.SENDGRID_API_KEY:
            self.client = SendGridAPIClient(settings.SENDGRID_API_KEY)
        else:
            self.client = None
            logger.warning("SendGrid API key not set, Email will be logged only")

    def send_email(self, to_email: str, subject: str, body: str):
        if self.client and settings.FROM_EMAIL:
            message = Mail(
                from_email=settings.FROM_EMAIL,
                to_emails=to_email,
                subject=subject,
                plain_text_content=body
            )
            try:
                self.client.send(message)
                logger.info(f"Email sent to {to_email}")
            except Exception as e:
                logger.error(f"Failed to send email to {to_email}: {e}")
        else:
            logger.info(f"SIMULATED Email to {to_email}: Subject: {subject}, Body: {body}")

email_service = EmailService()
