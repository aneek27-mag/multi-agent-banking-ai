from fastapi import APIRouter
from pydantic import BaseModel
from agent_orchestrator.tools import customer, STOCKS, open_demat, link_demat
router=APIRouter(prefix="/api/wealth",tags=["Wealth & Securities"])
class LinkRequest(BaseModel): user_id:str; bo_id:str
@router.get("/demat/{user_id}")
def demat_status(user_id:str):
    c=customer(user_id); return {"linked_demat":c["linked_demat"],"accounts":c["demat_accounts"]}
@router.post("/demat/open")
def demat_open(user_id:str): return open_demat(user_id)
@router.post("/demat/link")
def demat_link(req:LinkRequest): return link_demat(req.user_id,req.bo_id)
@router.get("/quote/{symbol}")
def quote(symbol:str):
    s=symbol.upper()
    return {"symbol":s,**STOCKS[s]} if s in STOCKS else {"error":"Unsupported symbol"}
