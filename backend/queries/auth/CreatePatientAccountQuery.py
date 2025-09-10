from ..QueryBase import QueryBase

class CreatePatientAccountQuery(QueryBase):
    def check_email_exists(self, email):
        query = "SELECT account_id FROM accounts WHERE email = %s"
        result = self.db.execute_query(query, (email,))
        if result:
            return True
        return False
    
    def create_account(self, patient_data: dict):
        query = """
        INSERT INTO accounts (fullname, email, phone_number, date_of_birth, password_hash, profile_picture_url)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING account_id
        """
        response = self.db.execute_query(query, (
            patient_data['fullname'],
            patient_data['email'],
            patient_data['phone_number'],
            patient_data['date_of_birth'],
            patient_data['password_hash'],
            patient_data.get('profile_picture_url', None)
        ))

        if not response or len(response) == 0:
            return None
        return response[0][0]

    def create_patient(self, account_id):
        query = """
        INSERT INTO patients (account_id)
        VALUES (%s)
        RETURNING patient_id
        """
        response = self.db.execute_query(query, (account_id,))
        if not response or len(response) == 0:
            return None
        return response[0][0]