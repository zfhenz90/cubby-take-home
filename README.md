# Cubby 2 Bed — Supplier Product Detail Page

A working prototype of a **Product Detail Page (PDP)** for the Cubby 2 Bed, built for
the DME supplier persona **Sarah**. It implements "Opportunity 1" from [pitch.md](./pitch.md):
replace the portal's buried PDFs and static pages with **structured, findable product
data** so a busy account manager can answer a family's question, confirm a state's
coverage pathway, and grab the right form in well under 30 seconds.

## Quick Start

> **Node ≥ 20.19 required** (the toolchain uses Vite 8 / Tailwind v4 / Vitest 4).
> If you use `nvm`: `nvm install 22 && nvm use 22`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run test     # Vitest (unit + integration + page smoke)
npm run build    # tsc -b && vite build
npm run lint     # eslint
```

## What's in this Project

The page loads a single product through a mock API and renders every required detail,
with two interactive features doing the heavy lifting on findability:

- **Coverage Checker** — pick a state and get a straight answer to "what applies here?":
  the Medicaid requirement pathway, which **LMN guide group(s)** a provider should
  follow, and a deep link to the exact guide PDF. This is the highest-stakes feature and
  the focus of the tests.
- **Quick-Find** — a sticky, deterministic search over the whole page (specs, SKUs,
  packages, coverage). Selecting a result jumps and focuses the relevant section. Paste a
  SKU like `CUB-2101` and land on it instantly.

Plus the full product record: hero + pricing, why-it-stands-apart, peer-reviewed research outcomes, new improvements, bed options with SKUs/MSRP, add-on packages, an organized **Documents** library, supplier **incentives** as a path-to-sale, and contact details.

## Front End Architecture

Data never lives in the view. Components depend on a **service seam**; today it returns
typed local data after a simulated delay, and can be swapped for a real API without
touching a single component.

```
data/         raw, verbatim source data (product record, states, coverage membership)
 └─ product.ts, states.ts, coverage.ts
lib/          pure, framework-free logic (unit-tested)
 └─ coverage.ts (resolveCoverage), search.ts, format.ts, anchors.ts
services/     the swap-to-API seam — async, simulated latency, injectable for tests
 └─ productService.ts, coverageService.ts, delay.ts
hooks/        useProduct / useCoverage — exhaustive loading/error/success states
components/
 ├─ common/   Section, Badge, LoadingState, ErrorState
 └─ pdp/      ProductDetailPage (orchestrator) + one component per section
types/        Product and coverage domain contracts
```

Key decisions:

- **`data/coverage.ts` is a faithful transcription of the design doc and nothing else;**
  `lib/coverage.ts` holds the logic that composes it. Separating source-data from logic
  is what makes the logic unit-testable and the data reviewable against the doc.
- **Product data is a typed `const`, not JSON** — TypeScript checks it against the
  `Product` contract at build time, catching a mistyped SKU or price before it ships.
- **Loading/error are first-class** via discriminated-union hook state, so the UI can't
  forget to handle them.
- **Deterministic, dependency-light styling** with Tailwind v4 tokens (`@theme`) mapped to
  the design palette/fonts — one source of truth in `src/index.css`.

### Two data quirks worth knowing

Both are transcribed faithfully and pinned by tests:

1. **Louisiana and North Carolina appear in _both_ LMN Group A and Group B.** Coverage
   therefore models LMN groups as an array, and the Coverage Checker renders both.
2. **LMN grouping and Medicaid listing are independent.** The LMN groups include states
   (ID, RI, SD, DC, …) that aren't in the Medicaid Requirements list, which ends with an
   "All other states" catch-all. So `medicaidListed` is a separate boolean with a fallback
   note.

_Assumption:_ the "Group 1"/"Group 2" LMN guide PDFs map to the "Group A"/"Group B" state
lists. This is the one inference I made from the source docs; it's isolated in
`data/product.ts` and easy to correct.

## Tests

Run with `npm run test`. Coverage percentage isn't the point; these protect the behaviors
that would actually hurt Sarah.

- **`lib/coverage.test.ts`** — the most important. A wrong coverage answer misleads a
  partner on reimbursement. It pins the LA/NC dual-group quirk, single-group states, the
  Medicaid-vs-LMN independence, and that **all 51 states resolve to at least one group**
  (so nobody can silently drop a state from the source sets).
- **`lib/search.test.ts`** — SKU lookup lands on the right section, case-insensitivity,
  AND-semantics narrowing, and empty-query behavior. Guards the core findability promise.
- **`components/pdp/CoverageChecker.test.tsx`** — the seam between correct logic and what
  renders: a dual-group state shows both badges and both guide links; an unlisted state
  shows the fallback note.
- **`components/pdp/ProductDetailPage.test.tsx`** — a smoke test that mounts the whole
  tree (loading → rendered sections) to catch wiring regressions.

## PHI handling

**This slice deliberately handles no PHI.** It works only with product attributes and
coverage-**rule** data — Medicaid requirement categories, LMN guide groupings, SKUs,
prices, and public documents. There are **no patient names, dates of birth, diagnoses,
plan/member details, or Letters of Medical Necessity** anywhere in the code or data.

- **What's stored:** static product and coverage-rule data, in-repo, all non-sensitive.
- **Where:** bundled with the client; there is no backend, database, or user session.
- **Who can see it:** anyone who can load the page — appropriate, because none of it is
  sensitive.
- **What's kept out:** all patient/PHI fields. The Coverage Checker takes only a
  **state**, never a patient, and its results are explicitly labeled "requirements and
  guidance only — not a per-patient coverage determination."

This is a scoping choice, not an oversight: focusing on product data delivers the pitch's
findability win with zero regulated-data surface. The moment this grows into the
authenticated, personalized experience (pitch "Opportunity 2" — saved submissions,
per-supplier progress), PHI scoping must be reassessed: a real backend, authn/z,
least-privilege access, encryption at rest/in transit, audit logging, and keeping PHI out
of logs, analytics, and any AI prompt.

## AI guardrails

**This prototype uses no LLM.** Quick-Find is deterministic keyword matching, and the
Coverage Checker returns transcribed rules — both are reproducible and can't invent an
answer. That's the right call for a foundation slice where trust matters; semantic/AI
search is a later opportunity (pitch "Opportunity 3").

The design reflects the fail-safe principle the assignment asks about, even without AI:
the coverage answer is scoped to what the source data actually supports and is labeled as
guidance, not a coverage guarantee. If an AI assistant were added later (e.g. "Is this
covered for a 7-year-old in Florida?"), the guardrails I'd implement:

- **Retrieval-grounded, not free-form:** answer only from the same structured coverage/
  product data, with citations to the source (the exact PDF/section). No ungrounded
  generation of coverage rules, pricing, or medical claims.
- **Refuse over guess:** when confidence or grounding is low, say "I don't have a verified
  answer" and route to the authoritative document or a human — a stale/blank answer is
  safe; a confident wrong one is not.
- **Hard guardrails around regulated claims:** never state a definitive coverage/
  eligibility determination; always defer that to the payer and the current source of
  truth.
- **Never ingest PHI into prompts**, and log for evaluation without storing sensitive
  inputs.

## Deliberately not built (and why)

**Authenticated, per-supplier state.** The incentive "path to sale" shows placeholder
progress; real per-partner progress, saved documents, and personalized coverage views
require auth, a backend, and a CRM/orders integration — that's pitch "Opportunity 2," a
different and larger slice. I kept this one to a single, fully-working public product page
so it's real from the UI down to the data rather than several half-built features. This
also keeps the slice entirely free of PHI (see above).

Other conscious cuts: a single hard-coded product (no multi-product catalog/routing,
though `ProductDetailPage` is kept route-ready), and no CMS wiring (data is a typed module
behind the service seam, which is exactly where a CMS/API would plug in).

## Next Steps
For full answers to the Systems Integrations questions, please see [systems-integration.md](./documentation/backend/systems-integration.md). 

To complete "Opportunity 1" and move onto Opportunities 2 and 3, we need to expand beyond 
just a frontend view. I've included a directory `documentation/backend-architecture/` that 
contains .png files documenting some potential directions we could build in. These suggested 
versions are very much suggestions, and it should be noted that everything after Version 1 
is "written in pencil". After Version 1 is complete, we have a little more flexibility on what 
to tackle next: some examples could be supporting new roles, personalization, product-drive 
chat bot, or tighter integrations with current systems.

## Stack & tooling notes

- **Stack:** React 19 + TypeScript (strict) + Vite 8, Tailwind v4, Vitest + React Testing
  Library. Chosen to match the provided scaffold and to show application _structure_
  (typed data seam, pure logic, tested behavior) rather than just styling.
- **AI assistance:** I used Claude Code to scaffold components, transcribe the
  design-doc data, and draft tests. My own judgment drove the decisions that matter: the
  coverage data model (spotting and preserving the LA/NC dual-group and Medicaid-vs-LMN
  quirks), choosing deterministic search over an LLM for trust, the service-seam boundary,
  what deserved a test, and the PHI scoping. The data was verified by hand against
  `design/product.md` and `design/product-detail-page.md`.
