from pydantic import BaseModel, Field

class LoginModel(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., example="securepassword")
    role: str = Field(..., example="doctor")  # or "patient"
    
    class Config:
        json_schema_extra = {
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
        json_schema_extra = {
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
        json_schema_extra = {
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
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "new_password": "newsecurepassword"
            }
        }

class LogoutModel(BaseModel):
    refresh_token: str = Field(..., example="some-refresh-token-string")
    
    class Config:
        json_schema_extra = {
            "example": {
                "refresh_token": "some-refresh-token-string"
            }
        }

class TokenModel(BaseModel):
    access_token: str = Field(..., example="some-access-token-string")
    refresh_token: str = Field(..., example="some-refresh-token-string")

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "some-access-token-string",
                "refresh_token": "some-refresh-token-string"
            }
        }

class UpdatePatientInfoModel(BaseModel):
    fullname: str = Field(None, example="John Doe")
    phone_number: str = Field(None, example="+1234567890")
    profile_picture_url: str = Field(None, example="https://example.com/avatar.jpg")
    bio: str = Field(None, example="Patient bio information")
    date_of_birth: str = Field(None, example="1990-12-30")
    medical_history: str = Field(None, example="Previous medical conditions")
    allergies: str = Field(None, example="Peanuts, Shellfish")
    current_medications: str = Field(None, example="Medication list")
    gender: str = Field(None, example="Male")
    race: str = Field(None, example="Caucasian")
    ethnicity: str = Field(None, example="Non-Hispanic")
    tobacco_smoking_status: str = Field(None, example="Never")
    pain_severity: float = Field(None, example=3.5)
    age: int = Field(None, example=33)
    bmi: float = Field(None, example=24.5)
    calcium: float = Field(None, example=9.2)
    carbon_dioxide: float = Field(None, example=25.0)
    chloride: float = Field(None, example=102.0)
    creatinine: float = Field(None, example=1.0)
    diastolic_bp: float = Field(None, example=80.0)
    glucose: float = Field(None, example=95.0)
    heart_rate: float = Field(None, example=72.0)
    potassium: float = Field(None, example=4.2)
    respiratory_rate: float = Field(None, example=16.0)
    sodium: float = Field(None, example=140.0)
    systolic_bp: float = Field(None, example=120.0)
    urea_nitrogen: float = Field(None, example=15.0)

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "John Doe",
                "phone_number": "+1234567890",
                "bio": "Updated patient bio",
                "medical_history": "Updated medical history",
                "allergies": "Updated allergies",
                "current_medications": "Updated medications"
            }
        }
