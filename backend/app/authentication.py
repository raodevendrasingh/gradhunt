import logging
from django.contrib.auth.models import AnonymousUser
from rest_framework import authentication
from rest_framework import exceptions
from jose import jwt, JWTError
from django.conf import settings
from .models import UserDetails

logger = logging.getLogger(__name__)


class ClerkAnonymousUser(AnonymousUser):
    def __init__(self, clerk_user_id):
        super().__init__()
        self.clerk_user_id = clerk_user_id


class ClerkJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            auth_type, token = auth_header.split()
            if auth_type.lower() != 'bearer':
                return None

            if not settings.CLERK_PUBLIC_KEY:
                logger.error("CLERK_PUBLIC_KEY is not set in settings")
                raise exceptions.AuthenticationFailed(
                    'Server configuration error')

            try:
                payload = jwt.decode(
                    token,
                    settings.CLERK_PUBLIC_KEY,
                    algorithms=['RS256'],
                    audience=settings.CLERK_JWT_AUDIENCE,
                    issuer=settings.CLERK_JWT_ISSUER
                )
            except TypeError as type_error:
                logger.error(f"TypeError in jwt.decode: {str(type_error)}")
                payload = jwt.decode(
                    token,
                    key=settings.CLERK_PUBLIC_KEY,
                    algorithms=['RS256'],
                    audience=settings.CLERK_JWT_AUDIENCE,
                    issuer=settings.CLERK_JWT_ISSUER
                )

            clerk_user_id = payload['sub']

            user = UserDetails.objects.filter(
                clerk_user_id=clerk_user_id).first()

            if user:
                return (user, None)
            else:
                clerk_anonymous_user = ClerkAnonymousUser(clerk_user_id)
                return (clerk_anonymous_user, None)

        except JWTError as e:
            logger.error(f"JWT Error: {str(e)}")
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
        except Exception as e:
            logger.error(f"Authentication failed: {str(e)}")
            raise exceptions.AuthenticationFailed(
                f'Authentication failed: {str(e)}')
