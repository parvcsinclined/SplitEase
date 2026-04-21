// ── Navbar.jsx ───────────────────────────────────────────────────────
// Top navigation bar with logo, nav links, user avatar, and logout.

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!currentUser) return null;

  const initials = (currentUser.displayName || currentUser.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="navbar-logo">💸</span>
        <span className="navbar-title">SplitEase</span>
      </Link>

      <div className="navbar-links">
        <Link to="/dashboard" className="nav-link" id="nav-dashboard">
          Dashboard
        </Link>
        <Link to="/profile" className="nav-link" id="nav-profile">
          Profile
        </Link>
      </div>

      <div className="navbar-user">
        <div className="avatar" id="user-avatar" title={currentUser.displayName || currentUser.email}>
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="avatar" className="avatar-img" />
          ) : (
            <span className="avatar-initials">{initials}</span>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
