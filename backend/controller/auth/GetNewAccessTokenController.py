from utils import InvalidDataException, sign_token, Cache
from queries import GetNewAccessTokenQuery

TOKEN_EXPIRATION_TIME = 60 * 60  # 60 minutes

class GetNewAccessTokenController:
    def __init__(self, refresh_token: str, access_token: str, role: str):
        self.refresh_token = refresh_token
        self.role = role
        self.current_access_token = access_token
        self.response = None
        self.cache = Cache()
        self.query = GetNewAccessTokenQuery()
        self.__validate_data()
    
    def __validate_data(self):
        if not self.refresh_token or not isinstance(self.refresh_token, str):
            self.query.stop()
            raise InvalidDataException("Invalid refresh token.")
        
        if self.role not in ["patient", "doctor"]:
            self.query.stop()
            raise InvalidDataException("Role must be either 'patient' or 'doctor'.")
    
    def __get_new_access_token(self):
        response = self.query.check_refresh_token_exists(self.refresh_token)
        if not response:
            self.query.stop()
            raise InvalidDataException("Refresh token does not exist or is invalid.")
        _, account_id, email = response
        new_access_token = sign_token({
            "account_id": account_id,
            "email": email,
            "role": self.role
        })
        self.cache.set(self.current_access_token, account_id, TOKEN_EXPIRATION_TIME)  # Cache the old access token for 1 hour

        self.query.close()
        self.response = {
            "new_access_token": new_access_token
        }
        
    def execute(self):
        self.__get_new_access_token()
        return self.response