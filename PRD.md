# PRD — Nexus Bank AI (SIH PS-04)

## 1. Positioning

**One conversational banking layer for banking, securities and compliant FX workflows.**

The system should demonstrate how an agentic architecture can coordinate multiple regulated financial capabilities without giving an LLM direct authority to move money.

## 2. Priority feature set

| Priority | Feature | Jury value |
|---|---|---|
| P0 | Multi-agent orchestration | Core SIH requirement |
| P0 | KYC-aware onboarding | Reuses bank context |
| P0 | Demat open/link | Strong banking + wealth integration |
| P0 | Direct equity purchase from bank balance | Best end-to-end transaction demo |
| P0 | HITL authorization | Safety + agentic workflow |
| P0 | Compliance engine | Shows AI is constrained |
| P1 | FX rate + compliant trade/remittance workflow | Cross-border capability |
| P1 | Audit dashboard | Makes orchestration visible |
| P2 | Credit/margin funding | Advanced wow factor |
| P2 | Personalized recommendations | AI differentiation |

## 3. Non-negotiable design rule

The LLM may interpret intent and coordinate agents, but **must not be the source of truth for money movement, regulatory limits, KYC status, balances, order quantities or authorization**. Those values come from typed backend services and policy rules.

## 4. Demat journey

1. Triage identifies Demat request.
2. KYC agent checks verified KYC.
3. Depository agent checks existing account/link status.
4. If opening/linking is allowed, workflow prepares action.
5. HITL requests M-PIN/e-sign simulation.
6. Mock depository executes.
7. Receipt contains BO ID and audit trail.

## 5. Equity journey

1. Extract symbol + quantity.
2. Quote price.
3. Confirm linked Demat.
4. Check bank balance.
5. Calculate estimated total including sandbox charges.
6. Pause for authorization.
7. Mark/hold funds in production architecture.
8. Submit order to broker.
9. On success, settle/debit; on failure, release hold.
10. Return order receipt.

## 6. FX journey

1. Extract currency pair, side and amount.
2. Get indicative rate.
3. Check customer eligibility.
4. Check applicable LRS/purpose/compliance rules.
5. Reject prohibited/unavailable routes.
6. Show quote.
7. Pause for authorization.
8. Execute only through an authorised/sandbox route.
9. Return reference and audit trail.

## 7. AI differentiation

Use AI for:
- intent and entity extraction,
- policy retrieval and explanation,
- personalized product discovery,
- agent routing,
- exception handling,
- natural-language explanations.

Use deterministic services for:
- balance,
- KYC status,
- limits,
- pricing calculation,
- authorization,
- transaction execution,
- compliance blocking.

This separation is essential for credibility.
