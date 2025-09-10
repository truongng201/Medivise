from ..QueryBase import QueryBase

class CreateDoctorAccountQuery(QueryBase):
    def check_email_exists(self, email):
        query = "SELECT 1 FROM accounts WHERE email = %s"
        response = self.db.execute_query(query, (email,))
        if response and len(response) > 0:
            return True
        return False
    
    def check_medical_license_exists(self, medical_license_number):
        query = "SELECT 1 FROM doctors WHERE medical_license_number = %s"
        response = self.db.execute_query(query, (medical_license_number,))
        if response and len(response) > 0:
            return True
        return False

    def create_account(self, payload):
        query = """
        INSERT INTO accounts (fullname, email, phone_number, profile_picture_url, password_hash)
        VALUES (%s, %s, %s, %s, %s) 
        RETURNING account_id
        """
        values = (
            payload['fullname'],
            payload['email'],
            payload['phone_number'],
            payload['profile_picture_url'],
            payload['password_hash']
        )
        response = self.db.execute_query(query, values)
        if not response or len(response) == 0:
            return None
        return response[0][0]

    def create_doctor(self, account_id, payload):
        query = """
        INSERT INTO doctors (account_id, medical_specialty, medical_license_number, years_of_experience, medical_education, clinic_or_hospital_address)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING doctor_id
        """
        values = (
            account_id, 
            payload['medical_specialty'], 
            payload['medical_license_number'], 
            payload['years_of_experience'], 
            payload['medical_education'], 
            payload['clinic_or_hospital_address']
        )
        response = self.db.execute_query(query, values)
        if not response or len(response) == 0:
            return None
        return response[0][0]