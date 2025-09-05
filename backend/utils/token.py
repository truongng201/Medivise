import jwt
import os
from datetime import datetime, timedelta, timezone
from .logger import logger
from .custom_exception import UnauthorizedException


SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_secret_key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def sign_token(payload, expires_in: int = 3600) -> str:
    """
    Sign a JWT token with the given payload.
    :param payload: The payload to include in the token.
    :param expires_in: Expiration time in seconds (default is 3600 seconds).
    :return: The signed JWT token.
    """
    # Set the expiration time
    try:
        payload['exp'] = datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return token
    except Exception as e:
        logger.error(f"Error signing JWT: {e}")
        raise Exception("Something went wrong")
    
    
def verify_token(token: str):
    """
    Verify a JWT token and return the payload.
    :param token: The JWT token to verify.
    :return: The payload if the token is valid, otherwise None.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise UnauthorizedException("Token has expired")
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        raise UnauthorizedException("You are not authenticated")
    except Exception as e:
        logger.error(f"Error verifying JWT: {e}")
        raise Exception("Something went wrong")