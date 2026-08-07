import React, { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMain } from "../context/MainContext";

/**
 * ROLE CONFIGURATION
 */
const ROLE_CONFIG = {
  admin: {
    dashboard: "/admin/dashboard",
    routePrefix: "/admin",
  },
  college: {
    dashboard: "/college/dashboard",
    routePrefix: "/college",
  },
  company: {
    dashboard: "/company/dashboard",
    routePrefix: "/company",
  },
  influencer: {
    dashboard: "/influencer/dashboard",
    routePrefix: "/influencer",
  },
};

const AUTH_ROUTE_PREFIX = "/auth";
const DEFAULT_FALLBACK = "/auth/login";

/**
 * Development Debug Logs
 */
const debugLog = (...args) => {
  if (import.meta.env.DEV) {
    console.log("[MainLayout]", ...args);
  }
};

const debugWarn = (...args) => {
  if (import.meta.env.DEV) {
    console.warn("[MainLayout Warning]", ...args);
  }
};

const MainLayout = () => {
  const { user,isAuthenticated} = useMain();
  const location = useLocation();
  const pathname = location.pathname;

 

  // ============================================================================
  // DERIVED VALUES
  // ============================================================================
  const userRole = useMemo(() => {
    const role = user?.role;
    if (!role || typeof role !== "string") return "";
    return role.toLowerCase().trim();
  }, [user]);

  const roleConfig = useMemo(() => {
    return ROLE_CONFIG[userRole] || null;
  }, [userRole]);

  const dashboardPath = useMemo(() => {
    return roleConfig?.dashboard || DEFAULT_FALLBACK;
  }, [roleConfig]);

  const allowedRoutePrefix = useMemo(() => {
    return roleConfig?.routePrefix || "";
  }, [roleConfig]);

  const isAuthRoute = useMemo(() => {
    return pathname.startsWith(AUTH_ROUTE_PREFIX);
  }, [pathname]);

  // ============================================================================
  // ROLE VALIDATION
  // ============================================================================
  useEffect(() => {
    if (isAuthenticated && userRole && !ROLE_CONFIG[userRole]) {
      debugWarn(`Unknown role detected: "${userRole}"`);
    }
  }, [isAuthenticated, userRole]);



  // ============================================================================
  // 2. AUTH ROUTES
  // ============================================================================
  if (isAuthRoute) {
    if (isAuthenticated && roleConfig) {
      debugLog(`Authenticated ${userRole} trying to access auth route -> redirecting`);
      return <Navigate to={dashboardPath} replace />;
    }

    return <Outlet />;
  }

  // ============================================================================
  // 3. PROTECTED ROUTES (Requires Login)
  // ============================================================================
  if (!isAuthenticated) {
    debugLog("Unauthenticated access -> redirecting to login");
    return <Navigate to={DEFAULT_FALLBACK} replace state={{ from: location }} />;
  }

  // ============================================================================
  // 4. ROLE-BASED ACCESS CONTROL
  // ============================================================================
  if (!roleConfig) {
    debugWarn(`Invalid role: "${userRole}"`);
    return (
      <Navigate
        to={DEFAULT_FALLBACK}
        replace
        state={{ error: "invalid_role" }}
      />
    );
  }

  const isAllowedRoute =
    pathname === allowedRoutePrefix ||
    pathname.startsWith(`${allowedRoutePrefix}/`);

  if (!isAllowedRoute) {
    debugWarn(`${userRole} tried to access unauthorized route: ${pathname}`);

    return (
      <Navigate
        to={dashboardPath}
        replace
        state={{ error: "unauthorized_access" }}
      />
    );
  }

  // ============================================================================
  // 5. ACCESS GRANTED
  // ============================================================================
  return <Outlet />;
};





export default MainLayout;
