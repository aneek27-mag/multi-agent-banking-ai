# Nexus Bank AI — Agentic Banking Intelligence Platform

**Smart India Hackathon prototype.** A conversational and visual demonstration of how specialized AI agents can collaborate across a bank's entire customer lifecycle — acquisition, onboarding, intelligence, recommendation, engagement and risk — while every sensitive decision stays under human oversight.

> **This is a simulated prototype.** It does not connect to any real bank, core banking system, credit bureau, KYC/Aadhaar/PAN verification service, payment rail, or messaging provider. All customers, transactions, documents and balances are synthetic demo data. See [Important limitations](#important-limitations) below.

---

## Problem statement

Retail banks run customer acquisition, KYC, personalization, engagement and fraud monitoring as separate, disconnected systems and teams. Nexus demonstrates a single **agentic AI layer** that sits across that entire lifecycle — routing intent, extracting structure from documents, building a living customer profile, recommending the next best action, drafting outreach, and screening for anomalies — without ever being the system of record for money movement, KYC status, or risk decisions. Those stay in deterministic, typed logic; the AI recommends, a human or a rule ultimately decides.

## Solution

A Next.js application presenting one coherent product experience:

| Area | What it does |
|---|---|
| **Dashboard** | Executive home page — portfolio KPIs, an "AI Executive Overview," daily AI brief, and top AI insights. |
| **Customers / Customer 360** | Segmentable customer portfolio and a flagship single-customer view (health, engagement, risk, AI opportunity, explainable next-best-action). |
| **AI Assistant** | A banking-intelligence chat assistant with customer context, suggested prompts, and structured (INSIGHT / KEY SIGNALS / RECOMMENDATION / CONFIDENCE) responses. |
| **Agents** | The Agent Control Center — a registry of the specialized agent personas, their live (simulated) activity feed, and a human escalation queue. |
| **Onboarding** | AI-assisted KYC: a demo document-extraction and identity-consistency pipeline, a "Process with AI" live multi-agent animation, and a full acquisition wizard with an AI account recommendation. |
| **Analytics** | Executive banking intelligence — acquisition funnel, digital adoption, segmentation, AI product opportunity, engagement, risk, agent performance, and automation-impact benchmarks. |
| **SIH Demo Mode** (`/demo`) | An 8-stage, presenter-controlled, fully deterministic walkthrough of the entire customer lifecycle for one demo customer (Rahul Sharma), built for judge presentations. |
| **Engagement / Risk & Fraud** | Present in navigation and wired to real Analytics data; intentionally scoped as lighter placeholder workspaces for this prototype phase rather than full case-management modules (see [Known scope boundaries](#known-scope-boundaries)). |
| **Settings** | Lightweight, demo-only workspace preferences (theme, notification and AI response toggles, environment/system status). Not real account settings. |

## Agent architecture

The product is framed around specialized agent personas that appear consistently across the Agent Control Center, Onboarding's live processing animation, and Demo Mode:

- **Customer Acquisition Agent** — reads stated requirements and recommends an account type.
- **KYC / Document Verification Agent** — extracts and cross-checks simulated identity documents.
- **Customer Intelligence Agent** — builds the behavioral profile (health, engagement, risk, opportunity).
- **Recommendation Agent** — matches profile signals to a next-best banking product, with an evidence list and a confidence score.
- **Risk & Fraud Agent** — screens for anomalies (unusual amount, new location, unusual time, new merchant).
- **Engagement Agent** — drafts a personalized (simulated) outreach message.
- **Human Escalation Agent** — routes low-confidence or sensitive cases to a human reviewer and records an audit trail.

**Non-negotiable design rule:** the AI layer interprets intent and proposes actions; it is never the source of truth for a balance, a KYC status, a risk decision, or an executed transaction. Those come from typed, deterministic demo services (`services/*.ts`), not from a language model.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript.
- **Styling:** a single hand-written design system (`globals.css`) — no CSS framework.
- **Charts:** Recharts. **Icons:** lucide-react.
- **AI:** a server-only Next.js Route Handler (`app/api/assistant/route.ts`) proxies to Groq's OpenAI-compatible API. The API key never reaches the browser. If no key is configured, every AI surface (Assistant, Onboarding's "Ask AI to elaborate," the Analytics Executive Brief) transparently falls back to realistic, deterministic mock responses — **the full product, including Demo Mode, works completely offline with zero external calls.**
- **State:** all data is typed, centralized mock data (`data/*.ts`) plus a small in-session store (`state/demoStore.ts`) using `useSyncExternalStore`, persisted to `sessionStorage` so a hard page reload doesn't lose session-created data (e.g. a customer created through the Onboarding wizard).

## Demo flow (`/demo`)

An 8-stage, judge-facing walkthrough, reachable from the sidebar ("SIH Demo Mode") or directly at `/demo`:

1. **Intelligent Acquisition** — AI reads requirements, recommends an account type.
2. **Intelligent Onboarding** — simulated document extraction and verification.
3. **Customer Intelligence** — health / engagement / risk / opportunity + financial signals.
4. **Multi-Agent Decision** — four agents run in sequence to reach one explainable recommendation.
5. **Personalized Engagement** — a simulated outreach message is generated (never actually sent).
6. **Risk Intelligence** — a contrasting, separate anomalous-transaction scenario.
7. **Human Oversight** — a human reviewer clears, escalates, or requests more information.
8. **Executive Intelligence** — the same signals roll up into a portfolio-level KPI + AI brief view, followed by a lifecycle summary.

The demo is fully deterministic (no `Math.random()`, no dependency on Groq), supports Previous / Next / Restart / Exit, an auto-play mode with per-stage timing, and keyboard shortcuts (← → R Esc). It never mutates the shared session state used by the rest of the app, so it is safely repeatable.

## Local setup

### Frontend (the only thing you need to run the live app)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

Copy `frontend/.env.example` to `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | No | Server-side only, read by `app/api/assistant/route.ts`. Leave blank to run entirely on the mock AI fallback — the app is fully demoable without it. |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-20b`. |

`GROQ_API_KEY` is never exposed to the browser and must never be prefixed `NEXT_PUBLIC_`.

### Backend (`backend/`) — present in the repo, not used by the live app

The `backend/` directory contains a LangGraph/FastAPI prototype exploring a separate banking/Demat/forex agentic workflow. It is **not wired into the frontend that is actually running** — the live product described above is a self-contained Next.js application. It's kept in the repo as an earlier architectural exploration; see `backend/README.md`-equivalent notes in `architecture.md`/`phases.md` for that track's own design docs. Running the frontend does not require the backend.

## Deployment (Vercel)

1. Import the repo, set the **root directory to `frontend/`**.
2. Build command: `npm run build` (default). Output: Next.js default (no static export — the app uses server-rendered routes and a server-only API route).
3. Set `GROQ_API_KEY` (and optionally `GROQ_MODEL`) as **server-side** Vercel environment variables — never as a `NEXT_PUBLIC_*` variable, and never checked into the repo. Leaving it unset is safe; the app falls back to mock AI responses.
4. No database, external storage, or additional services are required.

## Known scope boundaries

This is a hackathon prototype, deliberately scoped:

- **Engagement** and **Risk & Fraud** are present in navigation and link to real, populated Analytics data, but do not yet have their own case-management pages (Onboarding's Human Review Queue and Demo Mode demonstrate the same "case → human decision → audit trail" pattern in their own domains).
- No real Aadhaar/PAN/KYC verification, no real payment or core-banking integration, no real messages/emails/SMS are ever sent, and no real transactions are ever executed.
- All customer, transaction and document data is synthetic. Aadhaar-style numbers are masked; PAN-style numbers are fictional.

## Important limitations

- Do not present this project as connected to a real bank, broker, depository, credit bureau, or government identity system.
- Every "verified," "approved," or "recommended" state in the UI is a simulated demo assessment, not a real legal or financial decision — see the responsible-AI disclaimers shown throughout the product (e.g. "Demo AI assessment — not an actual legal KYC decision," "AI recommendation only — not an eligibility or approval decision").
