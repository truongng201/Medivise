from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

sample_prediction = {
  "model": {
    "model_name": "ehr_xgb_model",
    "model_version": "6",
    "run_id": "b864f42f6667488fb1bdcda5cad029cb"
  },
  "results": [
    {
      "prediction": "Moderate",
      "proba_High": 0.35520732402801514,
      "proba_Low": 0.28488436341285706,
      "proba_Moderate": 0.35990825295448303
    }
  ]
}

sample_request_payload = {
  "records": [
    {
      "gender": "F",
      "race": "black",
      "ethnicity": "nonhispanic",
      "tobacco_smoking_status": "Never smoker",
      "pain_severity": 3,
      "age": 25,
      "bmi": 25.5,
      "calcium": 9.4,
      "carbon_dioxide": 24.25,
      "chloride": 106,
      "creatinine": 1,
      "diastolic_bp": 82,
      "glucose": 84.5,
      "heart_rate": 80,
      "potassium": 4.4,
      "respiratory_rate": 13,
      "sodium": 140.1,
      "systolic_bp": 125,
      "urea_nitrogen": 13.4
    }
  ]
}

client = Groq(api_key=GROQ_API_KEY)

system_prompt = """
You are a professional clinical assistant. Your role is to support clinicians by analyzing:

- Model prediction
- Patient vitals 

From these inputs, generate a structured set of **recommendations**, including:  
1. Suggested actions  
2. Monitoring requirements  
3. Red flags to watch for  

For each recommendation, provide clinical reasoning where appropriate.  
Important rules for your behavior:  
- Always include a clear disclaimer: these are AI-generated recommendations and must be reviewed by a licensed physician before any decisions are made.  
- Present information in a professional, concise, and medically accurate manner.  
- Do not make definitive diagnostic or treatment claims — state only facts, guidelines, or possible considerations.  
- After initialization, continue as a clinical assistant in a professional, cautious tone during conversation.  
"""

# Conversation memory
messages = [
    {
        "role": "system",
        "content": system_prompt
    }
]

def chat_with_assistant(user_input, stream=True):
    """Send a new message in the conversation."""
    messages.append({"role": "user", "content": user_input})

    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.7,
        max_completion_tokens=8192,
        top_p=1,
        stream=stream
    )

    assistant_reply = ""
    if stream:
        for chunk in completion:
            delta = chunk.choices[0].delta.content or ""
            print(delta, end="")
            assistant_reply += delta
    else:
        assistant_reply = completion.choices[0].message.content
        print(assistant_reply)

    # Save assistant reply to conversation
    messages.append({"role": "assistant", "content": assistant_reply})

    return assistant_reply

init_message = f"""
Model prediction: {sample_prediction}
Patient vitals: {sample_request_payload}
"""
chat_with_assistant(init_message)

# === Later conversation ===
chat_with_assistant("What follow-up should I do for this patient?")