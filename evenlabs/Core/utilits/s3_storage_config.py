import os
from dotenv import load_dotenv

load_dotenv()

# AWS S3 settings
# S3 Storage Configurations
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID', None)
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY', None)
AWS_STORAGE_BUCKET_NAME = "voice-verse-bucket"  # enter your s3 bucket name
AWS_S3_CUSTOM_DOMAIN = "%s.s3.amazonaws.com" % AWS_STORAGE_BUCKET_NAME
AWS_DEFAULT_ACL = None
AWS_S3_OBJECT_PARAMETERS = {
    "CacheControl": "max-age=86400",
}
AWS_S3_REGION_NAME = "us-east-1"  # put your region
AWS_S3_SIGNATURE_VERSION = "s3v4"
# AWS_LOCATION = ""
S3_URL = "https://%s" % AWS_S3_CUSTOM_DOMAIN

# public media settings
PUBLIC_MEDIA_LOCATION = "media"
DEFAULT_FILE_STORAGE = "Core.storage_backends.PublicMediaStorage"
MEDIA_DIRECTORY = "/media/"
MEDIA_URL = S3_URL + MEDIA_DIRECTORY

# private media settings
PRIVATE_MEDIA_LOCATION = "private"
PRIVATE_FILE_STORAGE = "Core.storage_backends.PrivateMediaStorage"
