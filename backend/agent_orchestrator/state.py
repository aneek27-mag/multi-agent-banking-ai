from typing import TypedDict, Annotated, Optional, Any
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class MultiAgentState(TypedDict, total=False):
    messages: Annotated[list[BaseMessage], add_messages]
    user_id: str
    kyc_status: str
    current_intent: Optional[str]
    active_agent: str
    pending_transaction_id: Optional[str]
    requires_auth: bool
    auth_status: Optional[str]
    pending_action: Optional[dict[str, Any]]
    extracted_entities: dict[str, Any]
    compliance: dict[str, Any]
    result: Optional[dict[str, Any]]
    audit: list[dict[str, Any]]
