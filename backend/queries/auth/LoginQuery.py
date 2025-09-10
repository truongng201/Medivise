from ..QueryBase import QueryBase

class LoginQuery(QueryBase):
    def get_account_by_email(self, email):
        query = "SELECT account_id, email, password_hash FROM accounts WHERE email = %s"
        response = self.db.execute_query(query, (email,))
        if not response or len(response) == 0:
            return None
        return response[0]
    
    
    def get_doctor_by_account_id(self, account_id):
        query = "SELECT doctor_id, medical_license_number FROM doctors WHERE account_id = %s"
        response = self.db.execute_query(query, (account_id,))
        if not response or len(response) == 0:
            return None
        return response[0]
    
    
    def get_patient_by_account_id(self, account_id):
        query = "SELECT patient_id FROM patients WHERE account_id = %s"
        response = self.db.execute_query(query, (account_id,))
        if not response or len(response) == 0:
            return None
        return response[0]
    
    
    def create_login_log(self, account_id, payload):
        query = "INSERT INTO login_logs (account_id, refresh_token, ip_address, user_agent) VALUES (%s, %s, %s, %s)"
        rowaffected = self.db.execute_non_query(query, (
            account_id,
            payload.get("refresh_token"),
            payload.get("ip_address"),
            payload.get("user_agent"),
        ))
        
        if not rowaffected or rowaffected == 0:
            return False
        return True