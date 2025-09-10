class ResetPasswordController:
    def __init__(self, payload):
        self.payload = payload
        self.response = None

    def execute(self):
        return self.response