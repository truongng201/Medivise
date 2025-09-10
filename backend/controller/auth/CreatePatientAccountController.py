import re
import bcrypt

from models import CreatePatientAccountModel
from queries import CreatePatientAccountQuery
from utils import ServerErrorException, InvalidDataException

class CreatePatientAccountController:
    def __init__(self, payload: CreatePatientAccountModel):
        self.payload = payload
        self.query = CreatePatientAccountQuery()
        self.query_payload = {}
        self.response = None
        self.__validate_payload()

    def __validate_payload(self):
        fullname = self.payload.fullname.strip() if self.payload.fullname else ""
        email = self.payload.email.strip() if self.payload.email else ""
        password = self.payload.password.strip() if self.payload.password else ""
        phone_number = self.payload.phone_number.strip() if self.payload.phone_number else ""
        date_of_birth = self.payload.date_of_birth.strip() if self.payload.date_of_birth else ""
        if not fullname or not email or not password:
            raise InvalidDataException("Missing required fields")

        if len(password) < 6 or len(password) > 50 \
            or not re.search(r"[A-Z]", password) \
            or not re.search(r"[a-z]", password) \
            or not re.search(r"[0-9]", password):
            self.query.stop()
            raise InvalidDataException("Password must be between 6 and 50 characters and contain at least one uppercase letter, one lowercase letter, and one digit")

        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            self.query.stop()
            raise InvalidDataException("Invalid email format")

        if not re.match(r"^[a-zA-Z\s]+$", fullname):
            self.query.stop()
            raise InvalidDataException("Full name can only contain letters and spaces")

        if phone_number:
            if not re.match(r"^\+?[1-9]\d{1,14}$", phone_number):
                self.query.stop()
                raise InvalidDataException("Invalid phone number format")

        if date_of_birth:
            if not re.match(r"\d{2}-\d{2}-\d{4}", date_of_birth):
                self.query.stop()
                raise InvalidDataException("Invalid date of birth format. Expected format: DD-MM-YYYY")
            
        self.query_payload = {
            "fullname": fullname,
            "email": email,
            "phone_number": phone_number,
            "date_of_birth": date_of_birth,
            "profile_picture_url": "https://api.dicebear.com/9.x/identicon/svg?seed=" + fullname
        }
        
        
    def __convert_date_format(self, date_str):
        day, month, year = date_str.split('-')
        return f"{year}-{month}-{day}"
            
            
    def __hashed_password(self, password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        

    def __create_patient_account(self):
        email_exists = self.query.check_email_exists(self.payload.email)
        if email_exists:
            self.query.stop()
            raise InvalidDataException("Email already exists")
        
        self.query_payload['date_of_birth'] = self.__convert_date_format(self.payload.date_of_birth) if self.payload.date_of_birth else None
        self.query_payload['password_hash'] = self.__hashed_password(self.payload.password)

        account_id = self.query.create_account(self.query_payload)
        if not account_id:
            self.query.stop()
            raise ServerErrorException("Something went wrong")

        patient_id = self.query.create_patient(account_id)
        if not patient_id:
            self.query.stop()
            raise ServerErrorException("Something went wrong")
        self.query.close()
        self.response = {
            "account_id": account_id,
            "patient_id": patient_id
        }


    def execute(self):
       self.__create_patient_account()
       return self.response