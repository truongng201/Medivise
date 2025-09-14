from ..QueryBase import QueryBase

class GetPatientInfoQuery(QueryBase):
    def get_patient_info(self, account_id):
        query = """
            SELECT
                accounts.account_id AS account_id,
                accounts.email AS email,
                accounts.fullname AS fullname,
                accounts.phone_number AS phone_number,
                accounts.profile_picture_url AS profile_picture_url,
                accounts.bio AS bio,
                accounts.date_of_birth AS date_of_birth,
                patients.patient_id AS patient_id,
                patients.medical_history AS medical_history,
                patients.allergies AS allergies,
                patients.current_medications AS current_medications,
                patient_health_metrics.gender AS gender,
                patient_health_metrics.race AS race,
                patient_health_metrics.ethnicity AS ethnicity,
                patient_health_metrics.tobacco_smoking_status AS tobacco_smoking_status,
                patient_health_metrics.pain_severity AS pain_severity,
                patient_health_metrics.age AS age,
                patient_health_metrics.bmi AS bmi,
                patient_health_metrics.calcium AS calcium,
                patient_health_metrics.carbon_dioxide AS carbon_dioxide,
                patient_health_metrics.chloride AS chloride,
                patient_health_metrics.creatinine AS creatinine,
                patient_health_metrics.diastolic_bp AS diastolic_bp,
                patient_health_metrics.glucose AS glucose,
                patient_health_metrics.heart_rate AS heart_rate,
                patient_health_metrics.potassium AS potassium,
                patient_health_metrics.respiratory_rate AS respiratory_rate,
                patient_health_metrics.sodium AS sodium,
                patient_health_metrics.systolic_bp AS systolic_bp,
                patient_health_metrics.urea_nitrogen AS urea_nitrogen,
                patient_health_metrics.recorded_time AS recorded_time
            FROM accounts
            LEFT JOIN patients ON accounts.account_id = patients.account_id
            LEFT JOIN patient_health_metrics ON patients.patient_id = patient_health_metrics.patient_id
            WHERE accounts.account_id = %s
        """
        response = self.db.execute_query(query, (account_id,))
        if not response or len(response) == 0:
            return None
        return response[0]
    
    def get_vital_range(self):
        data = {
            "calcium": {
                "low": 8.5,
                "high": 10.5,
                "unit": "mg/dL"
            },
            "carbon_dioxide": {
                "low": 22,
                "high": 29,
                "unit": "mmol/L"
            },
            "chloride": {
                "low": 96,
                "high": 106,
                "unit": "mmol/L"
            },
            "creatinine": {
                "low": 0.59,
                "high": 1.35,
                "unit": "mg/dL"
            },
            "diastolic_bp": {
                "low": 60,
                "high": 80,
                "unit": "mmHg"
            },
            "glucose": {
                "low": 70,
                "high": 99,
                "unit": "mg/dL"
            },
            "heart_rate": {
                "low": 60,
                "high": 100,
                "unit": "bpm"
            },
            "potassium": {
                "low": 3.5,
                "high": 5.0,
                "unit": "mmol/L"
            },
            "respiratory_rate": {
                "low": 12,
                "high": 20,
                "unit": "breaths/min"
            },
            "sodium": {
                "low": 135,
                "high": 145,
                "unit": "mmol/L"
            },
            "systolic_bp": {
                "low": 90,
                "high": 120,
                "unit": "mmHg"
            },
            "urea_nitrogen": {
                "low": 7,
                "high": 20,
                "unit": "mg/dL"
            }
        }
        return data