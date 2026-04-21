// ── ExpenseItem.jsx ──────────────────────────────────────────────────
// Single expense row showing description, amount, payer, and split info.

export default function ExpenseItem({ expense, memberNames, onDelete }) {
  const payer = memberNames?.[expense.paidBy] || expense.paidBy?.slice(0, 8);
  const splitCount = expense.splitAmong?.length || 1;
  const perPerson = (Number(expense.amount) / splitCount).toFixed(2);
  const date = expense.createdAt?.toDate
    ? expense.createdAt.toDate().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <div className="expense-item" id={`expense-${expense.id}`}>
      <div className="expense-item-left">
        <div className="expense-icon">🧾</div>
        <div className="expense-details">
          <h4 className="expense-desc">{expense.description}</h4>
          <p className="expense-meta">
            Paid by <strong>{payer}</strong> · Split {splitCount} way{splitCount > 1 ? "s" : ""}
          </p>
          {date && <span className="expense-date">{date}</span>}
        </div>
      </div>
      <div className="expense-item-right">
        <span className="expense-amount">₹{Number(expense.amount).toLocaleString("en-IN")}</span>
        <span className="expense-per-person">₹{perPerson}/person</span>
        {onDelete && (
          <button
            className="btn btn-ghost btn-sm btn-danger"
            onClick={() => onDelete(expense.id)}
            title="Delete expense"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}
