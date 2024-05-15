import secrets
import urllib.parse
from django.conf import settings

UNUSABLE_PASSWORD_PREFIX = "!"  # This will never be a valid encoded hash
UNUSABLE_PASSWORD_SUFFIX_LENGTH = (
    8  # number of random chars to add after UNUSABLE_PASSWORD_PREFIX
)
RANDOM_STRING_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

BASE_URL = settings.BASE_URL


def generate_key():
    return secrets.token_urlsafe(16)


def generate_verifyAccount_url_signal():
    key = generate_key()
    url = f"{BASE_URL}api/auth/users/{urllib.parse.quote(key)}/verifyAccount/"
    return url, key


def generate_ResetPassword_url_signal(request):
    key = generate_key()
    url = f"{BASE_URL}api/auth/password-reset/{urllib.parse.quote(key)}/confirm/"
    return url, key


def generate_verifyAccount_url(request):
    key = generate_key()
    url = request.build_absolute_uri(f"/api/auth/users/{urllib.parse.quote(key)}/verifyAccount/")
    return url, key


def generate_ResetPassword_url(request):
    key = generate_key()
    url = request.build_absolute_uri(f"/api/auth/password-reset/{urllib.parse.quote(key)}/confirm/")
    return url, key


def get_random_string(length, allowed_chars=RANDOM_STRING_CHARS):
    """
    Return a securely generated random string.

    The bit length of the returned value can be calculated with the formula:
        log_2(len(allowed_chars)^length)

    For example, with default `allowed_chars` (26+26+10), this gives:
      * length: 12, bit length =~ 71 bits
      * length: 22, bit length =~ 131 bits
    """
    return "".join(secrets.choice(allowed_chars) for i in range(length))


def make_password(password, salt=None, hasher="default"):
    """
    Turn a plain-text password into a hash for database storage

    Same as encode() but generate a new random salt. If password is None then
    return a concatenation of UNUSABLE_PASSWORD_PREFIX and a random string,
    which disallows logins. Additional random string reduces chances of gaining
    access to staff or superuser accounts. See ticket #20079 for more info.
    """
    if password is None:
        return UNUSABLE_PASSWORD_PREFIX + get_random_string(UNUSABLE_PASSWORD_SUFFIX_LENGTH)
    if not isinstance(password, (bytes, str)):
        raise TypeError(
            "Password must be a string or bytes, got %s." % type(password).__qualname__
        )
    hasher = settings.PASSWORD_HASHERS[0]
    salt = salt or hasher.salt()
    return hasher.encode(password, salt)


def generate_tagID():
    tagID = secrets.randbelow(9999)
    return tagID


def generate_username(first_name, last_name, tagID=generate_tagID()):
    username = f"{first_name}_{last_name}#{tagID}"
    return username
