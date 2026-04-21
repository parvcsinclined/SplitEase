// ── SettlementCard.jsx ──────────────────────────────────────────────
// Displays one recommended transfer (A → B: ₹X) with settle button.

export default function SettlementCard({ transaction, memberNames, onSettle }) {
  const fromName = memberNames?.[transaction.from] || transaction.from?.slice(0, 8);
  const toName = memberNames?.[transaction.to] || transaction.to?.slice(0, 8);

  return (
    <div className="card settlement-card" id={`settlement-${transaction.from}-${transaction.to}`}>
      <div className="settlement-flow">
        <div className="settlement-person">
          <div className="avatar avatar-sm">
            <span className="avatar-initials">
              {fromName?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <span className="settlement-name">{fromName}</span>
        </div>

        <div className="settlement-arrow">
          <span className="settlement-amount-label">
            ₹{transaction.amount.toLocaleString("en-IN")}
          </span>
          <div className="arrow-line">
            <span>→</span>
          </div>
        </div>

        <div className="settlement-person">
          <div className="avatar avatar-sm">
            <span className="avatar-initials">
              {toName?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <span className="settlement-name">{toName}</span>
        </div>
      </div>

      {onSettle && (
        <button
          className="btn btn-primary btn-sm settle-btn"
          onClick={() => onSettle(transaction)}
          id={`settle-btn-${transaction.from}`}
        >
          Record Payment
        </button>
      )}
    </div>
  );
}
