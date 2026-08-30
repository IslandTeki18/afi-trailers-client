# Afi Trailers Client

Public site and self-service booking flow for AFI Trailers.

## Setup

```sh
npm install
npx convex dev
npm start
```

Run Stripe webhooks locally with:

```sh
stripe listen --forward-to <CONVEX_SITE_URL>/stripe/webhook
```

## Environment

| Name | Location | Used for |
|---|---|---|
| `CLERK_PUBLISHABLE_KEY` | app env | Clerk UI |
| `CONVEX_URL` | app env | Convex client |
| `CONVEX_SITE_URL` | app env | agreement HTTP action |
| `SITE_URL` | app + Convex env | redirects and CORS |
| `STRIPE_PUBLISHABLE_KEY` | app env | Stripe Elements |
| `CLERK_ISSUER_URL` | Convex env | auth config |
| `OPERATOR_EMAILS` | Convex env | operator guard |
| `RESEND_API_KEY`, `RESEND_FROM` | Convex env | email notifications |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Convex env | payments and webhooks |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | Convex env | SMS notifications |

## Checks

```sh
npm run typecheck
npm run build
npx convex dev --once
```

## License

ISC
