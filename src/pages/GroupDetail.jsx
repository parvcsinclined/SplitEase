// ── GroupDetail.jsx ──────────────────────────────────────────────────
// Single group view: expenses list, add expense, and navigate to settle.
// Route: /group/:id

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useExpenses } from "../hooks/useExpenses";
import { getGroupById, getUsersByIds } from "../services/firebase";
import ExpenseItem from "../components/ExpenseItem";
import AddExpenseModal from "../components/AddExpenseModal";
import Spinner from "../components/Spinner";

export default function GroupDetail() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { expenses, loading: expLoading, addExpense, deleteExpense } = useExpenses(groupId);

  const [group, setGroup] = useState(null);
  const [memberNames, setMemberNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Fetch group details and member names
  useEffect(() => {
    async function fetchGroup() {
      const g = await getGroupById(groupId);
      if (!g) {
        navigate("/dashboard");
        return;
      }
      setGroup(g);

      // Resolve member UIDs to display names
      const users = await getUsersByIds(g.members || []);
      const nameMap = {};
      users.forEach((u) => {
        nameMap[u.uid || u.id] = u.displayName || u.email || u.id;
      });
      // Ensure current user is in map
      if (currentUser && !nameMap[currentUser.uid]) {
        nameMap[currentUser.uid] = currentUser.displayName || currentUser.email;
      }
      setMemberNames(nameMap);
      setLoading(false);
    }
    fetchGroup();
  }, [groupId, currentUser, navigate]);

  if (loading || expLoading) return <Spinner />;

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="page group-detail-page" id="group-detail-page">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1 className="page-title">{group?.name || "Group"}</h1>
          {group?.description && <p className="page-subtitle">{group.description}</p>}
        </div>
        <div className="page-actions">
          <Link to={`/group/${groupId}/settle`} className="btn btn-secondary" id="settle-up-link">
            ⚖️ Settle Up
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => setShowExpenseModal(true)}
            id="add-expense-btn"
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="card members-card">
        <h3 className="card-title">Members ({group?.members?.length || 0})</h3>
        <div className="members-list">
          {(group?.members || []).map((uid) => (
            <div key={uid} className="member-chip">
              <div className="avatar avatar-xs">
                <span className="avatar-initials">
                  {(memberNames[uid] || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{memberNames[uid] || uid.slice(0, 8)}</span>
              {uid === currentUser?.uid && <span className="badge badge-accent">You</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid stats-grid-sm">
        <div className="card stat-card">
          <span className="stat-icon">🧾</span>
          <div className="stat-info">
            <span className="stat-value">{expenses.length}</span>
            <span className="stat-label">Expenses</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">₹{totalExpenses.toLocaleString("en-IN")}</span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="section">
        <h2 className="section-title">Expenses</h2>
        {expenses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🧾</span>
            <h3>No expenses yet</h3>
            <p>Add your first expense to start tracking!</p>
            <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>
              Add Expense
            </button>
          </div>
        ) : (
          <div className="expenses-list">
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                memberNames={memberNames}
                onDelete={deleteExpense}
              />
            ))}
          </div>
        )}
      </div>

      <AddExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSubmit={addExpense}
        members={group?.members || []}
        memberNames={memberNames}
        currentUserId={currentUser?.uid}
      />
    </div>
  );
}
