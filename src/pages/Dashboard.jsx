// ── Dashboard.jsx ───────────────────────────────────────────────────
// Main hub: lists all groups + total balance summary.
// Hooks: useMemo (derived total balance), useNavigate (programmatic nav)

import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useGroups } from "../hooks/useGroups";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const { groups, loading } = useGroups();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // useMemo: derived value — only recalculates when groups change
  const stats = useMemo(() => {
    return {
      totalGroups: groups.length,
      totalMembers: groups.reduce((acc, g) => acc + (g.members?.length || 0), 0),
    };
  }, [groups]);

  if (loading) return <Spinner />;

  return (
    <div className="page dashboard-page" id="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome, {currentUser?.displayName || "User"} 👋
          </h1>
          <p className="page-subtitle">Manage your shared expenses</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
          id="create-group-btn"
        >
          + New Group
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <span className="stat-value">{stats.totalGroups}</span>
            <span className="stat-label">Groups</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <span className="stat-value">{stats.totalMembers}</span>
            <span className="stat-label">Total Members</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">₹0</span>
            <span className="stat-label">You Owe</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">💸</span>
          <div className="stat-info">
            <span className="stat-value">₹0</span>
            <span className="stat-label">Owed to You</span>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="section">
        <h2 className="section-title">Your Groups</h2>
        {groups.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📂</span>
            <h3>No groups yet</h3>
            <p>Create your first group to start splitting expenses!</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create Group
            </button>
          </div>
        ) : (
          <div className="groups-grid">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => navigate(`/group/${group.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
