# Journey Watchdog

A product prototype built as a representative ButtarDev client-workflow exercise.

Journey Watchdog tests whether a customer journey still produces the business outcome it was designed for after the automation goes live.

The core idea is deliberately different from uptime monitoring:

- A website can return 200 and still lose the lead.
- A CRM can be online and still create an unowned record.
- A Slack webhook can work and still send the wrong context.
- A chatbot can reply instantly and still make a promise the business cannot keep.

Watchdog sends a safe synthetic enquiry through the same journey and checks the business assertions at every handoff.

## Demo scenario

The fictional client is **BrightHome Cleaning**.

The main journey is:

```text
Website enquiry
  -> AI qualification
  -> CRM lead
  -> Owner assignment
  -> Team alert
  -> Follow-up task
```

The demo includes a deliberate routing regression. The CRM record is created successfully, but the owner mapping returns `null`.

That creates the important distinction this prototype is trying to demonstrate:

> the tools are healthy, but the customer journey is not.

The incident view explains:

- what the customer would feel
- the expected and actual values
- the most likely source of the regression
- which downstream actions were protected
- how the workflow could be safely replayed without duplicating the lead

## Product principles

### Business assertions before technical status

The monitoring model is based on promises a service business can understand:

- acknowledge an enquiry quickly
- never promise unconfirmed availability
- capture the details the team needs
- assign a qualified lead to exactly one owner
- create the next follow-up action
- escalate low-confidence conversations to a human

### Safe synthetic data

The demo uses isolated test identities. The product concept assumes stable idempotency keys so failed runs can be replayed safely.

### Human-readable incidents

An operator should not need to decode raw execution logs to understand why the incident matters.

### Proactive support

The weekly report is intentionally client-readable. The larger opportunity is turning post-launch support from “tell us when it breaks” into evidence that the journey is still working.

## Interaction

The rebuilt experience is intentionally self-explanatory for a first-time viewer:

1. **Overview** explains the product in business language: Watchdog proves that the customer outcome still completes after an automation ships.
2. **Run Watchdog** sends the synthetic BrightHome enquiry through the six-step journey and reveals the routing regression as it happens.
3. **Incident evidence** explains the customer impact, expected vs actual state, protected downstream actions, the synthetic data boundary and idempotent recovery.
4. **Under the hood** lets the viewer inspect the probe, journey contract, adapters, evaluator, guard rails and evidence/replay layers. Anime.js is used to trace the check through these layers and animate the explanatory tooltips.
5. **Trust & controls** separates protections that are actually implemented in the prototype from production security controls that would still be required.
6. **Client proof** shows how ongoing support can be translated into a client-readable assurance report instead of raw workflow logs.

## Automation architecture

The visible journey is backed by a server-side synthetic runner at:

```text
POST /api/watchdog/run
```

The runner models the same boundaries a real service-business automation would need:

```text
synthetic webhook
  -> qualification adapter
  -> idempotent CRM upsert
  -> routing rule
  -> guarded team notification
  -> guarded follow-up task
```

The degraded fixture intentionally returns no owner from routing. That failure prevents the alert and follow-up adapters from running. A healthy replay keeps the same idempotency key, which demonstrates the recovery principle without duplicating the CRM record.

This keeps the demo deterministic and safe while making the failure handling, guard conditions and replay semantics inspectable in code.

## Stack

- Next.js 16.3.8
- React 19.3
- TypeScript
- Tailwind CSS 4
- Motion
- Anime.js
- Lucide React

The incident drawer motion language is adapted from the open-source KokonutUI Smooth Drawer pattern (MIT), with the product UI and interaction model rebuilt for this prototype.

## Why these motion libraries

Motion handles stateful UI transitions, layout movement and the incident drawer.

Anime.js is used where motion explains system behaviour: the live verification sequence, execution-path tracing in the under-the-hood view, and concise architecture tooltips. It is deliberately not used as decorative motion.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scope

This is a front-end product prototype with deterministic demo data. It is designed to demonstrate product thinking, workflow architecture, failure handling and client-facing UX. It does not connect to real CRM, chatbot, email or automation accounts.
