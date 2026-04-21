// ── AddExpenseModal.jsx ─────────────────────────────────────────────
// Modal form to add a new expense to a group.
// Hooks: useState (controlled inputs), useRef (auto-focus amount input)

import { useState, useRef, useEffect } from "react";

export default function AddExpenseModal({ isOpen, onClose, onSubmit, members, memberNames, currentUserId }) {
  // useState: controlled form inputs
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(currentUserId || "");
  const [splitAmong, setSplitAmong] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useRef: reference to amount input for auto-focus
  const amountRef = useRef(null);

  // Focus the amount input when modal opens (imperative DOM via useRef)
  useEffect(() => {
    if (isOpen && amountRef.current) {
      setTimeout(() => amountRef.current.focus(), 100);
    }
    if (isOpen) {
      setPaidBy(currentUserId || "");
      setSplitAmong(members || []);
    }
  }, [isOpen, currentUserId, members]);

  const handleToggleMember = (uid) => {
    setSplitAmong((prev) =>
      prev.includes(uid) ? prev.filter((m) => m !== uid) : [...prev, uid]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return setError("Description is required");
    if (!amount || Number(amount) <= 0) return setError("Enter a valid amount");
    if (!paidBy) return setError("Select who paid");
    if (splitAmong.length === 0) return setError("Select at least one person to split with");

    setLoading(true);
    setError("");
    try {
      await onSubmit({
        description: description.trim(),
        amount: Number(amount),
        paidBy,
        splitAmong,
        splitType: "equal",
      });
      setDescription("");
      setAmount("");
      setError("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} id="add-expense-modal">
        <div className="modal-header">
          <h2 className="modal-title">Add Expense</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="expense-desc" className="form-label">Description *</label>
            <input
              id="expense-desc"
              type="text"
              className="form-input"
              placeholder="e.g., Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expense-amount" className="form-label">Amount (₹) *</label>
            <input
              id="expense-amount"
              ref={amountRef}
              type="number"
              className="form-input"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expense-paidby" className="form-label">Paid By *</label>
            <select
              id="expense-paidby"
              className="form-input form-select"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              <option value="">Select payer</option>
              {(members || []).map((uid) => (
                <option key={uid} value={uid}>
                  {memberNames?.[uid] || uid.slice(0, 8)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Split Among *</label>
            <div className="checkbox-group">
              {(members || []).map((uid) => (
                <label key={uid} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={splitAmong.includes(uid)}
                    onChange={() => handleToggleMember(uid)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    {memberNames?.[uid] || uid.slice(0, 8)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {amount && splitAmong.length > 0 && (
            <div className="expense-preview">
              <span>₹{(Number(amount) / splitAmong.length).toFixed(2)} per person</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
