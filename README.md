# Journey Watchdog

A product prototype built for a conversation with **Mushahid Buttar / ButtarDev**.

Journey Watchdog explores a post-launch QA layer for client automations. The core premise is simple:

> a workflow is only healthy if the business outcome still happens end to end.

A website can return 200, an AI assistant can answer, and a CRM can successfully create a record while the actual customer journey is still broken.

## The demo

The fictional client is **BrightHome Cleaning**.

The prototype now shows the actual applications being watched instead of describing the concept through dashboard cards:

```text
BrightHome customer form
  → AI qualification
  → FlowCRM lead
  → owner-routing rule
  → team chat
  → follow-up task
          ↑
     Journey Watchdog
```

The deliberate regression is inside the owner-routing handoff. The CRM lead is created, but the routing rule returns:

```text
expected: owner_id = saim.birmingham
actual:   owner_id = null
```

Watchdog observes the journey contract, isolates the failure, and prevents the team notification and follow-up task from running with invalid state.

The viewer then fixes the mapping and safely replays from the failed boundary. The existing synthetic CRM lead is reused through a stable idempotency key rather than duplicated.

## UX structure

There are only two primary surfaces.

### Live system

A controlled, step-by-step walkthrough of the full customer journey. The viewer controls the pace and can see:

- the synthetic customer submission,
- the AI's truthful acknowledgement,
- the CRM record being created,
- the hidden routing regression,
- Watchdog identifying the failed business assertion,
- guarded downstream actions,
- and a safe replay after the mapping fix.

### System model

A spatial, interactive model that pulls Watchdog apart into five responsibility layers:

1. Synthetic probe
2. Journey contract
3. Observer
4. Guard layer
5. Evidence + recovery

The model uses Anime.js for layer focus, signal tracing and spatial feedback. Pointer movement changes the model perspective and each layer can be brought forward for inspection.

## Data boundary

This prototype uses deterministic fixtures only.

- No real customer identities
- No live CRM
- No client Slack workspace
- No production credentials
- Stable synthetic idempotency key
- Guarded downstream side effects

The intent is to demonstrate how a production design could be reasoned about safely without pretending the prototype itself has production security controls.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Anime.js
- Motion
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

The visible walkthrough calls a deterministic server-side runner:

```text
POST /api/watchdog/run
```

The runner models:

```text
synthetic webhook
  → qualification adapter
  → idempotent CRM upsert
  → routing rule
  → guarded team notification
  → guarded follow-up task
```

This is a representative product prototype, not an existing ButtarDev service and not a reconstruction of any confidential client system.
