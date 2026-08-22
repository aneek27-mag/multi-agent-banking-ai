from typing import Any
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt
from .state import MultiAgentState
from .tools import customer, STOCKS, FX, open_demat, link_demat, buy_stock, forex_trade

def audit(state, agent, event, details=None):
    row={"agent":agent,"event":event}
    if details is not None: row["details"]=details
    return {"audit": state.get("audit",[])+[row]}

def triage(state: MultiAgentState):
    text=state["messages"][-1].content.lower()
    intent="general"; agent="Customer Assistant"; entities={}
    if any(x in text for x in ["demat","demat account","bo id","beneficiary owner"]):
        if any(x in text for x in ["link","connect","add existing"]): intent="link_demat"
        else: intent="open_demat"
        agent="Wealth & Securities Agent"
        import re
        m=re.search(r"\b\d{16}\b",text)
        if m: entities["bo_id"]=m.group(0)
    elif any(x in text for x in ["buy","purchase"]) and any(x in text for x in ["share","stock","equity"]):
        intent="buy_stock"; agent="Wealth & Securities Agent"
        import re
        m=re.search(r"\b(\d+)\s+(?:shares?|stocks?)\b",text)
        if m: entities["qty"]=int(m.group(1))
        m=re.search(r"\b(TCS|RELIANCE|HDFC|INFY)\b",text.upper())
        if m: entities["symbol"]=m.group(1)
    elif any(x in text for x in ["forex","currency","fx","usd/inr","eur/inr","gbp/inr","trade usd","buy usd","sell usd"]):
        intent="forex_trade"; agent="Forex & Remittance Agent"
        import re
        m=re.search(r"\b(BUY|SELL)\b",text.upper()); entities["side"]=m.group(1) if m else "BUY"
        m=re.search(r"\b(USD|EUR|GBP|AED)\b",text.upper()); entities["base"]=m.group(1) if m else "USD"
        entities["quote"]="INR"
        m=re.search(r"\b(\d+(?:\.\d+)?)\s*(?:USD|EUR|GBP|AED)\b",text.upper())
        if m: entities["amount"]=float(m.group(1))
    return {"current_intent":intent,"active_agent":agent,"extracted_entities":entities,**audit(state,"Triage Agent","intent_classified",{"intent":intent,"entities":entities})}

def specialist(state: MultiAgentState):
    intent=state["current_intent"]; e=state.get("extracted_entities",{}); uid=state["user_id"]; c=customer(uid)
    if intent=="open_demat":
        if c["kyc_status"]!="VERIFIED":
            return {"result":{"status":"blocked","reason":"KYC is not verified."},**audit(state,"KYC & Onboarding Agent","kyc_block")}
        return {"pending_action":{"type":"open_demat"},"requires_auth":True,"auth_status":"PENDING",**audit(state,"Wealth & Securities Agent","demat_opening_precheck",{"kyc":"VERIFIED"})}
    if intent=="link_demat":
        return {"pending_action":{"type":"link_demat","bo_id":e.get("bo_id")},"requires_auth":True,"auth_status":"PENDING",**audit(state,"Wealth & Securities Agent","demat_link_authorization",{"bo_id":e.get("bo_id")})}
    if intent=="buy_stock":
        s=e.get("symbol"); q=e.get("qty")
        if not s or not q: return {"result":{"status":"needs_input","message":"Specify quantity and supported symbol (TCS, RELIANCE, HDFC, INFY)."},**audit(state,"Wealth & Securities Agent","missing_trade_fields")}
        if not c["linked_demat"]: return {"result":{"status":"blocked","reason":"Link/open a Demat account before buying shares."},**audit(state,"Depository Agent","demat_required")}
        price=STOCKS[s]["price"]; total=round(price*q*1.0015,2)
        if c["balance"]<total: return {"result":{"status":"blocked","reason":"Insufficient funds","required":total,"available":c["balance"]},**audit(state,"Core Banking Agent","funds_check_failed")}
        return {"pending_action":{"type":"buy_stock","symbol":s,"qty":q,"estimated_total":total},"requires_auth":True,"auth_status":"PENDING",**audit(state,"Core Banking Agent","funds_check_passed",{"estimated_total":total})}
    if intent=="forex_trade":
        base=e.get("base","USD"); quote=e.get("quote","INR"); amount=e.get("amount")
        if not amount: return {"result":{"status":"needs_input","message":"Specify amount, e.g. BUY 1000 USD."},**audit(state,"Forex Agent","missing_trade_amount")}
        if base=="USD" and quote=="INR" and c["lrs_used_usd"]+amount>c["lrs_limit_usd"]:
            return {"result":{"status":"blocked","reason":"LRS limit exceeded","used_usd":c["lrs_used_usd"],"limit_usd":c["lrs_limit_usd"]},**audit(state,"Risk & Compliance Agent","LRS_block")}
        return {"pending_action":{"type":"forex_trade","base":base,"quote":quote,"side":e.get("side","BUY"),"amount":amount},"requires_auth":True,"auth_status":"PENDING",**audit(state,"Risk & Compliance Agent","compliance_passed",{"LRS_remaining":c["lrs_limit_usd"]-c["lrs_used_usd"]})}
    return {"result":{"status":"ok","message":"I can help with banking, Demat, stock purchases, and compliant FX workflows."},**audit(state,"Customer Assistant","general_response")}

def authorization(state: MultiAgentState):
    # The graph is interrupted BEFORE this node. Once resumed, this node simply marks
    # that the user's second factor was accepted by the API.
    return {"requires_auth":False,"auth_status":"SUCCESS",**audit(state,"Authorization Gateway","second_factor_verified")}

def execute(state: MultiAgentState):
    action=state.get("pending_action") or {}; uid=state["user_id"]; t=action.get("type")
    if t=="open_demat": result=open_demat(uid)
    elif t=="link_demat": result=link_demat(uid, action.get("bo_id",""))
    elif t=="buy_stock": result=buy_stock(uid, action["symbol"], int(action["qty"]))
    elif t=="forex_trade":
        result=forex_trade(uid, action["base"], action["quote"], action["side"], float(action["amount"]))
        if result.get("status")=="success": customer(uid)["lrs_used_usd"] += float(action["amount"])
    else: result={"status":"failed","reason":"Unknown transaction."}
    return {"result":result,"pending_action":None,**audit(state,"Execution Agent","transaction_completed",result)}

def route(state):
    return "authorization" if state.get("requires_auth") else "end"

workflow=StateGraph(MultiAgentState)
workflow.add_node("triage",triage)
workflow.add_node("specialist",specialist)
workflow.add_node("authorization",authorization)
workflow.add_node("execute",execute)
workflow.add_edge(START,"triage")
workflow.add_edge("triage","specialist")
workflow.add_conditional_edges("specialist",route,{"authorization":"authorization","end":END})
workflow.add_edge("authorization","execute")
workflow.add_edge("execute",END)
memory=MemorySaver()
app=workflow.compile(checkpointer=memory, interrupt_before=["authorization"])
