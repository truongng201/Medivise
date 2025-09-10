from utils import InvalidDataException, sign_token, Cache
from queries import GetNewAccessTokenQuery

TOKEN_EXPIRATION_TIME = 60 * 60  # 60 minutes

class GetNewAccessTokenController:
    def __init__(self, refresh_token: str, account_info: dict, access_token: str):
        self.refresh_token = refresh_token
        self.account_info = account_info
        self.current_access_token = access_token
        self.response = None
        self.cache = Cache()
        self.query = GetNewAccessTokenQuery()
        self.__validate_data()
    
    def __validate_data(self):
        if not self.refresh_token or not isinstance(self.refresh_token, str):
            self.query.stop()
            raise InvalidDataException("Invalid refresh token.")
    
    def __get_new_access_token(self):
        log_id = self.query.check_refresh_token_exists(self.refresh_token, self.account_info['account_id'])
        if not log_id:
            self.query.stop()
            raise InvalidDataException("Refresh token does not exist or is invalid.")
        
        new_access_token = sign_token(self.account_info)
        self.cache.set(self.current_access_token, self.account_info['account_id'], TOKEN_EXPIRATION_TIME)  # Cache the old access token for 1 hour

        self.query.close()
        self.response = {
            "new_access_token": new_access_token
        }
        
    def execute(self):
        self.__get_new_access_token()
        return self.response