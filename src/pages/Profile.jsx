// ── Profile.jsx ─────────────────────────────────────────────────────
// User profile page: edit display name, view email, logout.

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateUserProfile, auth } from "../services/firebase";
import Toast from "../components/Toast";

export default function Profile() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setLoading(true);
    try {
      await updateUserProfile(auth.currentUser, { displayName: displayName.trim() });
      setToast({ message: "Profile updated!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = (currentUser?.displayName || currentUser?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page profile-page" id="profile-page">
      <div className="page-header">
        <h1 className="page-title">Your Profile</h1>
      </div>

      <div className="profile-content">
        <div className="card profile-card">
          <div className="profile-avatar-section">
            <div className="avatar avatar-lg">
              <span className="avatar-initials">{initials}</span>
            </div>
            <h2 className="profile-name">{currentUser?.displayName || "User"}</h2>
            <p className="profile-email">{currentUser?.email}</p>
          </div>

          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="profile-name" className="form-label">Display Name</label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={currentUser?.email || ""}
                disabled
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <hr className="divider" />

          <button className="btn btn-danger btn-full" onClick={handleLogout} id="profile-logout-btn">
            Sign Out
          </button>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
