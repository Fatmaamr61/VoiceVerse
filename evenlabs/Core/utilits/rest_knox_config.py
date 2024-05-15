from datetime import timedelta

REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    # 'TOKEN_TTL': timedelta(days=365),
    'TOKEN_TTL': timedelta(minutes=60),
    'USER_SERIALIZER': 'knox.serializers.UserSerializer',
    # 'TOKEN_LIMIT_PER_USER': 2,
    # make token limit per user unlimited
    'TOKEN_LIMIT_PER_USER': None,
    'AUTO_REFRESH': True,
    'MIN_REFRESH_INTERVAL': 1
    # 'EXPIRY_DATETIME_FORMAT': api_settings.DATETME_FORMAT,
}
