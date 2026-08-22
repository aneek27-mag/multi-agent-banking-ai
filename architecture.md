# System Architecture — SIH PS-04

## 1. High-level flow

```text
Customer
   |
   v
Triage Agent
   |
   +--> KYC & Onboarding ----+
   |                         |
   +--> Wealth & Securities -+--> Risk / Compliance --> HITL --> Execution
   |                         |
   +--> Forex & Remittance --+
   |
   +--> Core Banking
```

## 2. Transaction boundary

The LLM/agent layer is an **orchestrator**, not a ledger.

```text
LLM / Agents
   |
   | structured command
   v
Typed tool/API boundary
   |
   +--> Core Banking mock
   +--> Depository mock
   +--> Broker mock
   +--> FX mock
   +--> Compliance rules
```

No frontend value is trusted for a balance, limit, price, KYC state or authorization decision.

## 3. End-to-end equity purchase

`intent -> quote -> KYC/Demat -> funds check -> risk check -> authorization -> fund hold -> broker order -> settlement -> receipt`

The current sandbox collapses the hold/settlement into deterministic mock execution. In production, use a real two-phase transaction or compensating transaction with idempotency keys.

## 4. End-to-end Demat

`intent -> KYC -> depository lookup -> open/link -> e-sign/HITL -> depository confirmation -> BO ID`

## 5. End-to-end FX

`intent -> quote -> customer eligibility -> purpose/compliance -> LRS check where applicable -> authorised execution route -> receipt`

Do not expose an unrestricted offshore forex workflow to Indian residents.

## 6. Observability

The jury dashboard should show:
- active agent,
- event,
- tool/API invoked,
- compliance decision,
- authorization checkpoint,
- final transaction reference.

Never show secrets, raw OTPs, M-PINs or unnecessary PII.

## 7. Production upgrade path

Replace the mock services with:
- bank core APIs,
- SEBI-registered broker/DP/depository integrations,
- authorised FX/ETP/exchange rails,
- durable PostgreSQL LangGraph checkpointer,
- Redis for short-lived session data,
- policy RAG with versioned regulatory sources,
- signed/idempotent transaction commands,
- SIEM/audit storage.
