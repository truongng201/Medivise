import re
import bcrypt

from models import CreateDoctorAccountModel
from queries import CreateDoctorAccountQuery
from utils import ServerErrorException, InvalidDataException

class CreateDoctorAccountController:
    def __init__(self, payload: CreateDoctorAccountModel):
        self.payload = payload
        self.query = CreateDoctorAccountQuery()
        self.query_payload = {}
        self.response = None
        self.__validate_payload()
        
    def __validate_payload(self):
        fullname = self.payload.fullname.strip() if self.payload.fullname else ""
        email = self.payload.email.strip() if self.payload.email else ""
        password = self.payload.password.strip() if self.payload.password else ""
        phone_number = self.payload.phone_number.strip() if self.payload.phone_number else ""
        medical_specialty = self.payload.medical_specialty.strip() if self.payload.medical_specialty else ""
        medical_license_number = self.payload.medical_license_number.strip() if self.payload.medical_license_number else ""
        clinic_or_hospital_address = self.payload.clinic_or_hospital_address.strip() if self.payload.clinic_or_hospital_address else ""
        years_of_experience = self.payload.years_of_experience if self.payload.years_of_experience else ""
        medical_education = self.payload.medical_education.strip() if self.payload.medical_education else ""
        
        if not fullname or not email or not password or not medical_specialty or not medical_license_number or not clinic_or_hospital_address :
            self.query.stop_query()
            raise InvalidDataException("Missing required fields")

        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            self.query.stop_query()
            raise InvalidDataException("Invalid email format")
        
        if len(password) < 6 or len(password) > 50 \
            or not re.search(r"[A-Z]", password) \
            or not re.search(r"[a-z]", password) \
            or not re.search(r"[0-9]", password):
            self.query.stop_query()
            raise InvalidDataException("Password must be between 6 and 50 characters and contain at least one uppercase letter, one lowercase letter, and one digit")

        if not re.match(r"^[a-zA-Z\s]+$", fullname):
            self.query.stop_query()
            raise InvalidDataException("Full name can only contain letters and spaces")
        
        # validate medical license number (alphanumeric, 5-20 characters)
        if not re.match(r"^[a-zA-Z0-9]{5,20}$", medical_license_number):
            self.query.stop_query()
            raise InvalidDataException("Invalid medical license number format")
        
         # validate clinic or hospital address (at least 10 characters)
        if len(clinic_or_hospital_address) < 10:
            self.query.stop_query()
            raise InvalidDataException("Clinic or hospital address must be at least 10 characters long")
        
        if phone_number:
            if not re.match(r"^\+?[1-9]\d{1,14}$", phone_number):
                self.query.stop_query()
                raise InvalidDataException("Invalid phone number format")
            
        if years_of_experience:
            if not isinstance(years_of_experience, int) or years_of_experience < 0:
                self.query.stop_query()
                raise InvalidDataException("Years of experience must be a non-negative integer")
            
        self.query_payload = {
            "fullname": fullname,
            "email": email,
            "phone_number": phone_number,
            "medical_specialty": medical_specialty,
            "medical_license_number": medical_license_number,
            "clinic_or_hospital_address": clinic_or_hospital_address,
            "years_of_experience": years_of_experience,
            "medical_education": medical_education,
            "profile_picture_url": "https://api.dicebear.com/9.x/identicon/svg?seed=" + fullname
        }
        
        
    def __hashed_password(self, password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        

    def __create_doctor_account(self):
        email_exists = self.query.check_email_exists(self.payload.email)
        if email_exists:
            self.query.stop_query()
            raise InvalidDataException("Email already exists")
        
        license_exists = self.query.check_medical_license_exists(self.payload.medical_license_number)
        if license_exists:
            self.query.stop_query()
            raise InvalidDataException("Medical license number already exists")
        
        hashed_password = self.__hashed_password(self.payload.password)
        self.query_payload['password_hash'] = hashed_password
        
        account_id = self.query.create_account(self.query_payload)
        if not account_id:
            self.query.stop_query()
            raise ServerErrorException("Failed to create account")
        
        doctor_id = self.query.create_doctor(account_id, self.query_payload)
        if not doctor_id:
            self.query.stop_query()
            raise ServerErrorException("Failed to create doctor profile")
        
        self.query.close_query()
        self.response = {
            "account_id": account_id,
            "doctor_id": doctor_id,
        }

    def execute(self):
        self.__create_doctor_account()
        return self.response