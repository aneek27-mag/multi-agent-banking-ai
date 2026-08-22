# System Memory & Context Management (memory.md)

## Project: Multi-Agent System for Integrated Banking, Wealth, and Forex Services
**Smart India Hackathon (SIH) - Problem Statement 2604**

---

## 1. Memory Architecture Overview
For a multi-agent banking system, relying on standard LLM context windows (simply appending strings of chat history) is insufficient and dangerous. The system must maintain structured, deterministic memory across three distinct layers:

1.  **Global Graph State (Short-Term/Session Memory):** Managed by LangGraph's `TypedDict`. This dictates the current transaction flow and agent hand-offs.
2.  **Persistent Ledger (Long-Term Memory):** Managed by PostgreSQL. This is the immutable record of truth (balances, settled trades, KYC status).
3.  **Semantic Vector Store (Knowledge Memory):** Managed by Pinecone/Qdrant. This stores static banking regulations and RAG documents.

---

## 2. Global Graph State (LangGraph)
This is the "working memory" of the session. It must be passed between the Supervisor, Triage Agent, and specialized worker agents.

### 2.1 State Schema Definition (Python `TypedDict`)
```python
from typing import TypedDict, Annotated, List, Optional
from langchain_core.messages import BaseMessage
import operator

class MultiAgentState(TypedDict):
    # Chat History
    messages: Annotated[List[BaseMessage], operator.add]
    
    # User Context (Loaded at Login)
    user_id: str
    kyc_status: str  # e.g., "VERIFIED", "EXPIRED"
    is_hni: bool     # High Net Worth Individual flag for custom Forex spreads
    
    # Active Transaction Context (Populated by Agents)
    current_intent: Optional[str]        # e.g., "buy_stock", "remit_forex"
    active_agent: str                    # Tracks which agent holds the baton
    pending_transaction_id: Optional[str]
    
    # Human-in-the-Loop Flags
    requires_auth: bool                  # Flips to True when M-PIN/OTP is needed
    auth_status: Optional[str]           # "PENDING", "SUCCESS", "FAILED"
    
    # Extracted Entity Memory (Prevents agents from asking for data twice)
    extracted_entities: dict             # e.g., {"ticker": "TCS", "qty": 50, "currency": "USD"}
```

---

## 3. Persistent Ledger (PostgreSQL)
Agents must never "remember" a bank balance via chat history; they must query the ledger. This prevents hallucinations where an LLM assumes a transaction succeeded.

### 3.1 Core Memory Tables (Mock Schema)
*   **`users_table`:** `user_id`, `name`, `pan_number`, `kyc_last_updated`.
*   **`accounts_table`:** `account_id`, `user_id`, `available_balance`, `lien_blocked_balance`.
*   **`lrs_tracking_table`:** `user_id`, `fiscal_year`, `total_usd_remitted`.
*   **`demat_holdings_table`:** `bo_id`, `ticker`, `quantity`, `avg_buy_price`.

---

## 4. Semantic Knowledge Memory (RAG)
Agents need memory of complex rules to execute tasks correctly without hardcoding every policy into the prompt.

*   **Data Stored:** Chunked PDFs of RBI Forex guidelines (FEMA), SEBI Demat regulations, and internal bank loan policies.
*   **Retrieval Trigger:** If the `Compliance Agent` detects a query about margin limits, it queries the Vector DB for "Loan Against Shares margin limits for blue-chip stocks" and appends the result to its context before making a decision.

---

## 5. Memory Safety Guardrails
1.  **State Reset on Completion:** Once a transaction (e.g., Demat account opening) reaches a terminal success state, the orchestrator must clear the `current_intent` and `extracted_entities` from the LangGraph state to prevent cross-contamination of future queries.
2.  **No Financial Inference:** The LLM must not infer transaction success from the conversation memory. Example: Just because the user said "Here is my M-PIN," the LLM cannot assume the trade succeeded. It must rely strictly on the `auth_status` flag updated by the backend validation function.
