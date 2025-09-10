class CreatePatientAccountController:
    def __init__(self, payload):
        self.payload = payload

    def execute(self):
        return {"message": "Patient account created successfully", "data": self.payload}