# Skills Roadmap to 2028

**Profile:** 10 years experience in Node.js and React. Gap: not database-heavy apps.

**How to read this:** Every topic below uses a **What / Why / How** pattern.
- **What** — the skill in one line.
- **Why** — why it matters for *you* specifically by 2028.
- **How** — the concrete way to learn or practice it.

---

## The honest framing

Node + React aren't going anywhere by 2028 — but the *baseline* is rising. "Can build a React SPA with a Node API" is becoming table stakes that a mid-level dev plus an AI assistant can do. Your 10 years of experience needs to buy you something a junior-plus-AI can't replicate. That's where you should aim.

The three big bets, in priority order: **AI application engineering**, **the modern data layer** (closes your gap), and **staff-level architecture** (matches your seniority).

---

## 1. AI Application Engineering

The single highest-leverage area, because it sits directly on top of your existing TypeScript/JS skills.

### 1.1 LLM fundamentals & API orchestration
- **What:** Calling LLM APIs well — messages, system prompts, streaming, structured/JSON output, temperature and token control.
- **Why:** This is the new "REST client" skill. It's pure API orchestration — exactly your strength — and every other AI skill builds on it.
- **How:** Build a small chat backend in Node/TS that streams tokens to a React UI. Force yourself to use structured output (JSON schema) and handle streaming, retries, and errors cleanly.

### 1.2 Retrieval-Augmented Generation (RAG)
- **What:** Feeding an LLM relevant context retrieved from your own data (docs, DB rows) so answers are grounded and current.
- **Why:** The most common production AI pattern by far. Almost every "AI feature" request in a company is really a RAG problem.
- **How:** Chunk documents → embed them → store in a vector DB → retrieve top-k by similarity → inject into the prompt. Build one end-to-end (this is also your database project — see §2.4).

### 1.3 Agents & tool calling
- **What:** Letting the LLM decide to call your functions/APIs ("tools"), loop over results, and take multi-step actions.
- **Why:** This is where AI moves from "answers questions" to "does work." It's the frontier of demand for 2027–2028.
- **How:** Define 2–3 tools (e.g. search, DB lookup, send email) and wire a tool-calling loop. Learn to bound it: max steps, guardrails, human-in-the-loop confirmation for risky actions.

### 1.4 Evals & reliability
- **What:** Measuring whether your AI feature is actually *good* — regression tests for prompts, scoring output quality, catching degradation.
- **Why:** This is the skill that separates a senior engineer from a demo-builder. It's scarce, it's hard to fake, and it's exactly where your judgment is worth more than a junior + AI.
- **How:** Build a small eval set (inputs + expected qualities), score outputs (exact-match, LLM-as-judge, or heuristics), and run it in CI so prompt changes can't silently regress.

### 1.5 Cost & latency engineering
- **What:** Making AI features fast and cheap — caching, model routing (small model for easy tasks, big for hard), token budgets, streaming for perceived speed.
- **Why:** Very "senior engineer" flavored. At scale these decisions are the difference between a feature that ships and one that's too expensive to run.
- **How:** Add prompt caching and a cheap-vs-capable model router to your RAG app. Measure cost-per-request and p95 latency before and after.

---

## 2. The Modern Data Layer (closes your gap)

Don't learn databases as a chore. Learn the modern data layer — it now overlaps heavily with AI, so this both fixes your weakness and feeds §1.

### 2.1 Postgres, deeply
- **What:** Real fluency in one relational database — SQL beyond CRUD, transactions, constraints, connection pooling.
- **Why:** Postgres is the default answer for most apps in 2026+. It's your literal resume gap, and it's very fillable.
- **How:** Take an existing side project and own its DB layer by hand for once — no ORM hiding things. Write joins, use transactions, read the query plans.

### 2.2 Data modeling
- **What:** Designing schemas — normalization vs. denormalization, relationships, when to use JSONB, migrations.
- **Why:** Bad data models cause the expensive problems that are hard to undo later. This is the part of "database-heavy" that is real engineering judgment.
- **How:** Model a non-trivial domain (e.g. multi-tenant SaaS) from scratch. Practice writing forward and backward migrations safely.

### 2.3 Query performance
- **What:** Indexes, `EXPLAIN ANALYZE`, avoiding N+1, understanding when queries get slow and why.
- **Why:** "Works on my machine with 100 rows" vs. "works with 10M rows" is a senior distinction interviewers probe for.
- **How:** Seed a table with millions of rows, write a slow query, then make it fast with the right index. Read the plan before and after.

### 2.4 Vector databases & embeddings
- **What:** Storing embeddings and doing similarity search (pgvector, or a dedicated store) — the retrieval half of RAG.
- **Why:** This is exactly where "databases" and "AI" merge. Learning it closes your DB gap *and* powers §1.2. Two birds, one project.
- **How:** Use `pgvector` in your Postgres so you learn one database, not two. Build the retrieval pipeline for your RAG app on top of it.

---

## 3. Staff-Level Architecture (matches your seniority)

At 10 years, the market wants more than a strong IC coder.

### 3.1 System design at scale
- **What:** Designing whole systems — caching layers, queues, load balancing, data flow, failure modes, tradeoffs.
- **Why:** AI makes individual coding cheaper, which makes *judgment about what to build and how* more valuable, not less. This is the senior/staff interview.
- **How:** Practice designing 8–10 real systems on paper (rate limiter, notification service, feed, etc.). Focus on articulating tradeoffs out loud, not memorizing diagrams.

### 3.2 Distributed systems fundamentals
- **What:** Consistency vs. availability, idempotency, retries, eventual consistency, message queues, background jobs.
- **Why:** Every non-trivial product hits these. Knowing the failure modes before they bite is what "senior" buys the company.
- **How:** Add a queue + background worker to your RAG app (e.g. async document ingestion). Make it idempotent and handle retries.

### 3.3 Technical leadership
- **What:** Mentoring, setting technical direction, turning vague product asks into shippable plans, writing design docs.
- **Why:** The clearest path to staff/principal and higher comp. It's also the least automatable skill on this list.
- **How:** Volunteer to lead one initiative at work end-to-end. Write the design doc, get buy-in, mentor someone through part of it.

---

## 4. Supporting Skills (don't over-invest, don't ignore)

### 4.1 TypeScript, deeply
- **What:** Advanced types — generics, conditional/mapped types, inference, strict mode discipline.
- **Why:** TS is now the default for serious JS work, and AI-app SDKs are TS-first. Deep TS makes you faster and safer.
- **How:** Turn on strict mode everywhere and fix the errors properly. Type a genuinely generic utility (e.g. a typed API client) by hand.

### 4.2 Cloud, serverless & edge
- **What:** Comfort deploying and operating — AWS (or similar), containers, serverless/edge functions, basic IaC.
- **Why:** Enough to *own* your deployment, not to become a DevOps specialist. Owning the full lifecycle is a senior expectation.
- **How:** Deploy your RAG app to a real cloud with a container or serverless setup. Add basic monitoring and one IaC file.

### 4.3 Being fast with AI coding tools
- **What:** Genuine fluency with tools like Claude Code / Copilot — delegating well, reviewing AI output critically, staying in flow.
- **Why:** A meta-skill that multiplies everything else. By 2028 the gap between engineers who wield these well and those who don't will be large.
- **How:** Use them daily on real work. Practice writing tight specs, reviewing generated diffs, and knowing when *not* to trust the output.

---

## A concrete ~12-month path

1. **Now → 3 months:** Build one real RAG app end-to-end — Postgres + pgvector, a Node/TS backend, a streaming React UI. Hits §1.1, §1.2, §2.1–2.4 at once.
2. **3 → 6 months:** Add evals, observability, and cost/latency work (§1.4, §1.5). Learn to measure and improve output quality — this is the differentiator.
3. **6 → 12 months:** Add async ingestion with a queue (§3.2), deploy it properly (§4.2), then go deep on system design (§3.1) and lead an initiative in the open (§3.3).

---

## One-sentence summary

Become the senior engineer who ships reliable AI features on a solid data layer — it turns your two "gaps" (AI, databases) into a single moat that your existing Node/React experience makes you unusually well-positioned to build.
