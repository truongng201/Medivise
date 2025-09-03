# data.py
from __future__ import annotations

import pandas as pd
from sklearn.model_selection import train_test_split
from typing import Dict, List, Tuple
from config import logger

# -------------------------
# Config / IO
# -------------------------
INPUT_DIR = "mlops/data/preprocessed"
OUTPUT_FILE_TRAIN = "mlops/data/processed/train_patient_features.csv"
OUTPUT_FILE_TEST = "mlops/data/processed/test_patient_features.csv"

# Map raw observation DESCRIPTION -> canonical feature names
VITAL_SIGNS: Dict[str, str] = {
    "Pain severity - 0-10 verbal numeric rating [Score] - Reported": "pain_severity",  # numeric (float)
    "Diastolic Blood Pressure": "diastolic_bp",
    "Systolic Blood Pressure": "systolic_bp",
    "Tobacco smoking status NHIS": "tobacco_smoking_status",  # categorical (string)
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

# Columns that should end up numeric (floats) in the final table
NUMERIC_FEATURES: List[str] = [
    "age",
    "bmi",
    "calcium",
    "carbon_dioxide",
    "chloride",
    "creatinine",
    "diastolic_bp",
    "glucose",
    "heart_rate",
    "pain_severity",
    "potassium",
    "respiratory_rate",
    "sodium",
    "systolic_bp",
    "urea_nitrogen",
]

# -------------------------
# IO helpers
# -------------------------
def load_datasets(input_dir: str = INPUT_DIR) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Expects:
      patients.csv    with columns ['Id','BIRTHDATE','GENDER','RACE','ETHNICITY', ...]
      conditions.csv  with columns ['PATIENT','DESCRIPTION', ...]
      observations.csv with columns ['PATIENT','DESCRIPTION','VALUE','DATE', ...]
    """
    patients = pd.read_csv(f"{input_dir}/patients.csv")
    conditions = pd.read_csv(f"{input_dir}/conditions.csv")
    observations = pd.read_csv(f"{input_dir}/observations.csv")
    return patients, conditions, observations

# -------------------------
# Patient / Condition features
# -------------------------
def process_patients(patients: pd.DataFrame) -> pd.DataFrame:
    """
    Keep demographics and compute birth_year from BIRTHDATE.
    """
    df = patients.copy()
    # Parse US-style date strings robustly
    df["BIRTHDATE"] = pd.to_datetime(df["BIRTHDATE"], errors="coerce")
    df["birth_year"] = df["BIRTHDATE"].dt.year
    # Keep only required columns
    df = df[["Id", "birth_year", "GENDER", "RACE", "ETHNICITY"]]
    return df

def condition_counts(conditions: pd.DataFrame) -> pd.DataFrame:
    """
    Count the number of unique condition DESCRIPTIONS per patient.
    """
    return (
        conditions.groupby("PATIENT")["DESCRIPTION"]
        .nunique()
        .reset_index(name="condition_count")
    )

# -------------------------
# Observation features
# -------------------------
def latest_observations(observations: pd.DataFrame) -> pd.DataFrame:
    """
    For each (patient, vital_name) keep the latest observation VALUE by DATE,
    then pivot to a wide table with one row per patient.
    """
    obs = observations.copy()
    obs["DATE"] = pd.to_datetime(obs["DATE"], utc=True, errors="coerce")
    obs = obs[obs["DESCRIPTION"].isin(VITAL_SIGNS.keys())].copy()

    # Map to canonical feature names
    obs["vital_name"] = obs["DESCRIPTION"].map(VITAL_SIGNS)

    # Keep the last record per (patient, vital)
    latest = (
        obs.sort_values(["PATIENT", "vital_name", "DATE"])
        .groupby(["PATIENT", "vital_name"])
        .tail(1)
        .pivot(index="PATIENT", columns="vital_name", values="VALUE")
        .reset_index()
    )
    return latest

def latest_observation_year(observations: pd.DataFrame) -> pd.DataFrame:
    """
    For each patient, take the YEAR of their latest observation date.
    """
    obs = observations.copy()
    obs["DATE"] = pd.to_datetime(obs["DATE"], utc=True, errors="coerce")
    last_dt = obs.groupby("PATIENT", as_index=False)["DATE"].max()
    last_dt["latest_obs_year"] = last_dt["DATE"].dt.year
    return last_dt[["PATIENT", "latest_obs_year"]]

# -------------------------
# Labels
# -------------------------
def assign_risk_level(count: int) -> str:
    """
    Simple 3-bucket label from condition_count.
    """
    if count <= 2:
        return "Low"
    elif count <= 5:
        return "Moderate"
    return "High"

# -------------------------
# Build final feature table
# -------------------------
def build_feature_table(
    patients: pd.DataFrame,
    conditions: pd.DataFrame,
    observations: pd.DataFrame,
    drop_races: List[str] = ["other"],
) -> pd.DataFrame:
    """
    Returns a patient-level feature table with:
      - demographics: gender, race, ethnicity
      - age: computed from latest observation year - birth_year (fallback to REFERENCE_YEAR if no obs)
      - latest vitals and labs
      - risk_level label from condition_count
      - pain_severity is numeric (float)
      - tobacco_smoking_status remains categorical (string)
    """
    # Base demographics (+ birth_year)
    demo = process_patients(patients)  # ['Id','birth_year','GENDER','RACE','ETHNICITY']

    # Aggregations
    cond = condition_counts(conditions)          # ['PATIENT','condition_count']
    obs_wide = latest_observations(observations) # ['PATIENT', <wide vitals>]
    ref_year = latest_observation_year(observations)  # ['PATIENT','latest_obs_year']

    # Merge everything to patient Id
    df = (
        demo.merge(cond, left_on="Id", right_on="PATIENT", how="left")
            .merge(obs_wide, left_on="Id", right_on="PATIENT", how="left")
            .merge(ref_year, left_on="Id", right_on="PATIENT", how="left")
    )

    # Normalize column names and drop temp merge keys
    df.columns = df.columns.str.lower()
    df = df.drop(columns=["patient_x", "patient_y", "patient"], errors="ignore")

    # Safe integer for condition_count
    df["condition_count"] = df["condition_count"].fillna(0).astype(int)

    # Compute age from latest observation year
    df = df[~df["latest_obs_year"].isna()].copy()
    df["latest_obs_year"] = df["latest_obs_year"].astype(int)
    # birth_year may be missing -> Int64 to allow NA, then cast to float
    df["age"] = df["latest_obs_year"] - df["birth_year"].astype("Int64")
    df["age"] = df["age"].astype("float64")

    # Label
    df["risk_level"] = df["condition_count"].apply(assign_risk_level)

    # Drop helper columns not needed downstream
    df = df.drop(columns=["condition_count", "id", "birth_year", "latest_obs_year"], errors="ignore")

    # Coerce numeric columns to floats (including pain_severity)
    for col in NUMERIC_FEATURES:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Impute numeric columns with medians
    for col in NUMERIC_FEATURES:
        if col in df.columns and df[col].isna().any():
            df[col] = df[col].fillna(df[col].median())

    # Drop unwanted race categories (case-insensitive)
    if "race" in df.columns:
        df = df[~df["race"].str.lower().isin([r.lower() for r in drop_races])].reset_index(drop=True)

    # Quick QA logs
    logger.info(
        "QA: rows=%d | missing_by_col=%s",
        len(df),
        {c: int(df[c].isna().sum()) for c in df.columns if df[c].isna().any()},
    )

    # Final column ordering (optional but nice to keep consistent)
    # Categorical first (strings), then numerics, then label
    categorical = [c for c in ["gender", "race", "ethnicity", "tobacco_smoking_status"] if c in df.columns]
    numeric = [c for c in NUMERIC_FEATURES if c in df.columns]
    cols = categorical + numeric + ["risk_level"]
    # Keep any other columns at the end (defensive)
    remaining = [c for c in df.columns if c not in cols]
    df = df[cols + remaining]

    return df

# -------------------------
# CLI entrypoint
# -------------------------
def main():
    patients, conditions, observations = load_datasets(INPUT_DIR)

    features = build_feature_table(patients, conditions, observations)

    # Train/test split (80/20) stratified by label
    train_df, test_df = train_test_split(
        features,
        test_size=0.2,
        stratify=features["risk_level"],
        random_state=69,
    )

    # Save
    train_df.to_csv(OUTPUT_FILE_TRAIN, index=False)
    test_df.to_csv(OUTPUT_FILE_TEST, index=False)

    logger.info("SUCCESS Saved train set to %s (%d rows)", OUTPUT_FILE_TRAIN, len(train_df))
    logger.info("SUCCESS Saved test set to %s (%d rows)", OUTPUT_FILE_TEST, len(test_df))

if __name__ == "__main__":
    main()