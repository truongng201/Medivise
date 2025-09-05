from pydantic import BaseModel
from typing import Generic, TypeVar, Type

T = TypeVar('T')

class StandardResponse(BaseModel, Generic[T]):
    status: str
    data: T
    message: str