# # CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://*.domain.com",
    "http://localhost:8000",
    "http://localhost",
]


#
# # CSRF settings
CSRF_TRUSTED_ORIGINS = [
    'https://*.domain.com',
    "http://localhost:8000",
    "http://localhost",
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ORIGIN_ALLOW_ALL = True

# Security settings
SECURE_HSTS_SECONDS = 31536000  # 1 year in seconds
# SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
