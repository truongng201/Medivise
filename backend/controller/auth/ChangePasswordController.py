class ChangePasswordController:
    def __init__(self, payload, account_info):
        self.payload = payload
        self.account_info = account_info

    def execute(self):
        return {"message": "Password changed successfully", "data": self.payload}