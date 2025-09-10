from fastapi import Security
from fastapi.security.api_key import APIKeyHeader
from .custom_exception import UnauthorizedException
from .token import verify_token
from .logger import logger
from .cache import Cache

# Instantiate APIKeyHeader
api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

def login_required(token: str = Security(api_key_header)):
    """
    Middleware to check if the user is logged in.
    """
    if not token:
        logger.error("No token provided")
        raise UnauthorizedException("You are not authenticated")
    cache = Cache()
    if cache.get(token):
        logger.info("Token is in blacklist")
        raise UnauthorizedException("You are not authenticated")
    
    try:
        account_data = verify_token(token)
        if not account_data or not isinstance(account_data, dict) or "account_id" not in account_data:
            logger.error("Invalid token data")
            raise UnauthorizedException("You are not authenticated")
        return account_data
    except UnauthorizedException as ue:
        raise ue
    except Exception as e:
        logger.error(f"Error verifying token: {e}")
        raise UnauthorizedException("You are not authenticated")
    