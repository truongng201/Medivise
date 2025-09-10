from pydantic import BaseModel, Field

class LoginModel(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., example="securepassword")
    role: str = Field(..., example="doctor")  # or "patient"
    
    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword",
                "role": "doctor"
            }
        }

class CreatePatientAccountModel(BaseModel):
    email: str = Field(..., example="patient@example.com")
    password: str = Field(..., example="Securepassword123")
    fullname: str = Field(..., example="John Doe")
    phone_number: str = Field(..., example="+1234567890")
    date_of_birth: str = Field(..., example="30-12-1990")  # Format: DD-MM-YYYY

    class Config:
        schema_extra = {
            "example": {
                "email": "patient@example.com",
                "password": "Securepassword123",
                "fullname": "John Doe",
                "phone_number": "+1234567890",
                "date_of_birth": "30-12-1990"
            }
        }


class CreateDoctorAccountModel(BaseModel):
    email: str = Field(..., example="doctor@example.com")
    password: str = Field(..., example="securepassword")
    fullname: str = Field(..., example="Dr. John Doe")
    phone_number: str = Field(..., example="+1234567890")
    medical_specialty: str = Field(..., example="Cardiology")
    medical_license_number: str = Field(..., example="MED123456")
    clinic_or_hospital_address: str = Field(..., example="123 Medical St, Health City")
    medical_education: str = Field(..., example="Harvard Medical School")
    years_of_experience: int = Field(..., example=10)
    
    class Config:
        schema_extra = {
            "example": {
                "email": "doctor@example.com",
                "password": "securepassword",
                "fullname": "Dr. John Doe",
                "phone_number": "+1234567890",
                "medical_specialty": "Cardiology",
                "medical_license_number": "MED123456",
                "clinic_or_hospital_address": "123 Medical St, Health City",
                "medical_education": "Harvard Medical School",
                "years_of_experience": 10
            }
        }

class ResetPasswordModel(BaseModel):
    email: str = Field(..., example="user@example.com")
    new_password: str = Field(..., example="newsecurepassword")
    
    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "new_password": "newsecurepassword"
            }
        }

class ChangePasswordModel(BaseModel):
    old_password: str = Field(..., example="oldsecurepassword")
    new_password: str = Field(..., example="newsecurepassword")
    
    class Config:
        schema_extra = {
            "example": {
                "old_password": "oldsecurepassword",
                "new_password": "newsecurepassword"
            }
        }

class LogoutModel(BaseModel):
    account_id: str = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    refresh_token: str = Field(..., example="some-refresh-token-string")
    
    class Config:
        schema_extra = {
            "example": {
                "account_id": "123e4567-e89b-12d3-a456-426614174000",
                "refresh_token": "some-refresh-token-string"
            }
        }

class TokenModel(BaseModel):
    access_token: str = Field(..., example="some-access-token-string")
    refresh_token: str = Field(..., example="some-refresh-token-string")

    class Config:
        schema_extra = {
            "example": {
                "access_token": "some-access-token-string",
                "refresh_token": "some-refresh-token-string"
            }
        }
