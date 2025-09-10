from utils import InvalidDataException, ServerErrorException, Cache
from models import LogoutModel
from queries import LogoutQuery

TOKEN_EXPIRATION_TIME = 60 * 60  # 60 minutes

class LogoutController:
    def __init__(self, payload: LogoutModel, account_info, access_token: str):
        self.payload = payload
        self.account_info = account_info
        self.access_token = access_token
        self.query = LogoutQuery()
        self.cache = Cache()
        self.__validate_data()
        
    def __validate_data(self):
        if not self.payload.refresh_token:
            raise InvalidDataException("Refresh token must be provided")
        
        if not self.account_info or "account_id" not in self.account_info:
            raise InvalidDataException("Invalid account information")
        
    def __logout(self):
        log_id = self.query.check_refresh_token_exists(self.account_info["account_id"], self.payload.refresh_token)
        if not log_id:
            self.query.stop()
            raise InvalidDataException("Refresh token does not exist or is already invalidated")
        
        if not self.query.delete_refresh_token(log_id):
            self.query.stop()
            raise ServerErrorException("Failed to invalidate refresh token")
        
        # Blacklist the access token
        try:
            self.cache.set(self.access_token, self.account_info["account_id"], TOKEN_EXPIRATION_TIME)
        except Exception as e:
            self.query.stop()
            raise ServerErrorException("Failed to blacklist access token")

        self.query.close()


    def execute(self):
        self.__logout()
        return "Logout successful"