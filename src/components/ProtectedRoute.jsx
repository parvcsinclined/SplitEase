// ── ProtectedRoute.jsx ──────────────────────────────────────────────
// HOC guard: redirects unauthenticated users to /login.
// Uses useContext to check AuthContext.

import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
