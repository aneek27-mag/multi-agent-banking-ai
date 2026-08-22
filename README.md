
# multi-agent-banking-ai
It is a prototype of ai platform which has multiple ai agnets responsible for different works. It also contains the features of adding Demat account, purchasing stocks. It aso has forex or foreign currency exchange

# Nexus Bank AI — SIH PS-04

A hackathon sandbox demonstrating an autonomous multi-agent financial journey across **banking, Demat, equities and compliant foreign-exchange workflows**.

## What changed in this revision

### 1. Demat account lifecycle
- Reuse verified bank KYC for a mock Demat-opening journey.
- Link an existing 16-digit BO ID to the bank profile.
- Human-in-the-loop authorization before opening/linking.
- Mock depository state is visible to the audit trace.

### 2. Direct share purchase from the bank
- User can say: `Buy 10 shares of TCS`.
- Wealth agent identifies the symbol/quantity.
- Core Banking agent checks available balance.
- Linked Demat is mandatory.
- Funds are treated as a sandbox transaction and a confirmation checkpoint is shown before execution.
- Mock order ID and receipt data are returned.

### 3. Foreign-currency workflow
- User can say: `BUY 1000 USD`.
- Forex agent obtains an indicative rate.
- Risk & Compliance agent checks the user's sandbox LRS usage.
- Transactions exceeding the configured sandbox LRS limit are blocked.
- Authorization is required before execution.

> This is a simulation. It does not connect to a real bank, broker, depository, exchange, RBI-authorised ETP, or payment rail.

## Architecture

`User -> Triage -> Specialist Agent -> Risk/Core Banking/Depository -> HITL -> Execution -> Receipt`

Specialists:
- Triage Agent
- KYC & Onboarding Agent
- Wealth & Securities Agent
- Core Banking Agent
- Forex & Remittance Agent
- Risk & Compliance Agent
- Authorization Gateway
- Execution Agent

## Important SIH mentor correction

Do **not** pitch this as “an AI that trades forex freely”. For an Indian-resident customer, forex transactions must be with authorised persons and for permitted purposes; electronic forex transactions should use RBI-authorised ETPs or recognised stock exchanges. LRS cannot be used to remit margin to overseas exchanges/counterparties for online forex trading.

Therefore the demo calls this **“Compliant FX workflow / authorised-market sandbox”**, not unrestricted retail forex trading.

## Run

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

Sandbox M-PIN: `1234`.

## Demo script

1. `Open a Demat account using my verified KYC`
2. Enter `1234`.
3. `Buy 10 shares of TCS`
4. Enter `1234`.
5. `BUY 1000 USD`
6. Enter `1234`.
7. Show the right-side audit trace to the judges.
8. Try a BO ID such as `1234567890123456` to demonstrate Demat linking.
9. Demonstrate a deliberately oversized FX request to show the compliance agent blocking it.

## Why this is stronger than a chatbot

The important differentiator is not the chat box. It is the **stateful transaction workflow**:
- agents collaborate,
- deterministic controls enforce financial rules,
- sensitive actions pause for user authorization,
- execution is separated from recommendation,
- every important step produces an audit event.
