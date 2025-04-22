import * as React from "react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "~src/features/auth";

interface RoleGuardProps {
  allowedRoles: string[]; // Example: ['admin', 'manager']
  fallbackPath?: string; // Default: '/dashboard'
  children: ReactNode;
}

export const RoleGuard = ({
  allowedRoles,
  fallbackPath = "/dashboard",
  children,
}: RoleGuardProps) => {
  const { user, isAuthenticated } = useAuth();

  const hasAccess =
    isAuthenticated && user?.role && allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
