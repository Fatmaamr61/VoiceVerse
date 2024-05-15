from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate
from django.contrib import messages
from django.conf import settings

from .models import USER

from .models import EmailVerification
from .generators import generate_verifyAccount_url, make_password, generate_username
from .emailSender import send_verification_mail
from django.contrib.auth.password_validation import validate_password


class AdvancedLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Customize authentication_form field labels
        self.fields['username'].label = 'Username or Email'
        self.fields['password'].label = 'Password'

        self.fields['username'].widget.attrs.update(
            {'class': 'authentication_form-control', 'placeholder': 'Username or Email', 'required': 'required'})
        self.fields['password'].widget.attrs.update(
            {'class': 'authentication_form-control', 'placeholder': 'Password', 'required': 'required'})

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        if username and password:
            # Authenticate user with both username and email
            user = authenticate(username=username, password=password)

            if user is None:
                # Raise a validation error for invalid credentials
                raise forms.ValidationError('Invalid username/email or password.')

        return cleaned_data


class UserSignupForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super().__init__(*args, **kwargs)

    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}),
                               label='Password')

    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}),
                                       label='Confirm password')

    class Meta:
        model = USER
        fields = ('username', 'email', 'first_name', 'last_name',
                  'phone', 'password', 'confirm_password')

        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True}
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password != confirm_password:
            # Raise a validation error for password mismatch
            raise forms.ValidationError('Passwords do not match.')

        return cleaned_data

    def clean_password(self):
        password = self.cleaned_data['password']

        validate_password(password)
        return password

    def save(self, commit=True):
        request = self.request
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        user.save()

        # Send verification email
        url, key = generate_verifyAccount_url(request=request)
        email_sent = send_verification_mail(user, url, key)
        if email_sent:
            EmailVerification.objects.create(user=user, key=key)

        return user
