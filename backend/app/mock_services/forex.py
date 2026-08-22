from fastapi import APIRouter
from pydantic import BaseModel
from agent_orchestrator.tools import FX, customer, forex_trade
router=APIRouter(prefix="/api/forex",tags=["Forex Sandbox"])
class TradeRequest(BaseModel):
    user_id:str; base:str; quote:str="INR"; side:str="BUY"; amount:float
@router.get("/rate/{base}/{quote}")
def rate(base:str,quote:str):
    pair=(base.upper(),quote.upper()); r=FX.get(pair)
    return {"pair":f"{pair[0]}/{pair[1]}","rate":r}
@router.get("/lrs/{user_id}")
def lrs(user_id:str):
    c=customer(user_id); return {"used_usd":c["lrs_used_usd"],"limit_usd":c["lrs_limit_usd"],"remaining_usd":c["lrs_limit_usd"]-c["lrs_used_usd"]}
@router.post("/trade")
def trade(req:TradeRequest): return forex_trade(req.user_id,req.base,req.quote,req.side,req.amount)
