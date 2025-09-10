class CreateDoctorAccountController:
    def __init__(self, payload):
        self.payload = payload

    def execute(self):
        return {"message": "Doctor account created successfully", "data": self.payload}