from fastapi import APIRouter, Depends
from utils import standard_response, patient_login_required

patient_router = APIRouter()

# Patient information management
@patient_router.get("/get_patient_info")
@standard_response
def get_patient_info(account_info=Depends(patient_login_required)):
    return "Patient information retrieved successfully"

@patient_router.post("/update_patient_info")
@standard_response
def update_patient_info(account_info=Depends(patient_login_required)):
    return "Patient information updated successfully"

@patient_router.post("/get_doctor_list")
@standard_response
def get_doctor_list(account_info=Depends(patient_login_required)):
    return "Doctor list retrieved successfully"

@patient_router.post("/request_doctor")
@standard_response
def request_doctor(account_info=Depends(patient_login_required)):
    return "Doctor requested successfully"

@patient_router.get("/get_dashboard_info")
@standard_response
def get_dashboard_info(account_info=Depends(patient_login_required)):
    return "Dashboard information retrieved successfully"


# Patient appointment management
@patient_router.get("/get_appointments")
@standard_response
def get_appointments(account_info=Depends(patient_login_required)):
    return "Appointments retrieved successfully"


@patient_router.post("/create_new_appointment")
@standard_response
def create_new_appointment(account_info=Depends(patient_login_required)):
    return "Appointment created successfully"


@patient_router.post("/cancel_appointment")
@standard_response
def cancel_appointment(account_info=Depends(patient_login_required)):
    return "Appointment canceled successfully"

@patient_router.put("/reschedule_appointment")
@standard_response
def reschedule_appointment(account_info=Depends(patient_login_required)):
    return "Appointment rescheduled successfully"

# Patient medical records management
@patient_router.get("/get_medical_records")
@standard_response
def get_medical_records(account_info=Depends(patient_login_required)):
    return "Medical records retrieved successfully"

@patient_router.post("/add_medical_record")
@standard_response
def add_medical_record(account_info=Depends(patient_login_required)):
    return "Medical record added successfully"

@patient_router.put("/update_medical_record")
@standard_response
def update_medical_record(account_info=Depends(patient_login_required)):
    return "Medical record updated successfully"

@patient_router.delete("/delete_medical_record")
@standard_response
def delete_medical_record(account_info=Depends(patient_login_required)):
    return "Medical record deleted successfully"


# Patient get health metrics
@patient_router.get("/get_health_metrics")
def get_health_metrics(account_info=Depends(patient_login_required)):
    return "Health metrics retrieved successfully"