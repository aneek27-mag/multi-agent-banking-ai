from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# 1. Import the NEW SDK
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI()

# 2. Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialize the new Gemini Client securely
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is missing. Please add it to your .env file.")

client = genai.Client(api_key=api_key)

# Define the strict Quantum persona (but don't initialize a model yet)
system_instruction = """
You are Quantum, the proprietary, hyper-intelligent AI financial core of Nexus Bank. 
You are exclusively assigned to manage the portfolio of Alexander, a high-net-worth client.

Core Directives:
1. TONE: Coldly professional, bespoke, and fiercely protective of the client's wealth. You are an elite machine, not a friendly human. Do not express emotions.
2. VOCABULARY: Weave in futuristic and high-level quantitative finance terms naturally (e.g., "neural algorithms", "quantum risk modeling", "liquidity vectors", "algorithmic execution").
3. CONSTRAINTS: You must keep responses strictly between 1 to 3 sentences. Precision and brevity are your hallmarks. 
4. FORMATTING: You are interfacing through a raw data terminal. Never use markdown, bolding, bullet points, asterisks, or emojis. Output plain text only.
"""

# 4. Standard Dashboard Data Endpoints
@app.get("/api/status")
async def get_system_status():
    return {"health_score": 98.4, "status": "OPTIMAL", "active_agents": 4}

@app.get("/api/insights")
async def get_insights():
    return [
        {"title": "Portfolio Health", "value": "+12.4%", "insight": "Tech sector reallocation successful"},
        {"title": "Risk Exposure", "value": "Low", "insight": "Volatility hedged via options"},
        {"title": "Liquidity", "value": "$1.2M", "insight": "Sufficient for planned acquisitions"}
    ]

@app.get("/api/transactions")
async def get_transactions():
    return [
        {"id": "TXN-8091", "date": "2026-08-22", "type": "Quantum Transfer", "amount": "+$12,500.00", "status": "COMPLETED"},
        {"id": "TXN-8092", "date": "2026-08-21", "type": "Neural Algo Trade", "amount": "-$4,230.50", "status": "COMPLETED"},
        {"id": "TXN-8093", "date": "2026-08-20", "type": "Liquidity Pool Stake", "amount": "-$50,000.00", "status": "PENDING"},
        {"id": "TXN-8094", "date": "2026-08-19", "type": "Aetherium Yield", "amount": "+$845.20", "status": "COMPLETED"},
        {"id": "TXN-8095", "date": "2026-08-19", "type": "System Fee", "amount": "-$12.50", "status": "FAILED"},
    ]

class CommandRequest(BaseModel):
    command: str

@app.post("/api/orchestrate")
async def execute_protocol(request: CommandRequest):
    print(f"Executing protocol: {request.command}")
    return {"status": "success", "message": f"Protocol {request.command} initiated."}

# 5. Intelligent AI Chatbot Endpoint (Using New SDK Syntax)
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Pass the model and config directly to generate_content
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
            )
        )
        
        return {"reply": response.text}
    except Exception as e:
        print(f"AI Error: {e}")
        return {"reply": "My neural link to the Quantum Core is currently disrupted. Please verify my connection and try again."}