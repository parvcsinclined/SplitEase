// ── SettleUp.jsx ─────────────────────────────────────────────────────
// Settlement view: displays optimized debt suggestions using the
// greedy algorithm from useSettlement.js.
// Route: /group/:id/settle

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useExpenses } from "../hooks/useExpenses";
import { useSettlement } from "../hooks/useSettlement";
import { getGroupById, getUsersByIds, addSettlementToDb } from "../services/firebase";
import SettlementCard from "../components/SettlementCard";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

export default function SettleUp() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { expenses, settlements, loading: expLoading } = useExpenses(groupId);

  const [group, setGroup] = useState(null);
  const [memberNames, setMemberNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Fetch group details
  useEffect(() => {
    async function fetchGroup() {
      const g = await getGroupById(groupId);
      if (!g) {
        navigate("/dashboard");
        return;
      }
      setGroup(g);
      const users = await getUsersByIds(g.members || []);
      const nameMap = {};
      users.forEach((u) => {
        nameMap[u.uid || u.id] = u.displayName || u.email || u.id;
      });
      if (currentUser && !nameMap[currentUser.uid]) {
        nameMap[currentUser.uid] = currentUser.displayName || currentUser.email;
      }
      setMemberNames(nameMap);
      setLoading(false);
    }
    fetchGroup();
  }, [groupId, currentUser, navigate]);

  // Run the greedy settlement algorithm via useMemo inside the hook
  const { optimizedDebts } = useSettlement(
    expenses,
    settlements,
    group?.members || []
  );

  const handleSettle = async (transaction) => {
    try {
      await addSettlementToDb(groupId, {
        from: transaction.from,
        to: transaction.to,
        amount: transaction.amount,
      });
      setToast({ message: "Settlement recorded!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  if (loading || expLoading) return <Spinner />;

  return (
    <div className="page settle-page" id="settle-page">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/group/${groupId}`)}>
            ← Back to {group?.name || "Group"}
          </button>
          <h1 className="page-title">⚖️ Settle Up</h1>
          <p className="page-subtitle">
            Optimized settlements for <strong>{group?.name}</strong>
          </p>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="card info-card">
        <h3 className="card-title">💡 Smart Settlement</h3>
        <p className="card-text">
          Our greedy algorithm calculates the minimum number of transactions needed
          to settle all debts. Instead of everyone paying everyone back individually,
          we optimize the transfers.
        </p>
      </div>

      {/* Settlement Results */}
      <div className="section">
        <h2 className="section-title">
          Recommended Transfers ({optimizedDebts.length})
        </h2>

        {optimizedDebts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✅</span>
            <h3>All Settled!</h3>
            <p>No outstanding debts in this group.</p>
          </div>
        ) : (
          <div className="settlements-list">
            {optimizedDebts.map((t, i) => (
              <SettlementCard
                key={`${t.from}-${t.to}-${i}`}
                transaction={t}
                memberNames={memberNames}
                onSettle={handleSettle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Settlements */}
      {settlements.length > 0 && (
        <div className="section">
          <h2 className="section-title">Past Settlements ({settlements.length})</h2>
          <div className="settlements-history">
            {settlements.map((s) => (
              <div key={s.id} className="settlement-history-item">
                <span className="settlement-history-text">
                  <strong>{memberNames[s.from] || s.from?.slice(0, 8)}</strong>
                  {" paid "}
                  <strong>{memberNames[s.to] || s.to?.slice(0, 8)}</strong>
                </span>
                <span className="settlement-history-amount">
                  ₹{Number(s.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
