from fastapi import APIRouter, Depends, Request
from utils import standard_response, login_required
from models import CreatePatientAccountModel, CreateDoctorAccountModel, LoginModel, ResetPasswordModel, ChangePasswordModel, LogoutModel
from controller import (
    CreatePatientAccountController, 
    CreateDoctorAccountController, 
    LoginController, 
    LogoutController, 
    ChangePasswordController, 
    ResetPasswordController, 
    GetNewAccessTokenController
)
auth_router = APIRouter()

@auth_router.post("/create_patient_account")
@standard_response
def create_patient_account(payload: CreatePatientAccountModel):
    controller = CreatePatientAccountController(payload)
    response = controller.execute()
    return response

@auth_router.post("/create_doctor_account")
@standard_response
def create_doctor_account(payload: CreateDoctorAccountModel):
    controller = CreateDoctorAccountController(payload)
    response = controller.execute()
    return response

@auth_router.post("/login")
@standard_response
def login(payload: LoginModel, request: Request):
    client_ip = request.client.host
    user_agent = request.headers.get('User-Agent', 'unknown')
    controller = LoginController(payload, client_ip, user_agent)
    response = controller.execute()
    return response

@auth_router.post("/logout")
@standard_response
def logout(payload: LogoutModel, request: Request, account_info=Depends(login_required)):
    access_token = request.headers.get("Authorization")
    controller = LogoutController(payload, account_info, access_token)
    response = controller.execute()
    return response

@auth_router.post("/change_password")
@standard_response
def change_password(payload: ChangePasswordModel, account_info=Depends(login_required)):
    controller = ChangePasswordController(payload, account_info)
    response = controller.execute()
    return response

@auth_router.post("/reset_password")
@standard_response
def reset_password(payload: ResetPasswordModel):
    controller = ResetPasswordController(payload)
    response = controller.execute()
    return response

@auth_router.get("/get_new_access_token")
@standard_response
def get_new_access_token(account_info=Depends(login_required)):
    controller = GetNewAccessTokenController(account_info)
    response = controller.execute()
    return response