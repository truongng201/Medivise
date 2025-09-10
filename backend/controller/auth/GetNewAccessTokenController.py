class GetNewAccessTokenController:
    def __init__(self, refresh_token):
        self.refresh_token = refresh_token

    def execute(self):
        # Logic to validate the refresh token and generate a new access token
        new_access_token = "new_access_token_based_on_" + self.refresh_token
        return {"access_token": new_access_token}