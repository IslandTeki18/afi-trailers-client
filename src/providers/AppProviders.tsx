import * as React from "react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ToastProvider } from "./ToastProvider";

const convex = new ConvexReactClient(process.env.CONVEX_URL);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ClerkProvider publishableKey={process.env.CLERK_PUBLISHABLE_KEY}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ToastProvider>{children}</ToastProvider>
    </ConvexProviderWithClerk>
  </ClerkProvider>
);
