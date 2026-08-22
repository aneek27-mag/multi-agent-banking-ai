from fastapi import APIRouter
from pydantic import BaseModel
from agent_orchestrator.tools import customer
router=APIRouter(prefix="/api/banking",tags=["Core Banking"])
class BlockFundsRequest(BaseModel):
    account_id:str
    amount:float
@router.get("/balance/{account_id}")
def get_balance(account_id:str): return {"balance":customer(account_id)["balance"]}
@router.post("/block-funds")
def block_funds(payload:BlockFundsRequest):
    return {"status":"success","lien_id":"LIEN-"+payload.account_id[-6:]}
