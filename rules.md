# Development Rules & Architectural Guardrails (rules.md)

## 1. Core Architecture & State Design
* **Keep State Typed:** Use `TypedDict` or Pydantic for your global state to keep it minimal and explicit. 
* **Immutability Mindset:** Treat each node function as a pure function; always return a partial state update rather than mutating inputs directly.

## 2. Approved Libraries & Tech Standards
* **Orchestration & Workflow:** Use `langgraph` for stateful multi-agent execution and cyclical graphs.
* **Backend & Storage:** Use `fastapi` with asynchronous endpoints. Use `postgresql` as a durable checkpointer (which is essential for the `interrupt()` function) to ensure you do not lose state when pausing the graph for user input.
* **Retrieval & Verification:** Use `qdrant-client` or `pinecone-client` for policy RAG retrieval.

## 3. Error Handling & Resilience
* **Multi-Level Handling:** Address error handling at the node level (by passing typed error objects into the state), the graph level (via conditional routing), and the application level.
* **Use RetryPolicy for Transient Errors:** Instead of building manual retry loops, attach LangGraph's built-in `RetryPolicy` to nodes interacting with external APIs. Because LangGraph executes parallel branches in supersteps, a transient failure in one branch can roll back the entire state update; using `RetryPolicy` isolates the failure and prevents it from poisoning the entire superstep.
* **Let Logic Bugs Crash:** Do not catch or retry `TypeError`, `KeyError`, or schema mismatches. Let them crash loudly so they can be tracked as bugs, rather than silently failing and wasting LLM calls.
* **Graceful Degradation:** When dealing with unstable tools, limit retries and switch to simpler fallbacks (like a cached response or human escalation) while keeping the user informed.

## 4. AI Boundaries & Safety Guardrails
* **Human-in-the-Loop (HITL):** Use dynamic interrupts (`interrupt()`) to pause the graph on sensitive actions, such as fund transfers, Demat creation, or when encountering a user-fixable error (e.g., a missing document clause).
* **Harden Tools and Boundaries:** Validate external inputs with schema and range checks, authenticate tool backends, and prefer allowlists over wildcards for tool execution.
* **Secure the State:** Treat your graph's state as sensitive data, as it carries user inputs, prompts, and tool outputs. Ensure no client-side financial logic is trusted without backend verification.