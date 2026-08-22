from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat
from app.mock_services import core_banking, wealth, forex
app=FastAPI(title="Nexus Bank AI — SIH PS-04 Sandbox",version="2.0.0")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:3000"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(chat.router,prefix="/api/chat")
app.include_router(core_banking.router)
app.include_router(wealth.router)
app.include_router(forex.router)
@app.get("/")
def health(): return {"status":"online","mode":"sandbox","message":"Multi-agent banking, securities and compliant FX orchestration is ready."}
