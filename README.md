# Journey Watchdog

A product concept built for **Mushahid Buttar / ButtarDev**.

Journey Watchdog explores a post-launch QA layer for client automations. It verifies that the **business outcome** still works end to end, not merely that each individual tool is online.

## Demo story

The fictional client is **BrightHome Cleaning**.

The experience is deliberately split into separate pages so every stage has one job:

```text
BrightHome customer site
        ↓
ButtarDev automation
        ↓
FlowCRM record
        ↓
owner routing regression
        ↓
Journey Watchdog
        ↓
safe fix + bounded replay
        ↓
interactive 3D architecture
```

### 1. Customer site

A synthetic customer submits a real-looking cleaning enquiry on the BrightHome website.

The customer receives a truthful acknowledgement. Their preferred date remains a request until a team member confirms it.

### 2. Automation

The enquiry moves through:

```text
Website form
  → AI qualification
  → CRM lead creation
  → Owner routing
  → Team notification
  → Follow-up task
```

The first three stages succeed. Owner routing silently fails.

### 3. CRM

FlowCRM remains technically healthy and the lead record exists.

The failure is business state:

```text
expected: owner_id = saim.birmingham
observed: owner_id = null
```

No infrastructure outage is required for the customer journey to be broken.

### 4. Watchdog

Watchdog checks the journey contract:

> Every qualified Birmingham lead must have exactly one owner before a team alert or follow-up task can run.

It isolates the failed handoff and prevents the two downstream actions from running with invalid state.

### 5. Recovery

The mapping is corrected and replay resumes from the failed routing boundary.

The existing synthetic CRM record is reused through the same idempotency key, so recovery does not create a duplicate lead.

### 6. 3D architecture

The architecture page uses a real Three.js WebGL scene, not a CSS perspective mock.

The model contains five selectable layers:

1. Synthetic probe
2. Journey contract
3. Handoff observer
4. Guard layer
5. Evidence + replay

The viewer can:

- drag to rotate the model,
- click individual layers,
- explode or compress the stack,
- and trace one event through the layers.

Anime.js uses its official Three.js adapter to animate the Three objects directly.

## Product principles

- **Business assertions over uptime:** a 200 response does not prove the customer journey worked.
- **Progressive disclosure:** each page answers one question instead of making one dashboard explain the entire system.
- **Synthetic data:** the demo never requires a real customer's identity.
- **Guarded side effects:** downstream actions wait until their prerequisites are valid.
- **Replay from the failure boundary:** recovery does not blindly rerun completed work.
- **Readable incidents:** operators see the customer impact and expected vs actual state, not raw execution logs.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Anime.js 4.5
- Three.js
- Motion
- Lucide React
- Playwright

## Verification

The repository CI runs:

```bash
npm install
npm run build
npx playwright install --with-deps chromium
npm run test:visual
```

The browser tests cover the complete multi-page product story and verify that the architecture page mounts a WebGL canvas.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scope

This is a representative product prototype. It does not connect to a live CRM, client Slack workspace, real customer records, or production credentials.
