// ── App.jsx ──────────────────────────────────────────────────────────
// Root component: AuthProvider + BrowserRouter + Suspense + React.lazy
// React.lazy: dynamically imports page components for code-splitting
// Suspense: shows fallback spinner while lazy chunks are downloading

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Spinner from "./components/Spinner";

// React.lazy: each page is a separate JS chunk — only downloaded when visited
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const GroupDetail = React.lazy(() => import("./pages/GroupDetail"));
const SettleUp = React.lazy(() => import("./pages/SettleUp"));
const Profile = React.lazy(() => import("./pages/Profile"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-main">
          {/* Suspense: fallback UI while lazy chunks load */}
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes — redirects to /login if unauthenticated */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/group/:id" element={<GroupDetail />} />
                <Route path="/group/:id/settle" element={<SettleUp />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Catch-all: redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
