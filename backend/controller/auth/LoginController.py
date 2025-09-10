import bcrypt
import re
import secrets
import string

from models import LoginModel
from queries import LoginQuery
from utils import InvalidDataException, ServerErrorException, sign_token

class LoginController:
    def __init__(self, payload: LoginModel, client_ip: str, user_agent: str):
        self.payload = payload
        self.response = None
        self.login_log_payload = None
        self.client_ip = client_ip
        self.user_agent = user_agent
        self.query = LoginQuery()
        self.__validate_payload()
        
    def __generate_refresh_token(self):
        alphabet = string.ascii_lowercase + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(64))
      
    def __verify_password(self, password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

    def __validate_payload(self):
        email = self.payload.email
        password = self.payload.password
        role = self.payload.role

        if not email or not password or not role:
            self.query.stop()
            raise InvalidDataException("Email, password, and role must be provided")

        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            self.query.stop()
            raise InvalidDataException("Invalid email format")

        if len(password) < 6 or len(password) > 50 \
            or not re.search(r"[A-Z]", password) \
            or not re.search(r"[a-z]", password) \
            or not re.search(r"[0-9]", password):
            self.query.stop()
            raise InvalidDataException("Password must be at least 6 characters long")
        
        if role not in ["patient", "doctor"]:
            self.query.stop()
            raise InvalidDataException("Role must be either 'patient' or 'doctor'")

    def __login(self):
        account = self.query.get_account_by_email(self.payload.email)
        if not account:
            self.query.stop()
            raise InvalidDataException("Invalid email or password")

        account_id, email, password_hash, profile_picture_url = account

        if not self.__verify_password(self.payload.password, password_hash):
            self.query.stop()
            raise InvalidDataException("Invalid email or password")
        
        jwt_payload = {
            "account_id": account_id,
            "email": email,
            "role": self.payload.role
        }
        
        if self.payload.role == "doctor":
            doctor = self.query.get_doctor_by_account_id(account_id)
            if not doctor:
                self.query.stop()
                raise InvalidDataException("No doctor account associated with this email")
            doctor_id, medical_license_number = doctor
            jwt_payload["doctor_id"] = doctor_id
            jwt_payload["medical_license_number"] = medical_license_number
        else:  # patient
            patient = self.query.get_patient_by_account_id(account_id)
            if not patient:
                self.query.stop()
                raise InvalidDataException("No patient account associated with this email")
            patient_id, = patient
            jwt_payload["patient_id"] = patient_id
        refresh_token = self.__generate_refresh_token()
        access_token = sign_token(jwt_payload)
        del jwt_payload["exp"]
        jwt_payload["profile_picture_url"] = profile_picture_url
        self.login_log_payload = {
            "account_id": account_id,
            "refresh_token": refresh_token,
            "ip_address": self.client_ip,
            "user_agent": self.user_agent
        }
        if not self.query.create_login_log(account_id, self.login_log_payload):
            self.query.stop()
            raise ServerErrorException("Failed to create login log")
        
        self.query.close()
        self.response = {
            "refresh_token": refresh_token,
            "access_token": access_token,
            "account": jwt_payload
        }

    def execute(self):
        self.__login()
        return self.response