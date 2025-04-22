import * as React from "react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "~src/features/auth";

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
