class ResetPasswordController:
    def __init__(self, payload):
        self.payload = payload

    def execute(self):
        return {"message": "Password reset successfully", "data": self.payload}