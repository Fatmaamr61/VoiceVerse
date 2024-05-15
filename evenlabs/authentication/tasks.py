from celery import shared_task
from django.conf import settings
from .models import EmailVerification, USER
from .emailSender import send_verification_mail
from .generators import generate_verifyAccount_url_signal


# def send_sms_async(identifier: int):
#     code = PhoneCode.objects.filter(pk=identifier).first()
#     if code:
#         provider: SMSProviderBase = Test()
#         provider.send_private_sms(code.phone, code.code)

@shared_task
def send_email_async(instance, **kwargs):
    print("send_email_async")
    url, key = generate_verifyAccount_url_signal()
    user = USER.objects.get(pk=instance)
    email_sent = send_verification_mail(user, url, key)

    if email_sent:
        EmailVerification.objects.create(user=user, key=key)
