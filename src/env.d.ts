declare namespace NodeJS {
  interface ProcessEnv {
    CLERK_PUBLISHABLE_KEY: string;
    CONVEX_SITE_URL: string;
    CONVEX_URL: string;
    SITE_URL: string;
    STRIPE_PUBLISHABLE_KEY: string;
  }
}

declare const process: { env: NodeJS.ProcessEnv };
