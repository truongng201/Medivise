import traceback
import inspect
from typing import TypeVar, Callable
from functools import wraps

from .response_model import StandardResponse
from .custom_exception import CustomException
from .logger import logger

T = TypeVar('T')

def standard_response(func: Callable[..., T]) -> Callable[..., StandardResponse[T]]:
    @wraps(func)
    async def async_wrapper(*args, **kwargs) -> StandardResponse[T]:
        try:
            result = func(*args, **kwargs)
            return StandardResponse[T](
                status="success",
                data=result,
                message="Operation completed successfully"
            )
        except CustomException as ce:
            raise ce
        except Exception as e:
            logger.error(f"An error occurred: {str(traceback.format_exc())}")
            raise CustomException(f"An error occurred: {str(e)}")
        
    @wraps(func)
    def sync_wrapper(*args, **kwargs) -> StandardResponse[T]:
        try:
            result = func(*args, **kwargs)
            return StandardResponse[T](
                status="success",
                data=result,
                message="Operation completed successfully"
            )
        except CustomException as ce:
            raise ce
        except Exception as e:
            logger.error(f"An error occurred: {str(traceback.format_exc())}")
            raise CustomException(f"An error occurred: {str(e)}")
    
            
    if inspect.iscoroutinefunction(func):
        return async_wrapper
    return sync_wrapper