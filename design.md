# UI/UX Design Specifications (design.md)

## Project: Multi-Agent System for Integrated Banking, Wealth, and Forex Services
**Smart India Hackathon (SIH) - Problem Statement 2604**

---

## 1. Design Philosophy
The system must balance **consumer-facing simplicity** with **technical transparency** for the hackathon judges. 
*   **For the User:** The interface should feel like a premium, trustworthy banking application—minimalistic, guided, and secure.
*   **For the Jury:** The interface must expose the "brain" of the AI. Without visibility into the multi-agent orchestration, the project will look like a basic ChatGPT wrapper.

---

## 2. Global Styling & Theming

### 2.1 Color Palette
To convey trust, financial stability, and clarity, we use a modern FinTech palette:
*   **Primary Brand:** Deep Navy Blue (`#0F172A`) - Used for headers, primary buttons, and the main chat UI.
*   **Secondary/Accent:** Emerald Green (`#10B981`) - Used for successful transactions, stock growth indicators, and "Proceed" actions.
*   **Backgrounds:** 
    *   App Background: Very Light Gray (`#F8FAFC`)
    *   Chat Area: Pure White (`#FFFFFF`)
*   **System Alerts (Semantic):**
    *   **Warning/OTP:** Amber (`#F59E0B`) - For human-in-the-loop interruptions.
    *   **Error/Block:** Crimson Red (`#EF4444`) - For compliance blocks (e.g., LRS limit breached) or insufficient funds.

### 2.2 Typography
*   **Font Family:** `Inter` or `Roboto` (System sans-serif fallback).
*   **Weights:** 
    *   Regular (400) for chat bubbles and standard text.
    *   Medium (500) for labels and interactive card titles.
    *   Semibold (600) for numeric financial values (balances, exchange rates).

---

## 3. Core Layout Structure

The web application will use a **Dual-Pane Layout (Split Screen)** on desktop view to cater to both the user and the judges simultaneously.

### 3.1 Left Pane: The Consumer Interface (60% width)
This pane simulates the customer's mobile or web banking experience.
*   **Header:** Bank Logo, User Profile snippet (Name, KYC Status).
*   **Chat History:** Scrollable area for conversation.
    *   *User Bubbles:* Right-aligned, solid Primary Blue background.
    *   *Agent Bubbles:* Left-aligned, light gray background.
*   **Input Area:** Text input field with a "Send" button and an optional voice-to-text microphone icon.
*   **Interactive Cards:** Instead of plain text, complex data will render as rich UI cards (see section 4).

### 3.2 Right Pane: The Orchestration Audit Dashboard (40% width)
This pane is purely for the SIH Jury to evaluate the AI's architecture.
*   **Live Agent Graph:** A visual node-based graph (using React Flow) showing the LangGraph state.
    *   *Behavior:* When the `Triage Agent` passes data to the `Wealth Agent`, the connecting edge visually pulses/lights up.
*   **State & Tool Log Terminal:** A dark-mode terminal window logging the real-time background processes.
    *   Displays `POST /api/account/block-funds` JSON payloads.
    *   Displays explicit compliance checks (e.g., `[COMPLIANCE] LRS Check Passed: $4,500 / $250,000 used.`)

---

## 4. Interactive UI Components (Human-in-the-Loop)

Text alone is insufficient for a banking app. The chat must render structured components when requiring user action or displaying data.

### 4.1 Authentication Card (M-PIN / OTP)
*   **Trigger:** When the graph executes an `interrupt()` for a high-risk action (trade, outward remittance).
*   **Design:** A modal-style card within the chat containing a 4-digit or 6-digit hidden input field, a timer for OTP expiry, and a "Verify & Execute" button.

### 4.2 Financial Receipt Card
*   **Trigger:** Upon successful execution of a transaction.
*   **Design:** A clean summary box containing:
    *   Transaction ID (Mocked).
    *   Asset/Currency Details.
    *   Timestamp.
    *   Status Badge (Green "Settled" or "Funds Blocked").

### 4.3 Demat E-Sign Prompt
*   **Trigger:** During the 1-Click Demat onboarding flow.
*   **Design:** A card displaying the compiled mock PDF of the application form, accompanied by a prominent "Sign via Aadhaar" button.

---

## 5. Responsive Behavior
*   **Desktop/Tablet:** Standard Dual-Pane Layout (Chat + Audit Dashboard side-by-side).
*   **Mobile:** 
    *   The Audit Dashboard is hidden by default to preserve the illusion of a standard mobile banking app.
    *   A floating action button (FAB) or a toggle switch in the header allows the user/judge to flip between the "Chat View" and the "Audit View".
