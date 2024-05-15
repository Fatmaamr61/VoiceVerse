from django.db.models.signals import post_save, pre_delete
# from django.contrib._auth.models import User
from django.dispatch import receiver
from .models import USER, EmailVerification
from .generators import generate_verifyAccount_url, generate_ResetPassword_url
from .emailSender import send_verification_mail, send_passwordreset_verification_mail

from .tasks import send_email_async


# @receiver(post_save, sender=USER)
# def send_verification_email(sender, instance, created, **kwargs):
#     if created:
#         url, key = generate_verifyAccount_url()
#         email_sent = send_verification_mail(instance, url, key)
#         if email_sent:
#             EmailVerification.objects.create(user=instance, key=key)

@receiver(post_save, sender=USER)
def send_verification_email_signal(sender, instance, created, **kwargs):
    if created:
        print(instance)
        result = send_email_async.delay(instance.id)
        print("result: ", result)
