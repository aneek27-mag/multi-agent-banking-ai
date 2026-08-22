from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json, asyncio
from agent_orchestrator.graph import app as agent_app

router=APIRouter(tags=["AI Orchestrator"])
class ChatRequest(BaseModel): message:str; user_id:str
class AuthRequest(BaseModel): user_id:str; m_pin:str

async def events(message,user_id):
    config={"configurable":{"thread_id":user_id}}
    state=agent_app.get_state(config)
    if state.next and "authorization" in state.next:
        yield "data: "+json.dumps({"type":"auth_required"})+"\n\n"; return
    inputs={"user_id":user_id,"messages":[("user",message)],"requires_auth":False,"audit":[]}
    try:
        async for event in agent_app.astream(inputs,config=config,stream_mode="updates"):
            for node,update in event.items():
                if node=="__interrupt__": continue
                if isinstance(update,dict):
                    for row in update.get("audit",[]):
                        yield "data: "+json.dumps({"type":"audit","agent":row.get("agent"),"event":row.get("event"),"details":row.get("details")})+"\n\n"
                    if update.get("result"):
                        yield "data: "+json.dumps({"type":"result","result":update["result"]})+"\n\n"
        final=agent_app.get_state(config)
        if final.next and "authorization" in final.next:
            yield "data: "+json.dumps({"type":"auth_required"})+"\n\n"
            yield "data: "+json.dumps({"type":"token","content":"Authorization is required before execution."})+"\n\n"
        else:
            result=(final.values or {}).get("result")
            if result: yield "data: "+json.dumps({"type":"result","result":result})+"\n\n"
        yield "data: "+json.dumps({"type":"done"})+"\n\n"
    except Exception as e:
        yield "data: "+json.dumps({"type":"error","content":str(e)})+"\n\n"
        yield "data: "+json.dumps({"type":"done"})+"\n\n"

@router.post("/stream")
async def stream(req:ChatRequest):
    return StreamingResponse(events(req.message,req.user_id),media_type="text/event-stream")

@router.post("/authorize")
async def authorize(req:AuthRequest):
    if req.m_pin!="1234": raise HTTPException(401,"Invalid sandbox M-PIN")
    config={"configurable":{"thread_id":req.user_id}}
    state=agent_app.get_state(config)
    if not state.next or "authorization" not in state.next:
        raise HTTPException(409,"No transaction is waiting for authorization")
    for _ in agent_app.stream(None,config=config,stream_mode="updates"): pass
    final=agent_app.get_state(config)
    return {"status":"success","result":final.values.get("result"),"audit":final.values.get("audit",[])}
