from typing import Literal, Optional, List
from pydantic import BaseModel, Field
from enum import Enum

class FeatureRecord(BaseModel):
    gender: Literal["F", "M"]
    race: Literal["asian", "black", "white"]
    ethnicity: Literal["hispanic", "nonhispanic"]
    tobacco_smoking_status: Literal[
        "Current every day smoker", "Never smoker", "Former smoker"
    ]
    pain_severity: Optional[float] = None
    age: Optional[float] = None
    bmi: Optional[float] = None
    calcium: Optional[float] = None
    carbon_dioxide: Optional[float] = None
    chloride: Optional[float] = None
    creatinine: Optional[float] = None
    diastolic_bp: Optional[float] = None
    glucose: Optional[float] = None
    heart_rate: Optional[float] = None
    potassium: Optional[float] = None
    respiratory_rate: Optional[float] = None
    sodium: Optional[float] = None
    systolic_bp: Optional[float] = None
    urea_nitrogen: Optional[float] = None
    
class PredictPayload(BaseModel):
    records: List[FeatureRecord] = Field(..., description="List of patient feature records")