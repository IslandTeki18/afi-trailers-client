# Self Service Online Booking Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking. Read `ubiquitous-language.md` first and use its terms (Renter, Owner, Booking, Rental Period, Service Type, Self Service, Full Service, Rental Fee, Security Deposit) in code identifiers and copy.

**Goal:** Ship an end-to-end Self Service booking flow: tow vehicle qualification, dates, identity, initialed rental agreement, Rental Fee payment with card vaulting, then an operator mobile handoff (deposit hold + photo condition report) and return (side-by-side photos, cancel or partial capture).

**Architecture:** The existing static Parcel + React site gains a Convex backend (database, file storage, actions, HTTP webhooks), Clerk auth (forced account for Self Service), and Stripe (Payment Element on the client, `stripe` SDK in Convex Node actions). Full Service keeps the existing email "Booking Request" path untouched. All money movement is server-side in Convex; the client never sees secret keys. Booking state is a single `bookings` document driven by an explicit status machine.

**Tech Stack:** React 18, TypeScript, Tailwind, react-router 6, Parcel 2, Convex, Clerk (`@clerk/clerk-react`), Stripe (`stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`), Resend (email), Twilio REST via `fetch` (SMS).

---

## 0. Assumptions, decisions, and risks

Read this section before starting. Every item here is a decision the plan makes so work is not blocked. Each is reversible.

| # | Decision | Rationale | Reversal cost |
|---|---|---|---|
| A1 | **Forced account** (Clerk) for Self Service. Full Service stays guest email request. | Spec leans forced; vehicle profile and saved card need a durable identity. | Low: gate is one `<SignedIn>` wrapper. |
| A2 | **Age gate collects DOB now, enforces only when `MIN_RENTER_AGE > 0`.** Ship with `MIN_RENTER_AGE = 0` until the insurance carrier confirms. | Spec says confirm before building. Collecting DOB is harmless; enforcing is a constant flip. | One constant. |
| A3 | **Signature = typed full legal name** + checkbox, stored with server timestamp, IP, agreement version. No canvas drawing. | UETA/ESIGN accept typed signatures; canvas adds a dependency and a data URL blob for no legal gain. | Medium: swap component, store a storageId. |
| A4 | **Charge + vault in one step via `PaymentIntent` with `setup_future_usage: "off_session"`** instead of a parallel SetupIntent. | One Payment Element, one confirm, one webhook. Stripe's documented way to charge now and save for later. Satisfies "rental fee charged and card vaulted in a single checkout step" exactly. | Low: a SetupIntent can be added later for card replacement without a charge. |
| A5 | **Operator identified by email allowlist** in Convex env var `OPERATOR_EMAILS` (comma-separated), checked against Clerk identity email. | Single operator today. Clerk roles/orgs are more setup for zero gain. | Low. |
| A6 | **Photo geotag from `navigator.geolocation`** captured alongside the file; timestamp is Convex server time at upload. No EXIF parsing. | EXIF is stripped by many mobile browsers; geolocation API is reliable and needs no dependency. | Low. |
| A7 | **All configurable numbers live in `convex/rentalTerms.ts`** with placeholder values and a `// TODO(owner)` per line. | Spec says numbers are not set. Client and backend both import one file. | Zero. |
| A8 | **Booking availability = bookings in `confirmed`, `checked_out`, `returned` with overlapping Rental Period.** The static `trailer.bookedDates` array is ignored (it is empty). | Backend is now the source of truth. | Zero. |
| A9 | **Hold expiry**: store `capture_before` from the PaymentIntent. If return happens after it, skip cancel/capture and use a fresh off-session PaymentIntent. No extended-auth request. | Spec: read `capture_before`, do not assume a window. Extended auth eligibility is an open question. | Low. |
| A10 | **SMS via Twilio REST `fetch`** with Basic auth; no `twilio` npm package. | One POST. | Zero. |
| A11 | **Overage fee**: operator enters overage lbs at return (optional). Charged as part of the damage capture amount. No scale integration. | Spec lists overage in agreement; there is no scale. | Low. |
| A12 | **Rental agreement body** reuses `contractSelfServiceSections` (Drive-Off Contract) plus the five initial items from the spec. `AGREEMENT_VERSION = "2026-08-29-draft"`. | Existing content; legal review is an open question and out of scope. | Zero. |

**Risks**

- **Existing copy contradictions** (`ubiquitous-language.md` Open Questions): prices, deposit, weight limit. The plan does not resolve them. Values in `convex/rentalTerms.ts` are placeholders; the Owner must set them before launch.
- **Parcel + Convex codegen**: `convex/_generated` is imported by the client via `~convex/...`. `tsconfig.json` `include` is `["src"]`; imported files are still type-checked. Convex ships its own `convex/tsconfig.json` on `npx convex dev`. Do not merge the two tsconfigs.
- **Parcel env vars**: Parcel inlines only literal `process.env.NAME` references. Never destructure `process.env`.
- **`useNavigate` inside forms**: the existing `TrailerBookingView` is a single `<form>`. The Self Service branch must navigate, not submit.
- **Webhook ordering**: `payment_intent.succeeded` may arrive before the client returns from `confirmPayment`. Client must read booking status from Convex (reactive query), never from the Stripe redirect result alone.
- **Off-session hold failure at handoff** (declined, `requires_action`): operator sees an inline error and a "send invoice link" button. Handoff cannot complete without a successful hold OR an explicit operator override flag (`depositOverride: true`, recorded).

---

## 1. Environment and accounts (human steps, do first)

The executing agent cannot create these. Stop and request them if missing.

- [ ] Convex project created; `CONVEX_DEPLOYMENT` and `CONVEX_URL` available.
- [ ] Clerk application created; publishable key, and a Convex JWT template named `convex` (Clerk dashboard → JWT Templates → Convex). Issuer domain needed for `convex/auth.config.ts`.
- [ ] Stripe account in test mode; publishable + secret keys; webhook signing secret (created in step 6.4).
- [ ] Resend account, verified sending domain or the sandbox address; API key.
- [ ] Twilio account; Account SID, Auth Token, a from-number.
- [ ] Owner's operator email(s) for `OPERATOR_EMAILS`.

Env var placement:

| Var | Where | Used by |
|---|---|---|
| `CONVEX_URL` | `.env` (Parcel) and Vercel | client |
| `CLERK_PUBLISHABLE_KEY` | `.env` and Vercel | client |
| `STRIPE_PUBLISHABLE_KEY` | `.env` and Vercel | client |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex env | `convex/auth.config.ts` |
| `STRIPE_SECRET_KEY` | Convex env | actions |
| `STRIPE_WEBHOOK_SECRET` | Convex env | `convex/http.ts` |
| `RESEND_API_KEY`, `RESEND_FROM` | Convex env | notifications |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | Convex env | notifications |
| `OPERATOR_EMAILS` | Convex env | operator guard |
| `SITE_URL` | Convex env | links in email/SMS |

---

## 2. File map

### Create

| Path | Responsibility |
|---|---|
| `convex/schema.ts` | Tables: `renters`, `vehicles`, `bookings`, `photos`, `stripeEvents`. |
| `convex/auth.config.ts` | Clerk provider config. |
| `convex/rentalTerms.ts` | All configurable numbers, agreement version, initial items, qualification rules. Pure TS, no Convex imports. Imported by client too. |
| `convex/lib/auth.ts` | `requireUser(ctx)`, `requireOperator(ctx)`. |
| `convex/lib/status.ts` | Booking status union + allowed transitions + `assertTransition`. |
| `convex/qualification.ts` | Pure function `qualifyVehicle(input) → { outcome, fixes, verifyAtHandoff }`. Shared with client. |
| `convex/renters.ts` | Queries/mutations: `me`, `upsertProfile`, `generateLicenseUploadUrl`. |
| `convex/vehicles.ts` | `listMine`, `save`, `remove`. |
| `convex/bookings.ts` | `availability`, `createDraft`, `setLoad`, `attachVehicle`, `getMine`, `get`, `listForOperator`, internal status mutations. |
| `convex/agreement.ts` | `sign` internal mutation (called from HTTP action so IP is available). |
| `convex/stripe.ts` | `"use node"` actions: `createCheckout`, `placeDepositHold`, `settleReturn`, `sendInvoiceFallback`. Idempotency keys on every create. |
| `convex/stripeWebhooks.ts` | Internal mutations per event type; idempotent via `stripeEvents`. |
| `convex/http.ts` | `POST /stripe/webhook` (signature verify), `POST /agreement/sign` (reads IP, requires Clerk token). |
| `convex/notifications.ts` | `"use node"` action `sendBookingConfirmation`, `sendInvoiceLink`. Resend + Twilio fetch. |
| `convex/photos.ts` | `generateUploadUrl`, `attach`, `listForBooking` (returns signed URLs). |
| `convex/handoff.ts` | `completeHandoff` (validates checklist, photos ≥ 8, renter signature), `completeReturn`. |
| `src/providers/AppProviders.tsx` | `ClerkProvider` + `ConvexProviderWithClerk` + existing `ToastProvider`. |
| `src/features/bookings/views/SelfServiceBookingView.tsx` | Wizard shell: step state, progress, routes steps. |
| `src/features/bookings/views/BookingConfirmationView.tsx` | Post-payment page (reactive on booking status). |
| `src/features/bookings/views/MyBookingsView.tsx` | Renter's bookings (minimal list; needed to reach confirmation later). |
| `src/features/bookings/components/steps/VehicleStep.tsx` | Qualification form + returning-vehicle chip. |
| `src/features/bookings/components/steps/QualificationResult.tsx` | Three outcomes UI; adjustable hitch add-on; full-service redirect. |
| `src/features/bookings/components/steps/DatesStep.tsx` | Rental Type + dates + availability + weight capacity callout. |
| `src/features/bookings/components/steps/LoadStep.tsx` | Hauling, distance, dump site. |
| `src/features/bookings/components/steps/IdentityStep.tsx` | Name, phone, DOB, license photo upload. |
| `src/features/bookings/components/steps/AgreementStep.tsx` | Contract sections + five initial fields + typed signature. |
| `src/features/bookings/components/steps/PaymentStep.tsx` | Stripe Payment Element; deposit "hold, not a charge" note. |
| `src/features/bookings/components/HitchReferencePhotos.tsx` | Ball size + connector reference images. |
| `src/features/bookings/assets/ball-2in.jpg`, `ball-2-5-16in.jpg`, `connector-4pin.jpg`, `connector-7blade.jpg` | Reference photos (placeholder images acceptable; note for Owner to replace). |
| `src/features/bookings/utils/bookingDraft.ts` | Client-side wizard state type + `sessionStorage` persistence (survive Stripe redirect / refresh). |
| `src/features/operator/index.ts`, `views/index.ts` | Feature barrel, following `features/*` pattern. |
| `src/features/operator/views/OperatorRentalsView.tsx` | Today's/upcoming bookings list. |
| `src/features/operator/views/HandoffView.tsx` | Verify checklist, photo capture, renter signature, deposit hold. |
| `src/features/operator/views/ReturnView.tsx` | Photo capture, side-by-side compare, clean/damage decision. |
| `src/features/operator/components/PhotoCapture.tsx` | `<input type="file" accept="image/*" capture="environment">` + geolocation + upload. |
| `src/features/operator/components/PhotoCompare.tsx` | Pickup vs return grid. |
| `src/features/operator/components/OperatorGuard.tsx` | Renders children only for allowlisted operator (server-checked via `renters.me`). |
| `src/hooks/useBooking.ts` | Thin wrappers over Convex queries for the current draft. |
| `.env.example` | Client env var names. |

### Modify

| Path | Change |
|---|---|
| `package.json` | Add deps: `convex`, `@clerk/clerk-react`, `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `resend`. Add scripts `convex:dev`, `convex:deploy`. |
| `index.tsx` | Wrap `<App />` in `AppProviders`. |
| `src/routes/main.tsx` | Add routes: `trailers/:trailerId/book/self`, `bookings/:bookingId/confirmation`, `account/bookings`, `operator`, `operator/rentals/:bookingId/handoff`, `operator/rentals/:bookingId/return`. Add "Sign in" / user button to nav. |
| `src/features/bookings/views/TrailerBookingView.tsx` | Service step: selecting Self Service navigates to `/book/self`. Full Service path unchanged. Headline copy branches. |
| `src/features/bookings/views/index.ts`, `src/features/bookings/index.ts` | Export new views. |
| `src/features/index.ts` | Export `operator`. |
| `src/components/Navbar.tsx` | Add Clerk `SignInButton` / `UserButton` slot. Minimal. |
| `src/types/Trailer.ts` | No change. (`bookedDates` left as is; see A8.) |
| `.gitignore` | Add `convex/_generated/` is NOT ignored (Convex recommends committing); add `.env.local` already present. No change needed unless codegen adds files. |
| `vercel.json` | No change (SPA rewrite already present). |
| `ubiquitous-language.md` | Add terms: Tow Vehicle, Qualification, Condition Report, Deposit Hold, Handoff, Return, Operator. Append in section 7 below. |

---

## 3. Data model (`convex/schema.ts`)

Use `v` validators. Index every lookup path used below.

```
renters
  clerkUserId: string (index by_clerk)
  email, name, phone: string
  dob?: string (ISO date)
  licenseStorageId?: Id<"_storage">
  licenseNumber?: string
  stripeCustomerId?: string (index by_stripe_customer)
  defaultPaymentMethodId?: string

vehicles
  renterId: Id<"renters"> (index by_renter)
  year: number, make, model: string
  ballSize: "2" | "2-5/16"
  connector: "4-pin" | "7-blade"
  brakeController: "yes" | "no" | "unsure"
  receiver: "frame" | "bumper" | "unsure"
  outcome: "qualified" | "qualified_with_fix" | "not_qualified"
  fixes: string[]            // e.g. "adjustable_hitch", "adapter_4_to_7"
  verifyAtHandoff: string[]  // fields answered "unsure"
  lastUsedAt: number

bookings
  renterId (index by_renter), trailerId: string
  vehicleId?: Id<"vehicles">
  serviceType: "self"        // full service never reaches this table
  rentalType: "half" | "full"
  start, end: number (ms epoch)   (index by_trailer_start ["trailerId","start"])
  quote: { days, dayRate, base, weekendSurcharge, addOns, total }   // cents
  addOns: { adjustableHitch: boolean }
  load: { hauling: string, towDistanceMiles: number, dumpSite: string }
  status: BookingStatus (index by_status)
  agreement?: { version, signedAt: number, ip: string, signatureName: string, initials: Record<string, number> }
  stripe?: { customerId, paymentIntentId, paymentMethodId?, depositIntentId?, depositCaptureBefore?: number, depositStatus?: "held"|"released"|"captured"|"failed"|"expired", capturedAmount?: number }
  handoff?: { completedAt, operatorEmail, checklist: Record<string, boolean>, renterSignatureName, renterSignedAt, verified: Record<string, string>, depositOverride?: boolean }
  return?: { completedAt, operatorEmail, clean: boolean, damageAmount?: number, overageLbs?: number, notes?: string }
  createdAt, updatedAt: number

photos
  bookingId (index by_booking_phase ["bookingId","phase"])
  phase: "pickup" | "return"
  storageId: Id<"_storage">
  label: string             // "front-left", "tarp", ...
  takenAt: number           // server time
  lat?, lng?: number, accuracy?: number

stripeEvents
  eventId: string (index by_event_id)
  type: string, processedAt: number
```

**Booking status machine** (`convex/lib/status.ts`):

```
draft → qualified → signed → pending_payment → confirmed → checked_out → returned → closed
any (before checked_out) → cancelled
confirmed → payment_failed → pending_payment
```

Invariants (enforce in mutations, not UI):
- `signed` requires `vehicleId` with outcome ≠ `not_qualified`, non-empty `load`, renter profile with name + phone + license.
- `pending_payment` requires `agreement`.
- `checked_out` requires `stripe.depositStatus === "held"` OR `handoff.depositOverride === true`, and ≥ 8 pickup photos, and `handoff.renterSignedAt`.
- `returned` requires ≥ 8 return photos.
- No Stripe call may be issued for a booking in `draft` or `qualified`. Assert in `createCheckout`.

---

## 4. Tasks

Commit after every task. Commit message format: `feat(booking): <task title>`. Run `npm run typecheck` before each commit.

## Chunk 1: Foundation

### Task 1: Install dependencies and providers

**Files:** `package.json`, `index.tsx`, `src/providers/AppProviders.tsx`, `src/providers/index.ts`, `.env.example`, `convex/auth.config.ts`

- [ ] `npm i convex @clerk/clerk-react @stripe/stripe-js @stripe/react-stripe-js` and `npm i stripe resend` (server-side packages are still bundled by Convex from root `node_modules`).
- [ ] `npx convex dev --once` to scaffold `convex/` and `convex/_generated`. Commit `_generated`.
- [ ] Add scripts: `"convex:dev": "convex dev"`, `"convex:deploy": "convex deploy"`.
- [ ] `convex/auth.config.ts`: providers `[{ domain: process.env.CLERK_JWT_ISSUER_DOMAIN, applicationID: "convex" }]`.
- [ ] `src/providers/AppProviders.tsx`: `ClerkProvider publishableKey={process.env.CLERK_PUBLISHABLE_KEY}` → `ConvexProviderWithClerk client={convex} useAuth={useAuth}` → `ToastProvider` → children. Create `ConvexReactClient(process.env.CONVEX_URL)` at module scope.
- [ ] `index.tsx`: wrap `<App />` in `<AppProviders>`.
- [ ] `.env.example` with the three client vars. Confirm `.env` is gitignored (it is).
- [ ] Verify: `npm start` renders the home page unchanged with a signed-out Clerk context. `npm run typecheck` passes.

### Task 2: Schema, terms, status machine, auth helpers

**Files:** `convex/schema.ts`, `convex/rentalTerms.ts`, `convex/lib/status.ts`, `convex/lib/auth.ts`

- [ ] Write `convex/schema.ts` per section 3.
- [ ] Write `convex/rentalTerms.ts`:
  - `AGREEMENT_VERSION = "2026-08-29-draft"`
  - `MIN_RENTER_AGE = 0` `// TODO(owner): set to 25 once carrier confirms`
  - `DEPOSIT_AMOUNT_CENTS = 50_000` `// TODO(owner): matches $500 in Additional Fees; confirm`
  - `OVERAGE_PER_LB_CENTS = 10` `// TODO(owner): placeholder`
  - `ADJUSTABLE_HITCH_DAY_RATE_CENTS = 1_500` `// TODO(owner): placeholder`
  - `MAX_LOAD_LBS_BY_TRAILER: Record<string, number> = { st7x14x4dump001: 10_000 }` `// TODO(owner): contracts say 6,000`
  - `LATE_FEE_CENTS` placeholder
  - `AGREEMENT_INITIALS: { key, text(terms) }[]` for the five spec items, text templated with the numbers above.
  - `LOAD_SPECIFIC_INITIAL_KEYS = ["max_weight"]` (the items a returning Renter must re-initial).
  - `REQUIRED_PICKUP_PHOTOS = 8`, `PHOTO_LABELS = [...]` (10 labels: front, rear, left, right, tarp, bed-floor, gate, tongue-coupler, tires-left, tires-right).
  - `HANDOFF_CHECKLIST = ["license_matches", "hitch_ok", "ball_ok", "connector_ok", "chains_crossed", "lights_cycle"]`.
  - No Convex imports in this file. It is imported by the client.
- [ ] `convex/lib/status.ts`: `BookingStatus` union, `TRANSITIONS` map, `assertTransition(from, to)` throws `ConvexError`.
- [ ] `convex/lib/auth.ts`: `requireIdentity(ctx)`; `requireRenter(ctx)` (loads or creates `renters` row from identity: clerkUserId, email, name); `requireOperator(ctx)` (identity email in `OPERATOR_EMAILS.split(",")`, trimmed, lowercased).
- [ ] Verify: `npx convex dev --once` deploys schema with no errors.

### Task 3: Qualification rules (pure)

**Files:** `convex/qualification.ts`

- [ ] Input type = vehicle fields from schema minus outcome fields. Output `{ outcome, fixes, verifyAtHandoff }`.
- [ ] Rules (per trailer requirements: 2-5/16" ball, 7-blade, brakes recommended):
  - `ballSize === "2"` → fix `adjustable_hitch` (rentable add-on) with alt "buy 2-5/16 ball".
  - `connector === "4-pin"` → fix `adapter_4_to_7` (buy). Note: a 4-to-7 adapter cannot power electric brakes; if `brakeController === "no"` and `connector === "4-pin"` → `not_qualified`.
  - `receiver === "bumper"` → `not_qualified` (bumper hitches cannot carry the 10,000 lb tongue load).
  - `brakeController === "no"` → `not_qualified` (trailer has electric brakes; Utah requires brakes on trailers over 3,000 lb GVWR). **Flag for Owner**: confirm this rule; it is the strictest.
  - Any `"unsure"` → push field name to `verifyAtHandoff`; does not block.
  - Otherwise `qualified`; any fixes present → `qualified_with_fix`.
- [ ] Export `describeFix(fix): { title, body, addOn?: boolean }` copy strings used by the UI.
- [ ] Add a `qualification.check.ts` next to `src/features/bookings/utils/pricing.check.ts` style is NOT required (user excluded tests). Skip.

### Task 4: Renter profile and vehicles

**Files:** `convex/renters.ts`, `convex/vehicles.ts`

- [ ] `renters.me` query: returns renter row + `isOperator: boolean` (computed with the allowlist) + `hasSavedCard`.
- [ ] `renters.upsertProfile` mutation: name, phone, dob, licenseNumber, licenseStorageId. If `MIN_RENTER_AGE > 0`, compute age from dob and throw `ConvexError("UNDERAGE")`.
- [ ] `renters.generateLicenseUploadUrl` mutation → `ctx.storage.generateUploadUrl()`.
- [ ] `vehicles.listMine` query, `vehicles.save` mutation (runs `qualifyVehicle`, stores outcome, `lastUsedAt`), `vehicles.remove`.
- [ ] All mutations call `requireRenter`.

### Task 5: Bookings core

**Files:** `convex/bookings.ts`

- [ ] `availability({ trailerId, from, to })` query: returns `[start,end][]` for bookings with status in `confirmed | checked_out | returned` overlapping `[from,to]`. Public (no auth) so the date step can grey out days.
- [ ] `createDraft({ trailerId, rentalType, start, end, vehicleId })` mutation: recomputes quote server-side (port `quoteRental` logic; output in cents; add `adjustableHitch` add-on × days if vehicle fix includes it and renter opted in), rejects overlap, rejects vehicle `not_qualified`, status `qualified`. Returns `bookingId`.
- [ ] `setLoad({ bookingId, hauling, towDistanceMiles, dumpSite, adjustableHitch })` mutation: requotes.
- [ ] `getMine({ bookingId })` query (owner check), `listMine`.
- [ ] `listForOperator({ from, to })` query (`requireOperator`), joined with renter + vehicle.
- [ ] `internal.bookings.setStatus` internal mutation using `assertTransition`.
- [ ] `cancel({ bookingId })` mutation: allowed before `checked_out`; if `confirmed`, schedules a refund action per Cancellation Policy (full refund ≥24h single-day / ≥48h multi-day, else 50% / first day). Keep the policy math in `rentalTerms.ts`.

## Chunk 2: Agreement, Stripe, notifications

### Task 6: Agreement signing over HTTP (for IP)

**Files:** `convex/agreement.ts`, `convex/http.ts`

- [ ] `internal.agreement.sign({ bookingId, renterId, signatureName, initials, ip })` mutation: validates every key in `AGREEMENT_INITIALS` is present (or, for a returning Renter with a prior signed booking on the same vehicle within the same `AGREEMENT_VERSION`, only `LOAD_SPECIFIC_INITIAL_KEYS`), writes `agreement` with `signedAt: Date.now()`, `version`, transitions `signed`.
- [ ] `http.ts` route `POST /agreement/sign`: `ctx.auth.getUserIdentity()` (client sends Clerk token as `Authorization: Bearer`), IP from `x-forwarded-for` first value, else `cf-connecting-ip`, else `"unknown"`. Calls the internal mutation. Returns 200 JSON.
- [ ] CORS: allow `SITE_URL` origin and `OPTIONS` preflight.

### Task 7: Stripe checkout (charge + vault)

**Files:** `convex/stripe.ts` (`"use node"`)

- [ ] `createCheckout({ bookingId })` action:
  1. Load booking; assert status `signed` or `pending_payment` (this is the "no charge before qualified" gate; qualification is upstream of `signed`).
  2. Ensure Stripe Customer: if renter lacks `stripeCustomerId`, `customers.create({ email, name, phone, metadata: { clerkUserId } }, { idempotencyKey: "cust_" + clerkUserId })`, persist.
  3. If `booking.stripe.paymentIntentId` exists and PI is not succeeded, retrieve and return its `client_secret`.
  4. Else `paymentIntents.create({ amount: quote.total, currency: "usd", customer, setup_future_usage: "off_session", automatic_payment_methods: { enabled: true }, metadata: { bookingId, kind: "rental_fee" }, description: "Rental Fee " + shortName + " " + dates }, { idempotencyKey: "rent_" + bookingId })`.
  5. Persist `stripe.customerId`, `stripe.paymentIntentId`; transition `pending_payment`.
  6. Return `{ clientSecret, depositAmount: DEPOSIT_AMOUNT_CENTS }`.
- [ ] `placeDepositHold({ bookingId })` action (`requireOperator`):
  - Assert status `confirmed`, `defaultPaymentMethodId` present.
  - `paymentIntents.create({ amount: DEPOSIT_AMOUNT_CENTS, currency, customer, payment_method: defaultPaymentMethodId, capture_method: "manual", off_session: true, confirm: true, metadata: { bookingId, kind: "deposit_hold" } }, { idempotencyKey: "hold_" + bookingId })`.
  - On success: persist `depositIntentId`, `depositCaptureBefore: pi.capture_before ?? null` (unix seconds → ms), `depositStatus: "held"`. Do not rely on the webhook for the operator's immediate feedback; the webhook is the reconciliation path.
  - On `StripeCardError` / `requires_action`: persist `depositStatus: "failed"`, return `{ ok: false, reason }`.
- [ ] `settleReturn({ bookingId, clean, damageAmount, overageLbs, notes, photoIds })` action (`requireOperator`):
  - `total = damageAmount + overageLbs * OVERAGE_PER_LB_CENTS`.
  - If `depositStatus === "held"` and `now < depositCaptureBefore`:
    - `clean || total === 0` → `paymentIntents.cancel(depositIntentId)`; `depositStatus: "released"`.
    - `total <= DEPOSIT_AMOUNT_CENTS` → `paymentIntents.capture(depositIntentId, { amount_to_capture: total, description: "Damage/overage; photos: " + photoIds.join(",") })`; `depositStatus: "captured"`, `capturedAmount`.
    - `total > DEPOSIT_AMOUNT_CENTS` → capture full hold, then `chargeOffSession(remainder)`.
  - Else (expired or never held): `total > 0` → `chargeOffSession(total)`.
  - `chargeOffSession(amount)`: `paymentIntents.create({ amount, customer, payment_method, off_session: true, confirm: true, metadata: { bookingId, kind: "damage" }, description with photo ids }, { idempotencyKey: "dmg_" + bookingId + "_" + amount })`. On failure → call `sendInvoiceFallback`.
  - Persist `return` block, transition `returned` then `closed`.
- [ ] `sendInvoiceFallback({ bookingId, amount, reason })` action: `invoices.create` + `invoiceItems.create` + `invoices.finalizeInvoice` → `hosted_invoice_url`; `notifications.sendInvoiceLink`.
- [ ] `chargeAdditional({ bookingId, amount, reason })` action (`requireOperator`): late-discovered damage; wraps `chargeOffSession`.
- [ ] Every Stripe call uses `apiVersion` pinned in one constant; `new Stripe(process.env.STRIPE_SECRET_KEY)` at module scope.

### Task 8: Webhooks

**Files:** `convex/http.ts`, `convex/stripeWebhooks.ts`

- [ ] `POST /stripe/webhook`: raw body + `stripe-signature` → `stripe.webhooks.constructEvent` (inside a Node action `internal.stripe.verifyWebhook`, since `http.ts` runs in the default runtime; alternatively use `constructEventAsync` with the Web Crypto provider directly in the httpAction: prefer the latter, one fewer hop). Return 400 on bad signature.
- [ ] `internal.stripeWebhooks.handle({ eventId, type, object })` mutation:
  - If `stripeEvents` has `eventId` → return (idempotent). Insert first, then process.
  - `payment_intent.succeeded` with `metadata.kind === "rental_fee"`: set `renter.defaultPaymentMethodId = pi.payment_method` (also schedule `internal.stripe.setCustomerDefault` action to update `invoice_settings.default_payment_method`), transition `confirmed`, schedule `notifications.sendBookingConfirmation`.
  - `payment_intent.payment_failed` kind `rental_fee`: transition `payment_failed` → client shows retry.
  - `payment_intent.amount_capturable_updated` kind `deposit_hold`: set `depositStatus: "held"`, `depositCaptureBefore` (reconciliation only).
  - `payment_intent.canceled` kind `deposit_hold`: `depositStatus: "released"`.
  - Unknown types: record and ignore.
- [ ] Keep the spec's `setup_intent.succeeded` handler as a no-op branch so adding a SetupIntent later needs no webhook change.

### Task 9: Notifications

**Files:** `convex/notifications.ts` (`"use node"`)

- [ ] `sendBookingConfirmation({ bookingId })` internal action: loads booking + renter + trailer static data (`trailer.location.address`; import from `src/data` is not possible in Convex, so hardcode pickup address in `rentalTerms.ts` as `PICKUP_ADDRESS` `// TODO(owner)`).
  - Email via Resend: subject "Your AFI trailer pickup: {date} {time}"; body: pickup time, address, "Before you come" checklist (driver's license, check tire condition on your truck, expected hookup: 2-5/16 ball + 7-blade, adjustable hitch if added), cancellation policy, link to `SITE_URL/bookings/{id}/confirmation`.
  - SMS via `fetch("https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json", { method: "POST", headers: { Authorization: "Basic " + btoa(sid+":"+token), "Content-Type": "application/x-www-form-urlencoded" }, body: URLSearchParams({ To, From, Body }) })`. Body ≤ 320 chars.
  - Failures are logged, never thrown (booking is already confirmed).
- [ ] `sendInvoiceLink({ bookingId, url, amount, reason })` internal action: email + SMS.

## Chunk 3: Renter-facing wizard

### Task 10: Route and service selection split

**Files:** `src/routes/main.tsx`, `src/features/bookings/views/TrailerBookingView.tsx`, `src/components/Navbar.tsx`

- [ ] `TrailerBookingView`: the Self Service card's `onClick` navigates to `bookingPath(trailer._id) + "/self"`. Default `service` state becomes `"full"` if `?service=full`, else render the selector but do not preselect; the rest of the form only renders once `service === "full"`. Update headline: "Request your dates" (full) stays; service cards show price difference and includes list (`serviceOptions` already has blurb + note; add `includes: string[]`).
- [ ] Add routes listed in section 2. Wrap `book/self`, `bookings/*`, `account/*` in Clerk `<SignedIn>` with `<RedirectToSignIn>` fallback. Wrap `operator/*` in `OperatorGuard`.
- [ ] Navbar: add `<SignedOut><SignInButton/></SignedOut><SignedIn><UserButton/></SignedIn>` at the right end. Style with `buttonClasses("outline","small")`.

### Task 11: Wizard shell and draft persistence

**Files:** `src/features/bookings/views/SelfServiceBookingView.tsx`, `src/features/bookings/utils/bookingDraft.ts`, `src/hooks/useBooking.ts`

- [ ] Steps: `vehicle → dates → load → identity → agreement → payment`. Step index in URL query `?step=` so refresh/back work. Progress bar reuses `StepCard` numbering (extract `StepCard` from `TrailerBookingView` to `src/features/bookings/components/StepCard.tsx` and import in both).
- [ ] `bookingDraft.ts`: `{ vehicleId?, bookingId?, rentalType, start, end, adjustableHitch }` in `sessionStorage` key `afi.booking.draft`.
- [ ] Returning-customer branch on mount: `vehicles.listMine` non-empty and `renters.me` profile complete → show confirmation chip "Towing with your 2019 F-250 again?" [Yes, skip] [Different vehicle]. Yes → jump to `dates` with `vehicleId` set, and mark `returning = true` so `identity` is skipped and `agreement` shows only `LOAD_SPECIFIC_INITIAL_KEYS`.
- [ ] Gate: a step is reachable only if prior steps' server state exists (e.g. `payment` requires booking status `signed`). Guard in the shell, not the step components.

### Task 12: Vehicle qualification step

**Files:** `VehicleStep.tsx`, `QualificationResult.tsx`, `HitchReferencePhotos.tsx`, assets

- [ ] Form: year (`<input type="number">`), make, model, ball size (two radio cards with reference photo), connector (two radio cards with reference photo), brake controller (yes/no/not sure), receiver (frame/bumper/not sure with one-line description each). Reuse `Input`; radio cards mirror the service-card styling in `TrailerBookingView`.
- [ ] On submit → `vehicles.save` → render `QualificationResult` with the returned outcome:
  - `qualified`: green summary, Continue.
  - `qualified_with_fix`: per fix, `describeFix` copy; `adjustable_hitch` shows toggle "Add adjustable hitch, {rate}/day" which sets `draft.adjustableHitch`; `adapter_4_to_7` shows "Buy a 4-to-7 adapter before pickup" note. Continue enabled.
  - `not_qualified`: no Continue. Copy: "Your {make} {model} can't safely tow this trailer. Full Service brings it to you, no truck needed." + `ButtonLink` to `bookingPath(id) + "?service=full"`. Second link "Use a different vehicle".
  - "Not sure" answers render a muted note "We'll check this at pickup." and never block.

### Task 13: Dates step

**Files:** `DatesStep.tsx`

- [ ] Port the date/rental-type UI from `TrailerBookingView` (same `Input type="date"` pattern; do not add a calendar library). Query `bookings.availability` for the next 90 days; on change, if the selected range overlaps a booked range show inline error and disable Continue.
- [ ] Weight capacity callout (always visible, above dates): "{maxLoad} lb max load. Concrete, dirt, or gravel hits that at about one-third full. Overage is {OVERAGE}/lb." Values from `rentalTerms.ts`.
- [ ] Quote card in the sidebar (reuse `summaryRows` layout; add "Adjustable hitch" row when added). Continue → `bookings.createDraft` (or update if `draft.bookingId` exists: implement as `createDraft` accepting optional `bookingId` and patching).

### Task 14: Load step

**Files:** `LoadStep.tsx`

- [ ] `Textarea` hauling (required), `Input type="number"` tow distance miles (required), `Input` dump site (required, placeholder "e.g. Trans-Jordan Landfill, Bayview"). Continue → `bookings.setLoad`.

### Task 15: Identity step

**Files:** `IdentityStep.tsx`

- [ ] Prefill name/phone from `renters.me`. Fields: full legal name, mobile, DOB (`type="date"`), license number, license photo (`<input type="file" accept="image/*" capture="environment">` → `generateLicenseUploadUrl` → `POST` file → storageId). Continue → `upsertProfile`. Handle `ConvexError("UNDERAGE")` with copy "Renters must be {MIN_RENTER_AGE}+ under our insurance program."
- [ ] Skipped entirely when `returning` and profile has license.

### Task 16: Agreement step

**Files:** `AgreementStep.tsx`

- [ ] Render `contractSelfServiceSections` via existing `ContractView` component (check its props in `src/features/Trailers/components/ContractView.tsx`; reuse as is).
- [ ] Below: five initial fields from `AGREEMENT_INITIALS` (or only load-specific when `returning`). Each is a row: text + `Input maxLength={3} placeholder="LM"` uppercase; Continue disabled until every required row has 2–3 letters.
- [ ] Signature: `Input` "Type your full legal name" must equal profile name (case-insensitive, trimmed); checkbox "I agree this typed name is my electronic signature."
- [ ] Submit: `fetch(CONVEX_SITE_URL + "/agreement/sign", { headers: { Authorization: "Bearer " + await getToken({ template: "convex" }) }, body })`. `CONVEX_SITE_URL` = `CONVEX_URL` with `.cloud` → `.site`; add `CONVEX_SITE_URL` env var instead of string surgery.

### Task 17: Payment step

**Files:** `PaymentStep.tsx`, `BookingConfirmationView.tsx`

- [ ] On mount call `stripe.createCheckout` action → `clientSecret`. `loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)` at module scope. `<Elements options={{ clientSecret }}>` → `<PaymentElement/>`.
- [ ] Above the button: line items (Rental Fee, weekend surcharge, adjustable hitch, total charged today) and a bordered note: "Security Deposit: {deposit} hold placed at pickup, not today. It is a hold, not a charge. On a debit card the bank removes the amount from your available balance until we release it, usually within a few days of return."
- [ ] `stripe.confirmPayment({ elements, confirmParams: { return_url: SITE_URL + "/bookings/" + id + "/confirmation" }, redirect: "if_required" })`. On success navigate to confirmation; clear draft.
- [ ] `BookingConfirmationView`: `useQuery(bookings.getMine)`; while status is `pending_payment` show "Confirming payment…" (webhook race); when `confirmed` show pickup time, address, checklist (same content as the email), and "You'll get a text and email shortly." If `payment_failed` show retry button back to payment step.

## Chunk 4: Operator flow (mobile)

### Task 18: Photos backend and capture component

**Files:** `convex/photos.ts`, `src/features/operator/components/PhotoCapture.tsx`

- [ ] `photos.generateUploadUrl` (`requireOperator`), `photos.attach({ bookingId, phase, storageId, label, lat, lng, accuracy })` sets `takenAt: Date.now()`, `photos.listForBooking({ bookingId, phase })` → `[{ ...photo, url: await ctx.storage.getUrl(storageId) }]`. Renter may also read their own booking's photos (dispute evidence): allow `renter` owner OR operator.
- [ ] `PhotoCapture`: renders `PHOTO_LABELS` as a grid of tiles; each tile is a file input with `capture="environment"`; on select: `navigator.geolocation.getCurrentPosition` (timeout 5 s, on failure proceed without coords and show a warning badge), upload, attach. Shows thumbnail + check. Emits `count`.

### Task 19: Operator list and guard

**Files:** `OperatorGuard.tsx`, `OperatorRentalsView.tsx`, feature barrels, `src/features/index.ts`

- [ ] `OperatorGuard`: `renters.me` → if not `isOperator` render "Not authorized" with home link.
- [ ] `OperatorRentalsView`: `listForOperator` for today −1d to +7d, grouped Today / Upcoming / Out now. Each row: renter name, phone (tel link), vehicle, dates, status, `verifyAtHandoff` badges, button "Handoff" (status `confirmed`) or "Return" (status `checked_out`). Mobile-first: single column, large tap targets.

### Task 20: Handoff view

**Files:** `HandoffView.tsx`, `convex/handoff.ts`

- [ ] Sections in order:
  1. **Verify**: booking summary; license photo displayed next to name; `HANDOFF_CHECKLIST` as large checkboxes; `verifyAtHandoff` items rendered as required extra checks ("Confirm brake controller: yes/no" → records the answer into `handoff.verified`).
  2. **Photos**: `PhotoCapture phase="pickup"`; counter "{n}/{REQUIRED_PICKUP_PHOTOS}".
  3. **Condition report**: renter reads photo grid; copy "Anything not shown here is attributed to you at return."; typed name + checkbox; hands phone to renter.
  4. **Deposit hold**: button "Place {deposit} hold" → `stripe.placeDepositHold`. Success shows "Held until {capture_before}". Failure shows reason + buttons "Retry", "Send invoice link", and "Override (record and continue)" which sets `depositOverride`.
  5. **Complete handoff** → `handoff.completeHandoff({ bookingId, checklist, verified, renterSignatureName })` which validates the invariants in section 3 and transitions `checked_out`.
- [ ] `convex/handoff.ts`: `completeHandoff` mutation (`requireOperator`) enforcing: all checklist true, photo count ≥ required, deposit held or override, signature present.

### Task 21: Return view

**Files:** `ReturnView.tsx`, `PhotoCompare.tsx`, `convex/handoff.ts`

- [ ] `PhotoCapture phase="return"` with the same labels; `PhotoCompare` renders label-aligned pairs (pickup left, return right) as they arrive.
- [ ] Decision: radio "Clean return" / "Damage or overage". Damage reveals: amount (dollars → cents), overage lbs, notes, multi-select of return photo labels to reference. Shows computed total and which path applies (cancel / partial capture / capture + extra charge / off-session charge because hold expired) computed client-side from `depositStatus`, `depositCaptureBefore`, `DEPOSIT_AMOUNT_CENTS` for transparency; the action recomputes.
- [ ] Button "Complete return" → `stripe.settleReturn`. Result screen shows what Stripe did (released / captured X / charged X / invoice sent).
- [ ] `completeReturn` invariants inside `settleReturn` (photos ≥ required) before any Stripe call.

## Chunk 5: Wrap-up

### Task 22: Account bookings and cancellation

**Files:** `MyBookingsView.tsx`

- [ ] List `bookings.listMine` with status chips; link to confirmation; "Cancel" for `confirmed` with policy copy and outcome preview (from `rentalTerms.ts` policy function); calls `bookings.cancel`.
- [ ] Photo evidence: on `returned`/`closed` bookings, show pickup and return photos (`photos.listForBooking`) so the Renter can retrieve dispute evidence.

### Task 23: Ubiquitous language and docs

**Files:** `ubiquitous-language.md`, `README.md`

- [ ] Append terms (section 7 of this plan) to `ubiquitous-language.md`. Add Open Question rows: brake-controller rule, hold window / extended auth, min age.
- [ ] README: env vars table, `npx convex dev`, `stripe listen --forward-to <CONVEX_SITE_URL>/stripe/webhook`.

### Task 24: Deployment

- [ ] `npx convex deploy` (prod); set prod Convex env vars; Vercel env vars; Stripe webhook endpoint pointing at prod `https://<deployment>.convex.site/stripe/webhook` with the four event types + `payment_intent.succeeded`; Clerk prod instance JWT template.

---

## 5. Acceptance criteria (map to spec)

| # | Criterion | Enforced by |
|---|---|---|
| AC1 | Incompatible tow vehicle cannot reach Self Service payment; sees Full Service option | `createDraft` rejects `not_qualified`; `QualificationResult` renders no Continue; Full Service link |
| AC2 | Fixable gap offers adjustable hitch inline | `QualificationResult` add-on toggle; quote includes add-on |
| AC3 | No charge or hold before qualification | `createCheckout` asserts status ≥ `signed`; status machine requires `qualified` before `signed` |
| AC4 | Rental Fee charged and card vaulted in one step | PaymentIntent with `setup_future_usage: "off_session"`; `payment_intent.succeeded` persists `defaultPaymentMethodId` |
| AC5 | Deposit hold at handoff, not booking | `placeDepositHold` only callable by operator on `confirmed` bookings; no hold code in checkout |
| AC6 | Condition photos attached and retrievable | `photos` table keyed by booking + phase; `listForBooking` for operator and Renter |
| AC7 | Signed agreement stored with timestamp, IP, version | `agreement` block written by HTTP action with `x-forwarded-for` |
| AC8 | Clean return releases hold with no dashboard work | `settleReturn` → `paymentIntents.cancel` |
| AC9 | Returning customer with saved vehicle books in under 2 minutes | Skips vehicle, identity; agreement shows 1 initial; payment prefilled by Stripe Link/saved card |

---

## 6. Verification plan (manual, no automated tests per request)

Run with Stripe test mode, `npx convex dev`, `npm start`, and `stripe listen --forward-to http://<dev>.convex.site/stripe/webhook` (dev deployment `.site` URL).

1. **Typecheck**: `npm run typecheck` clean; `npx convex dev` deploys without schema errors.
2. **Not qualified**: sign in, choose Self Service, enter bumper receiver → no Continue, Full Service link lands on `?service=full` request form. Convex dashboard: no `bookings` row; Stripe dashboard: no customer/PI.
3. **Qualified with fix**: 2" ball + 7-blade + brakes yes → adjustable hitch toggle; quote shows add-on row.
4. **Not sure**: brake "not sure" → proceeds; `vehicles.verifyAtHandoff` contains `brakeController`; operator list shows badge.
5. **Availability**: create a confirmed booking; a second draft with overlapping dates is rejected server-side and greyed client-side.
6. **Agreement**: sign; inspect `bookings.agreement` has `ip`, `signedAt`, `version`, five initials.
7. **Payment**: card `4242 4242 4242 4242` → confirmation page transitions from "Confirming…" to details; email arrives (Resend logs) and SMS (Twilio logs). Stripe: PI succeeded, customer has default PM. Card `4000 0000 0000 0002` → `payment_failed` path shows retry.
8. **No early hold**: after payment, Stripe shows exactly one PI (rental fee), none with `capture_method: manual`.
9. **Handoff**: as operator, complete checklist, upload 8 photos (desktop: choose files; mobile: camera), renter signs, place hold → Stripe PI `requires_capture`; `depositCaptureBefore` populated; status `checked_out`. Try completing with 7 photos → rejected.
10. **Hold failure**: vault card `4000 0000 0000 9995` (insufficient funds) in a separate booking → hold fails, invoice link path sends a hosted invoice URL; override path records `depositOverride`.
11. **Clean return**: 8 return photos, "Clean" → PI canceled in Stripe, `depositStatus: released`, status `closed`.
12. **Damage return**: $120 damage + 200 lb overage → PI captured for computed amount, description contains photo ids, remainder released.
13. **Over-hold damage**: $700 → hold captured in full + second off-session PI for remainder.
14. **Webhook idempotency**: `stripe events resend <id>` → `stripeEvents` has one row; no duplicate confirmation email.
15. **Returning customer**: second booking on the same account shows the vehicle chip; only the weight initial is required; stopwatch from landing on `/book/self` to confirmation under 2 minutes.
16. **Operator guard**: non-allowlisted account hitting `/operator` sees "Not authorized"; `listForOperator` throws when called directly from the dashboard as that user.
17. **Regression**: Full Service request still sends the EmailJS email; home, pricing, contract pages unchanged.

---

## 7. Ubiquitous language additions

Append to `ubiquitous-language.md` under a new `### Self Service booking` heading:

- **Tow Vehicle**: the Renter's truck; saved to the account as a Vehicle Profile.
- **Qualification**: the pre-payment check of a Tow Vehicle against Towing Requirements. Outcomes: Qualified, Qualified with a Fix, Not Qualified.
- **Fix**: a remedy for a Qualification gap: an Adjustable Hitch add-on or a part the Renter buys.
- **Verify at Handoff**: a Qualification answer of "not sure" that the Operator confirms in person.
- **Handoff**: the on-site pickup step where the Operator verifies the Renter, records the Condition Report, and places the Deposit Hold.
- **Condition Report**: the timestamped, geotagged photo set and Renter signature taken at Handoff and again at Return.
- **Deposit Hold**: the Security Deposit as an uncaptured Stripe authorization placed at Handoff; released on clean Return or partially captured for damage.
- **Return**: the on-site step closing a Rental Period; settles the Deposit Hold.
- **Operator**: the Owner's on-site staff running Handoff and Return (today, the Owner).
- **Vehicle Profile**: a saved Tow Vehicle and its Qualification, letting a returning Renter skip Qualification.

---

## 8. Out of scope (do not build)

Full Service online payment, Stripe Terminal, GPS tracker, extended authorizations, drawn signatures, admin dashboard beyond the operator list, canvas date picker, EXIF parsing, PDF generation of the signed agreement.
