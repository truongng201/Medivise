-- ========================================
-- CLEAN INIT SCRIPT FOR POSTGRESQL
-- ========================================

-- Drop custom enum types if they exist
DO $$ BEGIN
    DROP TYPE IF EXISTS priority_level CASCADE;
    DROP TYPE IF EXISTS appointment_status CASCADE;
END $$;

-- ========================================
-- ENUM DEFINITIONS
-- ========================================
CREATE TYPE priority_level AS ENUM ('low','medium','high');
CREATE TYPE appointment_status AS ENUM ('pending','confirmed','rejected','completed');

-- ========================================
-- DROP TABLES IN ORDER
-- ========================================
DROP TABLE IF EXISTS patient_recommendations CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patient_doctors CASCADE;
DROP TABLE IF EXISTS patient_health_metrics CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS login_logs CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;

-- ========================================
-- CORE USER ACCOUNT
-- ========================================
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PATIENT TABLE
-- ========================================
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(50),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patients_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- ========================================
-- DOCTOR TABLE
-- ========================================
CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    medical_specialty VARCHAR(100),
    medical_license_number VARCHAR(50) UNIQUE,
    clinic_or_hospital_address TEXT,
    years_of_experience INT,
    medical_education TEXT,
    consultation_fee DECIMAL(10, 2),
    available_hours TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctors_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- ========================================
-- MEDICAL RECORDS
-- ========================================
CREATE TABLE medical_records (
    record_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT,
    record_title VARCHAR(255),
    record_type VARCHAR(100),
    record_date DATE,
    provider VARCHAR(255),
    facility VARCHAR(255),
    category VARCHAR(100),
    summary TEXT,
    detailed_notes TEXT,
    priority priority_level DEFAULT 'medium',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_records_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_records_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- ========================================
-- PATIENT HEALTH METRICS
-- ========================================
CREATE TABLE patient_health_metrics (
    metric_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    gender VARCHAR(50),
    race VARCHAR(50),
    ethnicity VARCHAR(50),
    tobacco_smoking_status VARCHAR(50),
    pain_severity FLOAT,
    age FLOAT,
    bmi FLOAT,
    calcium FLOAT,
    carbon_dioxide FLOAT,
    chloride FLOAT,
    creatinine FLOAT,
    diastolic_bp FLOAT,
    glucose FLOAT,
    heart_rate FLOAT,
    potassium FLOAT,
    respiratory_rate FLOAT,
    sodium FLOAT,
    systolic_bp FLOAT,
    urea_nitrogen FLOAT,
    recorded_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_metrics_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- ========================================
-- PATIENT ↔ DOCTOR RELATIONSHIP
-- ========================================
CREATE TABLE patient_doctors (
    patient_doctor_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    relationship_type VARCHAR(50), -- e.g. 'primary care', 'specialist'
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pd_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_pd_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- ========================================
-- APPOINTMENTS
-- ========================================
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(100),
    reason_for_visit TEXT,
    additional_notes TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    status appointment_status DEFAULT 'pending',
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- ========================================
-- PATIENT RECOMMENDATIONS
-- ========================================
CREATE TABLE patient_recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    recommendation_text TEXT,
    recommendation_type VARCHAR(100), -- e.g. "lifestyle", "diet", "treatment"
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommend_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- ========================================
-- LOGIN LOGS
-- ========================================
CREATE TABLE login_logs (
    log_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    refresh_token VARCHAR(255),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loginlogs_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
