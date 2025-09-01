import pandas as pd
from sklearn.model_selection import train_test_split
from typing import Dict, List
from config import logger


# -------------------------
# Config
# -------------------------
INPUT_DIR = "mlops/data/preprocessed"
OUTPUT_FILE_TRAIN = "mlops/data/processed/train_patient_features.csv"
OUTPUT_FILE_TEST = "mlops/data/processed/test_patient_features.csv"
REFERENCE_YEAR = 2020

# Vital signs of interest
VITAL_SIGNS: Dict[str, str] = {
    "Pain severity - 0-10 verbal numeric rating [Score] - Reported": "pain_severity",
    "Diastolic Blood Pressure": "diastolic_bp",
    "Systolic Blood Pressure": "systolic_bp",
    "Tobacco smoking status NHIS": "tobacco_smoking_status",
    "Heart rate": "heart_rate",
    "Respiratory rate": "respiratory_rate",
    "Body Mass Index": "bmi",
    "Chloride": "chloride",
    "Sodium": "sodium",
    "Calcium": "calcium",
    "Creatinine": "creatinine",
    "Urea Nitrogen": "urea_nitrogen",
    "Glucose": "glucose",
    "Carbon Dioxide": "carbon_dioxide",
    "Potassium": "potassium",
}


# -------------------------
# Load data
# -------------------------
def load_datasets(input_dir: str = INPUT_DIR):
    patients = pd.read_csv(f"{input_dir}/patients.csv")
    conditions = pd.read_csv(f"{input_dir}/conditions.csv")
    observations = pd.read_csv(f"{input_dir}/observations.csv")
    return patients, conditions, observations


# -------------------------
# Patient features
# -------------------------
def process_patients(patients: pd.DataFrame) -> pd.DataFrame:
    patients["BIRTHDATE"] = pd.to_datetime(patients["BIRTHDATE"], errors="coerce")
    patients["age"] = REFERENCE_YEAR - patients["BIRTHDATE"].dt.year
    patients = patients[["Id", "age", "GENDER", "RACE", "ETHNICITY"]]
    return patients


def condition_counts(conditions: pd.DataFrame) -> pd.DataFrame:
    return (
        conditions.groupby("PATIENT")["DESCRIPTION"]
        .nunique()
        .reset_index(name="condition_count")
    )


# -------------------------
# Observation features
# -------------------------
def latest_observations(observations: pd.DataFrame) -> pd.DataFrame:
    observations["DATE"] = pd.to_datetime(observations["DATE"], errors="coerce")
    obs_filtered = observations[observations["DESCRIPTION"].isin(VITAL_SIGNS.keys())].copy()
    obs_filtered["vital_name"] = obs_filtered["DESCRIPTION"].map(VITAL_SIGNS)

    obs_latest = (
        obs_filtered.sort_values(["PATIENT", "vital_name", "DATE"])
        .groupby(["PATIENT", "vital_name"])
        .tail(1)
        .pivot(index="PATIENT", columns="vital_name", values="VALUE")
        .reset_index()
    )
    return obs_latest


# -------------------------
# Label creation
# -------------------------
def assign_risk_level(count: int) -> str:
    if count <= 2:
        return "Low"
    elif count <= 5:
        return "Moderate"
    return "High"


# -------------------------
# Main pipeline
# -------------------------
def build_feature_table(
    patients: pd.DataFrame,
    conditions: pd.DataFrame,
    observations: pd.DataFrame,
    drop_races: List[str] = ["other"],
) -> pd.DataFrame:

    # Merge patients with features
    df = process_patients(patients)
    df = df.merge(condition_counts(conditions), left_on="Id", right_on="PATIENT", how="left")
    df = df.merge(latest_observations(observations), left_on="Id", right_on="PATIENT", how="left")

    # Clean up
    df.columns = df.columns.str.lower()
    df = df.drop(columns=["patient_x", "patient_y"], errors="ignore")
    df["condition_count"] = df["condition_count"].fillna(0).astype(int)

    # Risk label
    df["risk_level"] = df["condition_count"].apply(assign_risk_level)
    df = df.drop(columns=["condition_count", "id"], errors="ignore")

    # Convert numeric vitals
    numeric_cols = [
        "calcium", "carbon_dioxide", "chloride", "creatinine", "diastolic_bp",
        "glucose", "heart_rate", "pain_severity", "potassium",
        "respiratory_rate", "sodium", "systolic_bp", "urea_nitrogen", "bmi",
    ]
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors="coerce")

    # Impute missing with median
    for col in numeric_cols:
        if df[col].isna().any():
            df[col] = df[col].fillna(df[col].median())

    # Drop unwanted race categories
    df = df[~df["race"].isin(drop_races)].reset_index(drop=True)

    return df


def main():
    patients, conditions, observations = load_datasets(INPUT_DIR)
    features = build_feature_table(patients, conditions, observations)

    # Train/test split (80/20, stratified)
    train_df, test_df = train_test_split(
        features,
        test_size=0.2,
        stratify=features["risk_level"],
        random_state=69,
    )

    train_df.to_csv(OUTPUT_FILE_TRAIN, index=False)
    test_df.to_csv(OUTPUT_FILE_TEST, index=False)

    logger.info(f"SUCCESS Saved train set to {OUTPUT_FILE_TRAIN} ({len(train_df)} rows)")
    logger.info(f"SUCCESS Saved test set to {OUTPUT_FILE_TEST} ({len(test_df)} rows)")



if __name__ == "__main__":
    main()