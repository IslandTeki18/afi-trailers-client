import * as React from "react";
import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { ButtonLink } from "~src/components";

const meQuery = makeFunctionReference<"query", Record<string, never>>(
  "renters:me"
);

export function OperatorGuard({ children }: { children: React.ReactNode }) {
  const renter = useQuery(meQuery, {}) as any;

  if (renter === undefined) return <p className="p-6 text-body-2">Checking access...</p>;
  if (!renter?.isOperator) {
    return (
      <div className="mx-auto max-w-site w-full px-5 sm:px-10 py-20">
        <h1 className="display text-5xl text-ink">Not authorized</h1>
        <p className="mt-3 mb-6 text-body-2">This area is for operators only.</p>
        <ButtonLink to="/" variant="amber">Home</ButtonLink>
      </div>
    );
  }

  return <>{children}</>;
}
