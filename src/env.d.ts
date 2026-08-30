declare namespace NodeJS {
  interface ProcessEnv {
    CLERK_PUBLISHABLE_KEY: string;
    CONVEX_SITE_URL: string;
    CONVEX_URL: string;
    OPERATOR_EMAILS: string;
    RESEND_API_KEY: string;
    RESEND_FROM: string;
    SITE_URL: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_FROM: string;
  }
}
