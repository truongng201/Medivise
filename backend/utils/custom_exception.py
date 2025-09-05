class CustomException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message
        self.status_code = 500
        
        
class NotFoundException(CustomException):
    def __init__(self, message: str):
        super().__init__(message)
        self.status_code = 404
        
class BadRequestException(CustomException):
    def __init__(self, message: str):
        super().__init__(message)
        self.status_code = 400
        
class UnauthorizedException(CustomException):
    def __init__(self, message: str):
        super().__init__(message)
        self.status_code = 401

class ForbiddenException(CustomException):
    def __init__(self, message: str):
        super().__init__(message)
        self.status_code = 403
        
class InvalidDataException(CustomException):
    def __init__(self, message: str):
        super().__init__(message)
        self.status_code = 400
        
        
class TokenExpiredException(CustomException):
    def __init__(self, message: str):
        super().__init__(message)
        self.status_code = 401