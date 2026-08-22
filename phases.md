# SIH PS-04 Implementation Plan

## Phase 1 — Foundation
- FastAPI + Next.js
- LangGraph state
- customer/session model
- audit events

## Phase 2 — Banking + KYC
- balance
- KYC status
- document verification
- core banking mock

## Phase 3 — Demat + Equity
- open Demat
- link BO ID
- quote
- buy shares from bank balance
- authorization checkpoint
- transaction receipt

## Phase 4 — FX + Compliance
- indicative rates
- compliant FX workflow
- LRS tracking
- purpose/eligibility checks
- blocked transaction demonstration

## Phase 5 — Advanced agentic behavior
- RAG over versioned policy documents
- recommendation agent
- credit assessment / Loan Against Shares
- exception routing
- rollback/compensation

## Phase 6 — Jury experience
- React Flow agent graph
- live tool traces
- compliance explanation cards
- metrics: latency, successful workflows, blocked unsafe actions
- offline demo fallback

### Mentoring rule

Do not spend the remaining hackathon time adding ten more financial products. Make three journeys flawless:

1. Demat opening/linking
2. Bank-funded stock purchase
3. Compliance-gated FX workflow

Those three demonstrate the breadth of PS-04 while preserving a coherent agentic story.
