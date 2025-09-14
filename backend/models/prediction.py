from typing import Literal, Optional, List
from pydantic import BaseModel, Field

class FeatureRecord(BaseModel):
    gender: Literal["F", "M", "Other"] = "F"
    race: Literal["asian", "black", "white", "other"] = "white"
    ethnicity: Literal["hispanic", "nonhispanic"] = "nonhispanic"
    tobacco_smoking_status: Literal[
        "current", "former", "never"
    ] = "never"
    pain_severity: Optional[float] = None
    age: Optional[float] = None
    bmi: Optional[float] = None
    calcium: Optional[float] = 9.5
    carbon_dioxide: Optional[float] = 25.5
    chloride: Optional[float] = 101.0
    creatinine: Optional[float] = 0.97
    diastolic_bp: Optional[float] = 70.0
    glucose: Optional[float] = 84.5
    heart_rate: Optional[float] = 80.0
    potassium: Optional[float] = 4.25
    respiratory_rate: Optional[float] = 16.0
    sodium: Optional[float] = 140.0
    systolic_bp: Optional[float] = 105.0
    urea_nitrogen: Optional[float] = 13.5
    
class PredictPayload(BaseModel):
    records: List[FeatureRecord] = Field(..., description="List of patient feature records")