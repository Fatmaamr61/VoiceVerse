from django.test import TestCase
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.urls import reverse
from .models import USER, PasswordReset, EmailVerification


class UserModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
        }
        self.user = USER.objects.create_user(**self.user_data)

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertTrue(self.user.check_password('testpassword'))

    def test_user_str(self):
        self.assertEqual(str(self.user), 'testuser')

    def test_verify_account(self):
        self.assertFalse(self.user.email_verified)
        self.assertTrue(self.user.verify_account())
        self.assertTrue(self.user.email_verified)

    def test_change_password(self):
        new_password = 'newpassword'
        self.assertTrue(self.user.change_password(new_password))
        self.assertTrue(self.user.check_password(new_password))

    def test_deactivate_account(self):
        self.assertTrue(self.user.is_active)
        self.assertTrue(self.user.deactivate_account())
        self.assertFalse(self.user.is_active)


class PasswordResetModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
        }
        self.user = USER.objects.create_user(**self.user_data)
        self.password_reset = PasswordReset.objects.create(user=self.user, key='testkey')

    def test_password_reset_creation(self):
        self.assertEqual(self.password_reset.user, self.user)
        self.assertEqual(self.password_reset.key, 'testkey')
        self.assertIsNotNone(self.password_reset.created_at)
        self.assertTrue(timezone.now() < self.password_reset.expires_at)

    # def test_password_reset_absolute_url(self):
    #     url = reverse('password_reset_confirm', kwargs={'key': self.password_reset.key})
    #     print(url)
    #     self.assertEqual(self.password_reset.get_absolute_url(), url)


class EmailVerificationModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
        }
        self.user = USER.objects.create_user(**self.user_data)
        self.email_verification = EmailVerification.objects.create(user=self.user, key='testkey')

    def test_email_verification_creation(self):
        self.assertEqual(self.email_verification.user, self.user)
        self.assertEqual(self.email_verification.key, 'testkey')
        self.assertIsNotNone(self.email_verification.created_at)
        self.assertTrue(timezone.now() < self.email_verification.expires_at)
