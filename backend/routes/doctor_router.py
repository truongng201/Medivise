from fastapi import APIRouter, Depends
from utils import standard_response, doctor_login_required

doctor_router = APIRouter()

# Doctor information management
@doctor_router.get("/get_doctor_info")
@standard_response
def get_doctor_info(account_info=Depends(doctor_login_required)):
    return "Doctor information retrieved successfully"

@doctor_router.post("/update_doctor_info")
@standard_response
def update_doctor_info(account_info=Depends(doctor_login_required)):
    return "Doctor information updated successfully"

@doctor_router.post("/get_patient_list")
@standard_response
def get_patient_list(account_info=Depends(doctor_login_required)):
    return "Patient list retrieved successfully"

@doctor_router.get("/get_patient_details/{patient_id}")
@standard_response
def get_patient_details(patient_id: int, account_info=Depends(doctor_login_required)):
    return f"Details for patient {patient_id} retrieved successfully"

@doctor_router.get("/get_patient_requests")
@standard_response
def get_patient_requests(account_info=Depends(doctor_login_required)):
    return "Patient requests retrieved successfully"

# Doctor appointment management
@doctor_router.get("/get_appointments")
@standard_response
def get_appointments(account_info=Depends(doctor_login_required)):
    return "Appointments retrieved successfully"

@doctor_router.post("/create_new_appointment")
@standard_response
def create_new_appointment(account_info=Depends(doctor_login_required)):
    return "Appointment created successfully"

@doctor_router.post("/cancel_appointment")
@standard_response
def cancel_appointment(account_info=Depends(doctor_login_required)):
    return "Appointment canceled successfully"

@doctor_router.put("/reschedule_appointment")
@standard_response
def reschedule_appointment(account_info=Depends(doctor_login_required)):
    return "Appointment rescheduled successfully"
