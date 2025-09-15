from queries import UpdatePatientInfoQuery
from utils import BadRequestException

class UpdatePatientInfoController:
    def __init__(self, account_info, update_data):
        self.account_info = account_info
        self.update_data = update_data
        self.response = None
        self.query = UpdatePatientInfoQuery()
        self._validate_update_data()
    
    def _validate_update_data(self):
        if not self.update_data:
            self.query.stop()
            raise BadRequestException("No update data provided")
        
    def _update_patient_info(self):
        account_id = self.account_info.get("account_id")
        
        # Update account information if provided
        account_fields = {
            'fullname': self.update_data.get('fullname'),
            'phone_number': self.update_data.get('phone_number'),
            'profile_picture_url': self.update_data.get('profile_picture_url'),
            'bio': self.update_data.get('bio'),
            'date_of_birth': self.update_data.get('date_of_birth')
        }
        
        # Filter out None values
        account_fields = {k: v for k, v in account_fields.items() if v is not None}
        
        if account_fields:
            success = self.query.update_account_info(account_id, account_fields)
            if not success:
                self.query.stop()
                raise BadRequestException("Failed to update account information")
        
        # Update patient-specific information if provided
        patient_fields = {
            'medical_history': self.update_data.get('medical_history'),
            'allergies': self.update_data.get('allergies'),
            'current_medications': self.update_data.get('current_medications')
        }
        
        # Filter out None values
        patient_fields = {k: v for k, v in patient_fields.items() if v is not None}
        
        if patient_fields:
            success = self.query.update_patient_info(account_id, patient_fields)
            if not success:
                self.query.stop()
                raise BadRequestException("Failed to update patient information")
        
        # Update health metrics if provided
        health_metrics = {
            'gender': self.update_data.get('gender'),
            'race': self.update_data.get('race'),
            'ethnicity': self.update_data.get('ethnicity'),
            'tobacco_smoking_status': self.update_data.get('tobacco_smoking_status'),
            'pain_severity': self.update_data.get('pain_severity'),
            'age': self.update_data.get('age'),
            'bmi': self.update_data.get('bmi'),
            'calcium': self.update_data.get('calcium'),
            'carbon_dioxide': self.update_data.get('carbon_dioxide'),
            'chloride': self.update_data.get('chloride'),
            'creatinine': self.update_data.get('creatinine'),
            'diastolic_bp': self.update_data.get('diastolic_bp'),
            'glucose': self.update_data.get('glucose'),
            'heart_rate': self.update_data.get('heart_rate'),
            'potassium': self.update_data.get('potassium'),
            'respiratory_rate': self.update_data.get('respiratory_rate'),
            'sodium': self.update_data.get('sodium'),
            'systolic_bp': self.update_data.get('systolic_bp'),
            'urea_nitrogen': self.update_data.get('urea_nitrogen')
        }
        
        # Filter out None values
        health_metrics = {k: v for k, v in health_metrics.items() if v is not None}
        
        if health_metrics:
            success = self.query.update_health_metrics(account_id, health_metrics)
            if not success:
                self.query.stop()
                raise BadRequestException("Failed to update health metrics")
        
        self.response = {"message": "Patient information updated successfully"}
    
    def execute(self):
        self._update_patient_info()
        self.query.close()
        return self.response
       