# Forge marketing site — content review (reference)

Internal notes from aligning [forgeplatform.software](https://forgeplatform.software/) copy with the **Forge Platform** (`../forge-core`) and **Forge Kit** (`../forge-kit`). Use this when iterating on messaging, pricing, and depth pages.

**Last captured:** 2026-03-31 (main review). **Appendix (ChatGPT + corrections):** 2026-03-31.

---

## Summary verdict

The public narrative matches the repos on **stack, architecture, and scope** (Java/Maven/Quarkus/AWS, zero-trust/stateless identity, core services, CI/CD, observability, operational tooling). **Pricing tiers** are coherent for B2B platform licensing. The main follow-ups are **evidence** (social proof, specificity), **depth pages** (Architecture / How it works / FAQ), and **technical honesty** where the repo roadmap differs from “fully hardened” production security controls.

---

## Strong alignment with `forge-core` / `forge-kit`

- **Positioning:** “Production-grade microservices”, zero-trust, horizontal scale, observability, disciplined delivery — matches `forge-core` (Cognito/JWT, services such as auth, audit, document, notification, gateways, OpenTelemetry/Jaeger/Prometheus-style observability, GitHub Actions, task-driven workflows).
- **Forge Kit:** Described as cross-cutting primitives; full platform extends with domain services, identity flows, notifications, audit — consistent with the site’s “foundational platform, not a feature bundle” and “core services” story.
- **Commercial framing:** Cost split (Forge licence vs AWS), with caveats on HA/multi-AZ, reads as transparent and appropriate for serious buyers.

---

## Nuances to keep in mind

| Topic | Note |
|--------|------|
| **Domain in the repo** | `forge-core` is written around a **recruitment marketplace** example domain (e.g. actors, documents, gateways). The site stays **generic** — good for horizontal positioning; in sales, separate “platform” from “example product domain” in the codebase. |
| **Security claims vs README** | Marketing emphasizes architecture and zero-trust. The **core README** also lists some **hardening** items as open or partial (e.g. CSP, CSRF, CORS, HTTPS enforcement). Architecture story is fair; for technical due diligence, consider addressing “what’s in the box vs roadmap” on a **Security** or **FAQ** page. |
| **Forge Kit vs full platform** | Kit is MIT, open-source primitives; full platform is the commercial product. A **short FAQ** (or footnote) helps engineers who land from GitHub. |

---

## Tone, pricing, and perception

- **Tone:** Confident, engineering-credible, not fluffy — appropriate for a serious platform.
- **Price bands (Builder / Scale / Enterprise):** Same platform across tiers, differentiated by org size and support — logical. Dollar amounts can read as **high value** for small teams and **“prove it”** for enterprise until support SLAs and scope are explicit.
- **Enterprise tier:** Custom pricing + founder/architect engagement fits the top of the funnel.

---

## Gaps that hurt “serious” more than word choice

1. **Social proof:** Customer marquee was removed (good if logos were not Forge). Until replaced, add at least one of: **case study**, **design partner**, **quote**, or **concrete metric**.
2. **Depth pages:** Architecture / How it works / FAQ still shallow or TODO — buyers look for detail after the hero.
3. **Carousel / CTAs:** Some cards still use placeholder `href="#"` — undermines “Explore Platform features” until real destinations exist.
4. **Screenshots:** Dev-style filenames (e.g. “Screenshot 2026-…”) on some carousel assets — minor trust hit; prefer stable, descriptive asset names.

---

## Copy and consistency punch list

- Unify **licence / license** and **Organisations / Organizations** for a single locale (US vs UK).
- Replace or rename **screenshot** assets for production polish.
- Optionally soften **“year-three operational maturity”** unless you can cite a concrete reference (doc, benchmark, or customer outcome).

---

## Suggested FAQ topics (for when pages exist)

1. What is included in the **licence** vs what runs on **our AWS bill**?
2. How does **Forge Kit** relate to the **full Forge Platform**?
3. What is your **security posture** (threat model, encryption, secrets, roadmap for edge hardening)?
4. What **support** and **SLAs** apply per tier?
5. Is the codebase tied to a **specific product vertical** (explain example domain vs reusable platform)?

---

## Priority order (after main nav / menu pages)

1. Substantiate **maturity and security** for skeptical engineers (facts, diagrams, honest roadmap).
2. Add **any defensible proof** (social proof, specificity, outcomes).
3. Add **one clear paragraph** on **Forge Kit vs full platform** for open-source visitors.

---

## Related repos (local paths)

- `../forge-core` — Forge Platform application monorepo (commercial licence in repo).
- `../forge-kit` — Open-source cross-cutting Quarkus components (MIT).

---

## Appendix: ChatGPT review (external)

Third-party feedback on homepage positioning. **ChatGPT did not have access to `forge-core` / `forge-kit` or the full `public/index.html` source**; several points below assumed **no pricing section** and a **narrow mental model of the repos**. Those assumptions are corrected inline so this appendix stays accurate.

### Corrections to ChatGPT’s assumptions (read first)

| Topic | What ChatGPT implied | Accurate as of this doc |
|--------|----------------------|-------------------------|
| **Pricing** | No pricing on the site, or “pricing pending”, weak transparency. | The homepage **already includes** a **Pricing** section: Builder / Scale / Enterprise, **monthly and annual** toggle, **employee-segment bullets**, Stripe “Get started” links, and copy that **same platform / different support** by tier. |
| **Buyer segmentation** | Missing customer segmentation. | Tiers segment by **org size** and **support level** (email vs priority/Slack vs enterprise). What’s still thin is **persona-specific pages** (CTO vs platform team), not absence of tiers. |
| **`forge-core`** | “API foundations, client/server integration, modular architecture”, emphasis on endpoints/FE integration. | `forge-core` is a **Quarkus microservices monorepo**: multiple **services** (auth, audit, document, notification, etc.), **applications/gateways**, **libs**, **UI apps**, AWS/Cognito, observability — not “just API plumbing.” |
| **Nav** | “Features, Pricing, Contact” only. | Primary nav includes **Architecture**, **How it works**, **FAQ**, **Pricing**, **Contact** (plus depth pages still WIP in places). |

Where ChatGPT’s points still apply, they’re retained below, sometimes **edited** so the doc doesn’t repeat false premises.

---

### 1) Content focus — what the homepage communicates

**Clear target audience**

The homepage is aimed at engineering teams building microservices and cloud systems — especially those that:

- Want an enterprise-grade architecture from day one.
- Care about zero-trust, scalability, cloud-native patterns.
- Want repeatable operational discipline (CI/CD, IaC, observability).

This fits if the product is a **microservices platform + operational model**. It reads enterprise-grade and developer-oriented:

- “Production-grade microservices from day one. Enterprise foundations. Startup speed.” — Strong positioning; suggests readiness for enterprise demand and fast-moving teams.
- Emphasis on zero-trust, observability, deployment discipline — architecture and ops differentiators CTOs and tech leads care about.

The messaging is **not** vague “cloud stuff”; it signals **opinionated engineering value**.

**Missing narrative for some audiences**

The copy is **technical/architectural** — good for engineers and CTOs, but:

- It could still **name buyer personas** more explicitly (e.g. startup vs platform team vs enterprise product group) and tie bullets to **business outcomes** (time-to-production, risk reduction), not only technical attributes.
- **ROI / TCO** is only partly implied (e.g. “fraction of the cost”, “days not months”). Serious buyers may still want **quantified** comparisons (hours saved, vs building in-house, vs other platforms) — that’s an enhancement, not a substitute for the existing pricing block.

---

### 2) Match with “Forge Kit” / “Forge Core”?

ChatGPT’s paraphrase of the repos was **generic**. With repo access:

- **`forge-core`** is the **full Forge Platform** codebase: services, shared libraries, gateways, UI modules, CI, task workflows, observability — aligned with the site’s deployment/ops/security story. The homepage correctly emphasizes **architecture and platform**; it does not list every **domain** feature (e.g. marketplace-specific flows in the repo). That’s a **depth/surface** choice, not a contradiction.
- **`forge-kit`** is **extracted cross-cutting** Quarkus components (throttle, metrics, health, common) — consistent with “kit vs full platform” positioning if you add a short FAQ line later.

**Content gap (refined)**

- If you want **early** visibility for **specific** capabilities (auth scaffolding, service templates, observability defaults), pulling **named** items from READMEs into Features/Architecture pages is still worthwhile. The gap is **detail pages and examples**, not “repos are only APIs.”

---

### 3) Tone and positioning: enterprise vs startup

**Strengths**

- Enterprise architectural credibility; disciplined, security-forward; observability/CI/CD baked in — matches how many enterprise buyers evaluate platforms.

**Startup / mid-market angle**

- ChatGPT said startup pricing expectations were **unclear** because it **did not register** the existing **#pricing** tiers. With tiers visible: the remaining issue is **value-for-money narrative** (why $399/$1199 vs alternatives), not absence of numbers.

---

### 4) Pricing and value proposition

**ChatGPT (original concern):** Pending pricing; need tiers and segments for serious buyers.

**Adjusted:** The site **already has** tier names, prices, annual option, org-size bands, support differentiation, and Stripe CTAs. What can still strengthen **conversion**:

- **Value metrics** — e.g. engineering hours saved, time-to-first-production deploy, observability “out of the box” vs DIY (even directional ranges or case-study numbers later).
- **What’s in the licence vs AWS** — you already hint at AWS cost; a FAQ bullet helps procurement.

---

### 5) Structure and navigation

**ChatGPT:** Only Features, Pricing, Contact; no About, Docs, Use cases, Blog.

**Adjusted:** Nav includes **Architecture**, **How it works**, **FAQ**, **Pricing**, **Contact**. Gaps ChatGPT named are still **reasonable roadmap** items: **About**, **Docs / developer resources** (linking Kit + core), **Use cases**, **Customers / stories**, **Blog** — if you want parity with typical SaaS marketing sites.

---

### 6) Recommendations (ChatGPT), merged with current reality

**Tighten the value narrative**

- Why Forge vs **build your own** vs **generic boilerplate** — still a good editorial task; pricing alone doesn’t answer it.

**Feature highlights**

- API/service scaffolding, auth patterns, observability defaults, example service layout — **can be pulled from repo docs** into Architecture / dev docs; homepage doesn’t need to mirror every module.

**Audience segmentation**

- Different pages or sections for **CTOs/architects**, **startup teams**, **platform engineering** — still valid; tiers already do **organizational** segmentation.

**Pricing section**

- ChatGPT suggested Starter/Team/Enterprise — **you already use** Builder / Scale / Enterprise with clear roles. Optional rename is branding, not a missing section.

---

### ChatGPT’s final assessment (preserved, with one footnote)

**Does the content line up with a serious platform offering?**

- Yes — architectural discipline, zero-trust security, cloud scale.
- Yes — enterprise foundations + startup speed.

**Is the pricing and pitch positioned well for conversion?**

- Partially — **pricing and segmentation exist**; **stronger ROI articulation** and proof would help conversion (ChatGPT’s “no pricing” conclusion was **wrong**).

**Does it reflect what’s in forge-kit / forge-core?**

- **Thematically yes** (architecture, security, ops). **Functionally partial** until deeper pages and examples surface repo-backed specifics — aligned with our earlier note, not with ChatGPT’s “API-only” repo description.

**Summary (ChatGPT)**

| Strengths | Gaps |
|-----------|------|
| Serious architectural tone; focused on engineering; security + operational posture | **Quantified** value / ROI; deeper **capabilities** tied to repos; **persona**-specific paths; **social proof** |
| *(pricing transparency was listed as a gap — **superseded** by correction above)* | Docs/use cases/customers/blog if you want full SaaS-style funnel |

---

*End of appendix.*
