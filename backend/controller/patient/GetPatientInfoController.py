from queries import GetPatientInfoQuery
from utils import BadRequestException

class GetPatientInfoController:
    def __init__(self, account_info):
        self.account_info = account_info
        self.response = None
        self.query = GetPatientInfoQuery()
    

    def _get_patient_info(self):
        response = self.query.get_patient_info(self.account_info.get("account_id"))
        if not response:
            self.query.stop()
            raise BadRequestException("Something went wrong when getting patient info")
        vital_ranges = self.query.get_vital_range()
        self.response = {
            "account_id": response[0],
            "email": response[1],
            "fullname": response[2],
            "phone_number": response[3],
            "profile_picture_url": response[4],
            "bio": response[5],
            "date_of_birth": response[6],
            "patient_id": response[7],
            "medical_history": response[8],
            "allergies": response[9],
            "current_medications": response[10],
            "gender": response[11],
            "race": response[12],
            "ethnicity": response[13],
            "tobacco_smoking_status": response[14],
            "pain_severity": response[15],
            "bmi": response[17],
            "health_metrics":[
                {
                    "name": "Calcium",
                    "value": response[18] if response[18] is not None else "N/A",
                    "status": "N/A" if not response[18] else (
                        "warning" if response[18] < vital_ranges["calcium"]["low"] else
                        "warning" if response[18] > vital_ranges["calcium"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["calcium"]["unit"],
                    "high": vital_ranges["calcium"]["high"],
                    "low": vital_ranges["calcium"]["low"],
                },
                {
                    "name": "Carbon Dioxide",
                    "value": response[19] if response[19] is not None else "N/A",
                    "status": "N/A" if not response[19] else (
                        "warning" if response[19] < vital_ranges["carbon_dioxide"]["low"] else
                        "warning" if response[19] > vital_ranges["carbon_dioxide"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["carbon_dioxide"]["unit"],
                    "high": vital_ranges["carbon_dioxide"]["high"],
                    "low": vital_ranges["carbon_dioxide"]["low"],
                },
                {
                    "name": "Chloride",
                    "value": response[20] if response[20] is not None else "N/A",
                    "status": "N/A" if not response[20] else (
                        "warning" if response[20] < vital_ranges["chloride"]["low"] else
                        "warning" if response[20] > vital_ranges["chloride"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["chloride"]["unit"],
                    "high": vital_ranges["chloride"]["high"],
                    "low": vital_ranges["chloride"]["low"],
                },
                {
                    "name": "Creatinine",
                    "value": response[21] if response[21] is not None else "N/A",
                    "status": "N/A" if not response[21] else (
                        "warning" if response[21] < vital_ranges["creatinine"]["low"] else
                        "warning" if response[21] > vital_ranges["creatinine"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["creatinine"]["unit"],
                    "high": vital_ranges["creatinine"]["high"],
                    "low": vital_ranges["creatinine"]["low"],
                },
                {
                    "name": "Diastolic Blood Pressure",
                    "value": response[22] if response[22] is not None else "N/A",
                    "status": "N/A" if not response[22] else (
                        "warning" if response[22] < vital_ranges["diastolic_bp"]["low"] else
                        "warning" if response[22] > vital_ranges["diastolic_bp"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["diastolic_bp"]["unit"],
                    "high": vital_ranges["diastolic_bp"]["high"],
                    "low": vital_ranges["diastolic_bp"]["low"],
                },
                {
                    "name": "Glucose",
                    "value": response[23] if response[23] is not None else "N/A",
                    "status": "N/A" if not response[23] else (
                        "warning" if response[23] < vital_ranges["glucose"]["low"] else
                        "warning" if response[23] > vital_ranges["glucose"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["glucose"]["unit"],
                    "high": vital_ranges["glucose"]["high"],
                    "low": vital_ranges["glucose"]["low"],
                },
                {
                    "name": "Heart Rate",
                    "value": response[24] if response[24] is not None else "N/A",
                    "status": "N/A" if not response[24] else (
                        "warning" if response[24] < vital_ranges["heart_rate"]["low"] else
                        "warning" if response[24] > vital_ranges["heart_rate"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["heart_rate"]["unit"],
                    "high": vital_ranges["heart_rate"]["high"],
                    "low": vital_ranges["heart_rate"]["low"],
                },
                {
                    "name": "Potassium",
                    "value": response[25] if response[25] is not None else "N/A",
                    "status": "N/A" if not response[25] else (
                        "warning" if response[25] < vital_ranges["potassium"]["low"] else
                        "warning" if response[25] > vital_ranges["potassium"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["potassium"]["unit"],
                    "high": vital_ranges["potassium"]["high"],
                    "low": vital_ranges["potassium"]["low"],
                },
                {
                    "name": "Respiratory Rate",
                    "value": response[26] if response[26] is not None else "N/A",
                    "status": "N/A" if not response[26] else (
                        "warning" if response[26] < vital_ranges["respiratory_rate"]["low"] else
                        "warning" if response[26] > vital_ranges["respiratory_rate"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["respiratory_rate"]["unit"],
                    "high": vital_ranges["respiratory_rate"]["high"],
                    "low": vital_ranges["respiratory_rate"]["low"],
                },
                {
                    "name": "Sodium",
                    "value": response[27] if response[27] is not None else "N/A",
                    "status": "N/A" if not response[27] else (
                        "warning" if response[27] < vital_ranges["sodium"]["low"] else
                        "warning" if response[27] > vital_ranges["sodium"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["sodium"]["unit"],
                    "high": vital_ranges["sodium"]["high"],
                    "low": vital_ranges["sodium"]["low"],
                },
                {
                    "name": "Systolic Blood Pressure",
                    "value": response[28] if response[28] is not None else "N/A",
                    "status": "N/A" if not response[28] else (
                        "warning" if response[28] < vital_ranges["systolic_bp"]["low"] else
                        "warning" if response[28] > vital_ranges["systolic_bp"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["systolic_bp"]["unit"],
                    "high": vital_ranges["systolic_bp"]["high"],
                    "low": vital_ranges["systolic_bp"]["low"],
                },
                {
                    "name": "Urea Nitrogen",
                    "value": response[29] if response[29] is not None else "N/A",
                    "status": "N/A" if not response[29] else (
                        "warning" if response[29] < vital_ranges["urea_nitrogen"]["low"] else
                        "warning" if response[29] > vital_ranges["urea_nitrogen"]["high"] else
                        "good"
                    ),
                    "unit": vital_ranges["urea_nitrogen"]["unit"],
                    "high": vital_ranges["urea_nitrogen"]["high"],
                    "low": vital_ranges["urea_nitrogen"]["low"],
                },
            ],
            "recorded_time": response[30],
        }
        self.query.close()

    def execute(self):
        self._get_patient_info()
        return self.response